export type FolioEdition = 'normal' | 'crimson' | 'lullaby';

/** 自包含：同一加载器既供主模块调用，也在构建期内联到解析前引导。 */
export function loadFolioEdition(
  poster: HTMLElement,
  edition: FolioEdition,
  conceal = false,
): void {
  const image = poster.querySelector<HTMLImageElement>('[data-folio-image]');
  if (!image || poster.dataset.folioLoading === edition) {
    return;
  }
  const src = image.dataset[`${edition}Src`];
  const srcset = image.dataset[`${edition}Srcset`] ?? '';
  if (!src) {
    return;
  }

  const request = String(Number(poster.dataset.folioLoadId ?? 0) + 1);
  poster.dataset.folioLoadId = request;
  delete poster.dataset.folioLoading;
  if (edition === 'normal' || poster.dataset.folioEdition === edition) {
    if (image.getAttribute('src') !== src || image.getAttribute('srcset') !== srcset) {
      image.srcset = srcset;
      image.src = src;
      poster.dataset.folioEdition = edition;
    }
    delete poster.dataset.folioConcealed;
    delete poster.dataset.folioFallback;
    return;
  }

  poster.dataset.folioLoading = edition;
  if (conceal || poster.dataset.folioEdition !== edition) {
    poster.dataset.folioConcealed = '';
  }
  const current = () =>
    poster.dataset.folioLoadId === request && poster.dataset.folioRequested === edition;
  // 慢图继续等待；二／三级不能用不匹配的旧封面充当可读降级。
  const timeout = setTimeout(() => {
    if (!current()) {
      return;
    }
    poster.dataset.folioFallback = edition;
    if (document.documentElement.dataset.pollutionLevel === '1') {
      delete poster.dataset.folioConcealed;
    }
  }, 5000);
  const candidate = new Image();
  candidate.sizes = image.sizes;
  candidate.srcset = srcset;
  candidate.src = src;
  void candidate
    .decode()
    .then(async () => {
      if (!current()) {
        return;
      }
      // 已在临近视口预解码，不能再被原图的原生 lazy 门槛卡住第二次 decode。
      image.loading = 'eager';
      image.srcset = srcset;
      image.src = src;
      await image.decode();
      if (!current()) {
        return;
      }
      poster.dataset.folioEdition = edition;
      delete poster.dataset.folioFallback;
    })
    .catch(() => {
      if (!current()) {
        return;
      }
      // 真正的请求／解码失败才结束这次换图，并保留可读原图。
      image.srcset = image.dataset.normalSrcset ?? '';
      image.src = image.dataset.normalSrc ?? '';
      poster.dataset.folioEdition = 'normal';
      poster.dataset.folioFallback = edition;
    })
    .finally(() => {
      clearTimeout(timeout);
      if (!current()) {
        return;
      }
      delete poster.dataset.folioLoading;
      delete poster.dataset.folioConcealed;
    });
}

/** 恢复已有会话的封面选择；不进行污染判定或状态写入。 */
export function initEarlyFolioCovers(
  load: typeof loadFolioEdition,
  select: (catalog: readonly string[], seed: number) => Set<string>,
  storageKey: string,
): void {
  const root = document.documentElement;
  if (!['1', '2', '3'].includes(root.dataset.pollutionLevel ?? '')) {
    return;
  }
  let seed: number | undefined;
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null');
    const value =
      stored && typeof stored === 'object' && 'seed' in stored ? stored.seed : undefined;
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 0xffffffff) {
      seed = value;
    }
  } catch {
    // 旧会话缺少种子时由主控制器补齐，早期阶段不创建第二套随机数。
  }
  if (root.dataset.pollutionLevel === '1' && seed === undefined) {
    return;
  }
  root.dataset.folioBootstrap = '';
  const registered = new WeakSet<HTMLElement>();
  const prepare = (poster: HTMLElement) => {
    const level = root.dataset.pollutionLevel;
    if (level !== '1' && level !== '2' && level !== '3') {
      return;
    }
    const selected =
      seed === undefined
        ? false
        : select((poster.dataset.folioCatalog ?? '').split(','), seed).has(
            poster.dataset.folioCover ?? '',
          );
    const edition = level === '3' ? 'lullaby' : level === '2' || selected ? 'crimson' : 'normal';
    poster.dataset.folioRequested = edition;
    load(poster, edition, true);
  };
  const viewport =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) {
                continue;
              }
              prepare(entry.target as HTMLElement);
              viewport?.unobserve(entry.target);
            }
          },
          { rootMargin: '100% 0px' },
        )
      : null;
  const register = (image: Element) => {
    const poster = image.closest<HTMLElement>('[data-folio-cover]');
    if (!poster || registered.has(poster)) {
      return;
    }
    registered.add(poster);
    // 首屏不等待 IntersectionObserver 的下一帧回调。
    const bounds = poster.getBoundingClientRect();
    if (!viewport || (bounds.top < innerHeight * 2 && bounds.bottom > -innerHeight)) {
      prepare(poster);
    } else {
      viewport.observe(poster);
    }
  };
  const scan = (node: Node) => {
    if (!(node instanceof Element)) {
      return;
    }
    if (node.matches('[data-folio-image]')) {
      register(node);
    }
    node.querySelectorAll('[data-folio-image]').forEach(register);
  };
  const parser = new MutationObserver((records) => {
    for (const record of records) {
      record.addedNodes.forEach(scan);
    }
  });
  parser.observe(root, { childList: true, subtree: true });
  scan(root);
  document.addEventListener('DOMContentLoaded', () => parser.disconnect(), { once: true });
}
