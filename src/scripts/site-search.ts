import type { SiteSearchEntry } from '../data/site-search-index';
import { formatMessage } from '../data/localized/format';
import type { SearchMessages } from '../data/localized/schema';

const normalize = (value: string, locale: string) =>
  value.normalize('NFKC').trim().toLocaleLowerCase(locale);

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
    let messages: SearchMessages;
    try {
      entries = JSON.parse(root.dataset.searchIndex ?? '[]') as SiteSearchEntry[];
      messages = JSON.parse(root.dataset.searchMessages ?? '{}') as SearchMessages;
    } catch {
      return;
    }
    if (typeof messages.unavailable !== 'string' || typeof messages.prompt !== 'string') {
      return;
    }
    const locale = root.dataset.searchLocale ?? document.documentElement.lang;

    const search = (rawQuery: string) => {
      const query = normalize(rawQuery, locale);
      results.replaceChildren();

      if (!query) {
        feedback.textContent = messages.prompt;
        return;
      }

      const matches = entries.filter((entry) =>
        normalize(`${entry.title} ${entry.summary} ${entry.keywords}`, locale).includes(query),
      );

      feedback.textContent =
        matches.length > 0
          ? formatMessage(messages.resultCount, { count: matches.length })
          : messages.noResults;
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
