import { searchIndex } from '../data/search-index.js';
import { openShow } from './dialogs.js';
import { reducedMotion, switchWorld } from './world.js';

export function initSearch({ closeMenu }) {
  const root = document.documentElement;
  const searchDialog = document.querySelector('[data-search-dialog]');
  const searchInput = searchDialog.querySelector('[data-search-input]');
  const searchResults = searchDialog.querySelector('[data-search-results]');
  let activeSearchResult = -1;
  let currentResults = [];

  const normalizeSearch = (value) => value.toLowerCase().trim().replaceAll('《', '').replaceAll('》', '');

  const renderSearchResults = (query) => {
    const normalized = normalizeSearch(query);
    if (!normalized) {
      currentResults = [];
      activeSearchResult = -1;
      searchResults.innerHTML = '<p class="search-results__label">输入关键词开始搜索</p><div class="search-results__hint"><span>CT</span><p>演出、巡演城市、艺术家和剧团手记都可以在这里找到。</p></div>';
      return;
    }

    currentResults = searchIndex.filter((item) => normalizeSearch(`${item.title} ${item.detail} ${item.keywords}`).includes(normalized));
    activeSearchResult = currentResults.length ? 0 : -1;
    searchResults.innerHTML = `<p class="search-results__label">找到 ${currentResults.length} 条结果</p>${currentResults.length
      ? currentResults.map((item, index) => `<button class="search-result${index === 0 ? ' is-active' : ''}" type="button" data-search-result="${index}"><span>${item.category}</span><span><strong>${item.title}</strong><small>${item.detail}</small></span><i>↗</i></button>`).join('')
      : '<div class="search-results__hint"><span>∅</span><p>没有公开记录。请检查关键词，或尝试搜索日期与城市。</p></div>'}`;
  };

  const runSearchResult = (index) => {
    const item = currentResults[index];
    if (!item) return;

    searchDialog.close();
    if (item.action === 'show') {
      window.setTimeout(() => openShow(item.value), 80);
    } else if (item.action === 'archive') {
      switchWorld('archive');
    } else {
      document.querySelector(item.value)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const updateActiveSearchResult = (direction) => {
    if (!currentResults.length) return;
    activeSearchResult = (activeSearchResult + direction + currentResults.length) % currentResults.length;
    searchDialog.querySelectorAll('[data-search-result]').forEach((button, index) => {
      button.classList.toggle('is-active', index === activeSearchResult);
    });
  };

  document.querySelectorAll('[data-open-search]').forEach((button) => {
    button.addEventListener('click', () => {
      closeMenu();
      searchDialog.showModal();
      window.setTimeout(() => searchInput.focus(), 50);
    });
  });
  searchDialog.querySelector('[data-close-search]').addEventListener('click', () => searchDialog.close());
  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
  searchDialog.querySelectorAll('[data-search-query]').forEach((button) => {
    button.addEventListener('click', () => {
      searchInput.value = button.dataset.searchQuery;
      renderSearchResults(searchInput.value);
      searchInput.focus();
    });
  });
  searchResults.addEventListener('click', (event) => {
    const result = event.target.closest('[data-search-result]');
    if (result) runSearchResult(Number(result.dataset.searchResult));
  });
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); updateActiveSearchResult(1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); updateActiveSearchResult(-1); }
    if (event.key === 'Enter') { event.preventDefault(); runSearchResult(activeSearchResult); }
  });

  document.addEventListener('keydown', (event) => {
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if (event.key === '/' && !typing && !searchDialog.open && root.dataset.world === 'front') {
      event.preventDefault();
      searchDialog.showModal();
      window.setTimeout(() => searchInput.focus(), 50);
    }
  });
}
