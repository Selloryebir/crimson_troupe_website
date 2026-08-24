import type { SiteSearchEntry, SiteSearchProjection } from '../data/site-search-index.ts';
import { formatMessage } from '../data/localized/format.ts';
import type { SearchMessages } from '../data/localized/schema.ts';

const normalize = (value: string, locale: string) =>
  value.normalize('NFKC').trim().toLocaleLowerCase(locale);

export type SiteSearchMatchKind = 'title' | 'detail';

export interface SiteSearchMatch {
  entry: SiteSearchEntry;
  matchKind: SiteSearchMatchKind;
  startsTypeGroup: boolean;
}

const entryTypeOrder: Readonly<Record<SiteSearchEntry['type'], number>> = Object.freeze({
  page: 0,
  performance: 1,
  production: 2,
});

export function searchSiteEntries(
  entries: readonly SiteSearchEntry[],
  rawQuery: string,
  locale: string,
): SiteSearchMatch[] {
  const query = normalize(rawQuery, locale);
  if (!query) {
    return [];
  }

  const matches = entries.flatMap((entry, sourceIndex) => {
    const titleMatches = normalize(entry.title, locale).includes(query);
    const detailMatches = normalize(`${entry.summary} ${entry.keywords}`, locale).includes(query);
    return titleMatches || detailMatches
      ? [{ entry, matchKind: titleMatches ? ('title' as const) : ('detail' as const), sourceIndex }]
      : [];
  });
  matches.sort(
    (left, right) =>
      Number(left.matchKind === 'detail') - Number(right.matchKind === 'detail') ||
      entryTypeOrder[left.entry.type] - entryTypeOrder[right.entry.type] ||
      left.sourceIndex - right.sourceIndex,
  );

  return matches.map(({ entry, matchKind }, index) => ({
    entry,
    matchKind,
    startsTypeGroup:
      index === 0 ||
      matches[index - 1].matchKind !== matchKind ||
      matches[index - 1].entry.type !== entry.type,
  }));
}

function appendProjectedText(
  element: HTMLElement,
  source: string,
  projection: string | undefined,
  field: string,
): void {
  if (!projection) {
    element.textContent = source;
    return;
  }
  const sourceText = document.createElement('span');
  sourceText.className = 'archive-projection-source';
  sourceText.dataset.archiveProjectionSource = '';
  sourceText.textContent = source;
  const projectionText = document.createElement('span');
  projectionText.className = 'archive-projection-level3';
  projectionText.dataset.archiveProjectionLevel3 = '';
  projectionText.dataset.archiveProjectionField = field;
  projectionText.textContent = projection;
  element.append(sourceText, projectionText);
}

function createResult(
  entry: SiteSearchEntry,
  matchKind: SiteSearchMatchKind,
  startsTypeGroup: boolean,
  archiveProjection: SiteSearchProjection | undefined,
): HTMLLIElement {
  const item = document.createElement('li');
  const link = document.createElement('a');
  const type = document.createElement('span');
  const title = document.createElement('strong');
  const summary = document.createElement('p');

  link.href = entry.href;
  item.dataset.searchResult = '';
  item.dataset.searchMatch = matchKind;
  item.dataset.searchResultType = entry.type;
  if (startsTypeGroup) {
    item.dataset.searchGroupStart = '';
  }
  appendProjectedText(type, entry.typeLabel, archiveProjection?.typeLabel, 'search-type');
  appendProjectedText(title, entry.title, archiveProjection?.title, 'search-title');
  appendProjectedText(summary, entry.summary, archiveProjection?.summary, 'search-summary');
  link.append(type, title, summary);
  item.append(link);
  if (archiveProjection) {
    item.dataset.pollutionSlot = 'search-result';
    link.dataset.archiveInvitationTrigger = '';
  }
  return item;
}

export function initSiteSearch(): void {
  document.querySelectorAll<HTMLElement>('[data-site-search]').forEach((root) => {
    const fallback = root.querySelector<HTMLElement>('[data-search-fallback]');
    const enhanced = root.querySelector<HTMLElement>('[data-search-enhanced]');
    const form = root.querySelector<HTMLFormElement>('[data-search-form]');
    const input = root.querySelector<HTMLInputElement>('[data-search-input]');
    const feedback = root.querySelector<HTMLElement>('[data-search-feedback]');
    const results = root.querySelector<HTMLOListElement>('[data-search-results]');
    if (!fallback || !enhanced || !form || !input || !feedback || !results) {
      return;
    }

    let entries: SiteSearchEntry[];
    let messages: SearchMessages;
    let archiveProjection: SiteSearchProjection | undefined;
    try {
      entries = JSON.parse(root.dataset.searchIndex ?? '[]') as SiteSearchEntry[];
      messages = JSON.parse(root.dataset.searchMessages ?? '{}') as SearchMessages;
      archiveProjection = root.dataset.searchArchiveProjection
        ? (JSON.parse(root.dataset.searchArchiveProjection) as SiteSearchProjection)
        : undefined;
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

      const matches = searchSiteEntries(entries, query, locale);

      feedback.textContent =
        matches.length > 0
          ? formatMessage(messages.resultCount, { count: matches.length })
          : messages.noResults;
      results.append(
        ...matches.map(({ entry, matchKind, startsTypeGroup }) =>
          createResult(entry, matchKind, startsTypeGroup, archiveProjection),
        ),
      );
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
    fallback.hidden = true;
    enhanced.hidden = false;
  });
}
