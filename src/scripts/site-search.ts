import type { SiteSearchEntry } from '../data/site-search-index';

const normalize = (value: string) => value.normalize('NFKC').trim().toLocaleLowerCase('zh-CN');

function createResult(entry: SiteSearchEntry, canBePolluted: boolean): HTMLLIElement {
  const item = document.createElement('li');
  const link = document.createElement('a');
  const type = document.createElement('span');
  const title = document.createElement('strong');
  const summary = document.createElement('p');

  link.href = entry.href;
  type.textContent = entry.typeLabel;
  title.textContent = entry.title;
  summary.textContent = entry.summary;
  link.append(type, title, summary);
  item.append(link);
  if (canBePolluted) {
    item.dataset.pollutionSlot = 'search-result';
  }
  return item;
}

export function initSiteSearch(): void {
  document.querySelectorAll<HTMLElement>('[data-site-search]').forEach((root) => {
    const form = root.querySelector<HTMLFormElement>('[data-search-form]');
    const input = root.querySelector<HTMLInputElement>('[data-search-input]');
    const feedback = root.querySelector<HTMLElement>('[data-search-feedback]');
    const results = root.querySelector<HTMLOListElement>('[data-search-results]');
    if (!form || !input || !feedback || !results) {
      return;
    }

    let entries: SiteSearchEntry[];
    try {
      entries = JSON.parse(root.dataset.searchIndex ?? '[]') as SiteSearchEntry[];
    } catch {
      feedback.textContent = '搜索索引暂时不可用。请使用主导航继续浏览。';
      return;
    }

    const search = (rawQuery: string) => {
      const query = normalize(rawQuery);
      results.replaceChildren();

      if (!query) {
        feedback.textContent = '输入关键词以查找场次、剧目与网站栏目。';
        return;
      }

      const matches = entries.filter((entry) =>
        normalize(`${entry.title} ${entry.summary} ${entry.keywords}`).includes(query),
      );

      feedback.textContent =
        matches.length > 0 ? `找到 ${matches.length} 条结果。` : '没有找到匹配内容。';
      const canBePolluted = root.classList.contains('search-workspace--archive');
      results.append(...matches.map((entry) => createResult(entry, canBePolluted)));
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (root.classList.contains('search-workspace--archive')) {
        document.dispatchEvent(new CustomEvent('crimson:archive-search-submit'));
      }
      const query = input.value.trim();
      const url = new URL(window.location.href);
      if (query) {
        url.searchParams.set('q', query);
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url);
      search(query);
    });

    const initialQuery = new URL(window.location.href).searchParams.get('q') ?? '';
    input.value = initialQuery;
    search(initialQuery);
  });
}
