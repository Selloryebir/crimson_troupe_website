import { searchIndex, type SearchEntry } from '../data/search-index';
import { openShow } from './dialogs';
import { query, queryAll } from './dom';
import type { NavigationController } from './navigation';
import { reducedMotion, switchWorld } from './world';

function createTextElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  text: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  return element;
}

function createSearchHint(symbol: string, message: string) {
  const hint = document.createElement('div');
  hint.className = 'search-results__hint';
  hint.append(createTextElement('span', symbol), createTextElement('p', message));
  return hint;
}

function createSearchResult(item: SearchEntry, index: number, active: boolean) {
  const button = document.createElement('button');
  button.className = `search-result${active ? ' is-active' : ''}`;
  button.type = 'button';
  button.dataset.searchResult = String(index);

  const copy = document.createElement('span');
  copy.append(createTextElement('strong', item.title), createTextElement('small', item.detail));
  const arrow = createTextElement('i', '↗');
  arrow.setAttribute('aria-hidden', 'true');
  button.append(createTextElement('span', item.category), copy, arrow);
  return button;
}

export function initSearch({ closeMenu }: NavigationController) {
  const root = document.documentElement;
  const searchDialog = query<HTMLDialogElement>('[data-search-dialog]');
  const searchInput = query<HTMLInputElement>('[data-search-input]', searchDialog);
  const searchResults = query<HTMLElement>('[data-search-results]', searchDialog);
  let activeSearchResult = -1;
  let currentResults: SearchEntry[] = [];

  const normalizeSearch = (value: string) =>
    value.toLowerCase().trim().replaceAll('《', '').replaceAll('》', '');

  const renderSearchResults = (searchQuery: string) => {
    const normalized = normalizeSearch(searchQuery);
    if (!normalized) {
      currentResults = [];
      activeSearchResult = -1;
      searchResults.replaceChildren(
        createTextElement('p', '输入关键词开始搜索', 'search-results__label'),
        createSearchHint('CT', '演出、巡演城市、艺术家和剧团手记都可以在这里找到。'),
      );
      return;
    }

    currentResults = searchIndex.filter((item) =>
      normalizeSearch(`${item.title} ${item.detail} ${item.keywords}`).includes(normalized),
    );
    activeSearchResult = currentResults.length ? 0 : -1;
    const resultLabel = createTextElement(
      'p',
      `找到 ${currentResults.length} 条结果`,
      'search-results__label',
    );
    if (currentResults.length) {
      searchResults.replaceChildren(
        resultLabel,
        ...currentResults.map((item, index) => createSearchResult(item, index, index === 0)),
      );
    } else {
      searchResults.replaceChildren(
        resultLabel,
        createSearchHint('∅', '没有公开记录。请检查关键词，或尝试搜索日期与城市。'),
      );
    }
  };

  const runSearchResult = (index: number) => {
    const item = currentResults[index];
    if (!item) {
      return;
    }

    searchDialog.close();
    if (item.action === 'show') {
      window.setTimeout(() => openShow(item.value), 80);
    } else if (item.action === 'archive') {
      void switchWorld('archive');
    } else {
      document
        .querySelector<HTMLElement>(item.value)
        ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const updateActiveSearchResult = (direction: number) => {
    if (!currentResults.length) {
      return;
    }
    activeSearchResult =
      (activeSearchResult + direction + currentResults.length) % currentResults.length;
    queryAll<HTMLButtonElement>('[data-search-result]', searchDialog).forEach((button, index) => {
      button.classList.toggle('is-active', index === activeSearchResult);
    });
  };

  queryAll<HTMLButtonElement>('[data-open-search]').forEach((button) => {
    button.addEventListener('click', () => {
      closeMenu();
      searchDialog.showModal();
      window.setTimeout(() => searchInput.focus(), 50);
    });
  });
  query<HTMLButtonElement>('[data-close-search]', searchDialog).addEventListener('click', () =>
    searchDialog.close(),
  );
  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  queryAll<HTMLButtonElement>('[data-search-query]', searchDialog).forEach((button) => {
    button.addEventListener('click', () => {
      searchInput.value = button.dataset.searchQuery ?? '';
      renderSearchResults(searchInput.value);
      searchInput.focus();
    });
  });
  searchResults.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const result = event.target.closest<HTMLButtonElement>('[data-search-result]');
    if (result) {
      runSearchResult(Number(result.dataset.searchResult));
    }
  });
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      updateActiveSearchResult(1);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      updateActiveSearchResult(-1);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      runSearchResult(activeSearchResult);
    }
  });

  document.addEventListener('keydown', (event) => {
    const activeTag = document.activeElement?.tagName;
    const typing = activeTag !== undefined && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag);
    if (event.key === '/' && !typing && !searchDialog.open && root.dataset.world === 'front') {
      event.preventDefault();
      searchDialog.showModal();
      window.setTimeout(() => searchInput.focus(), 50);
    }
  });
}
