import type { PollutionLevel, PollutionState } from './pollution-state.ts';

function hash(value: string): number {
  let result = 0x811c9dc5;
  for (const character of value) {
    result = Math.imul(result ^ (character.codePointAt(0) ?? 0), 0x01000193);
  }
  return result >>> 0;
}

/** 同一会话按剧目身份抽样；详情页和列表不分别抽签。 */
export function selectCrimsonFolioIds(catalog: readonly string[], seed: number): Set<string> {
  const ids = [...new Set(catalog.filter(Boolean))].sort();
  let value = seed >>> 0;
  for (let index = ids.length - 1; index > 0; index -= 1) {
    value += 0x6d2b79f5;
    let random = Math.imul(value ^ (value >>> 15), value | 1);
    random ^= random + Math.imul(random ^ (random >>> 7), random | 61);
    const target = Math.floor((((random ^ (random >>> 14)) >>> 0) / 4294967296) * (index + 1));
    [ids[index], ids[target]] = [ids[target], ids[index]];
  }
  return new Set(ids.slice(0, Math.round(ids.length / 3)));
}

/** 只替换文字字素，保留标点与空白；更高等级包含较低等级已涂黑的位置。 */
export function redactNarrativeText(text: string, level: PollutionLevel, seed: number): string {
  if (level === 0) {
    return text;
  }
  const segments = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)];
  const threshold = [0, 9, 18, 27][level];
  const identity = hash(text);
  return segments
    .map(({ segment }, index) => {
      const hidden = hash(`${identity}:${seed}:${Math.floor(index / 3)}`) % 100 < threshold;
      return hidden && /[\p{L}\p{N}]/u.test(segment) ? '█' : segment;
    })
    .join('');
}

type Edition = 'normal' | 'crimson' | 'lullaby';

export function createArchiveFolioEffects(root: HTMLElement): {
  apply(state: PollutionState): void;
} {
  const posters = [...root.querySelectorAll<HTMLElement>('[data-folio-cover]')];
  const visible = new Set<HTMLElement>();
  const requests = new WeakMap<HTMLElement, number>();
  const decoded = new Map<string, Promise<void>>();
  const originals = new Map<Text, string>();
  const paragraphs = [
    ...root.querySelectorAll<HTMLElement>(
      '.archive-home__copy > p:not(.archive-kicker), .page-intro > p:not(.eyebrow), .detail-section.prose p, .archive-company p',
    ),
  ];
  for (const paragraph of paragraphs) {
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (
        !node.parentElement?.closest(
          'a, button, label, input, select, textarea, dialog, [aria-live], [aria-hidden="true"], .visually-hidden, [data-pollution-protected], [data-pollution-safe]',
        ) &&
        node.textContent?.trim()
      ) {
        originals.set(node, node.textContent);
      }
    }
  }

  const prepare = async (poster: HTMLElement) => {
    const image = poster.querySelector<HTMLImageElement>('[data-folio-image]');
    const edition = poster.dataset.folioRequested as Edition;
    if (!image || !edition || poster.dataset.folioEdition === edition) {
      return;
    }
    const src = image.dataset[`${edition}Src`];
    const srcset = image.dataset[`${edition}Srcset`] ?? '';
    if (!src) {
      return;
    }
    const request = (requests.get(poster) ?? 0) + 1;
    requests.set(poster, request);
    const key = `${src}|${srcset}|${image.sizes}`;
    try {
      if (edition !== 'normal') {
        let pending = decoded.get(key);
        if (!pending) {
          const candidate = new Image();
          candidate.sizes = image.sizes;
          candidate.srcset = srcset;
          candidate.src = src;
          pending = candidate.decode();
          decoded.set(key, pending);
        }
        await pending;
      }
      if (requests.get(poster) !== request || poster.dataset.folioRequested !== edition) {
        return;
      }
      image.srcset = srcset;
      image.src = src;
      poster.dataset.folioEdition = edition;
    } catch {
      decoded.delete(key);
      // 可选污染图失败时保留已可读的封面，下一次应用状态可重试。
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const poster = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visible.add(poster);
            void prepare(poster);
          } else {
            visible.delete(poster);
          }
        }
      },
      { rootMargin: '100% 0px' },
    );
    posters.forEach((poster) => observer.observe(poster));
  } else {
    posters.forEach((poster) => visible.add(poster));
  }

  return {
    apply(state) {
      const seed = state.seed ?? state.variant;
      for (const poster of posters) {
        const chosen = selectCrimsonFolioIds((poster.dataset.folioCatalog ?? '').split(','), seed);
        const edition: Edition =
          state.level === 3
            ? 'lullaby'
            : state.level === 2 ||
                (state.level === 1 && chosen.has(poster.dataset.folioCover ?? ''))
              ? 'crimson'
              : 'normal';
        poster.dataset.folioRequested = edition;
        if (edition === 'normal' || visible.has(poster)) {
          void prepare(poster);
        }
      }
      for (const [node, original] of originals) {
        node.textContent = redactNarrativeText(original, state.level, seed);
      }
      for (const paragraph of paragraphs) {
        paragraph.toggleAttribute(
          'data-pollution-redacted',
          state.level > 0 && paragraph.textContent?.includes('█') === true,
        );
      }
    },
  };
}
