import { formatMessage } from '../data/localized/format';
import type { FilterMessages } from '../data/localized/schema';

export function initPerformanceFilters(): void {
  document.querySelectorAll<HTMLElement>('[data-performance-browser]').forEach((browser) => {
    const filters = browser.querySelector<HTMLElement>('[data-performance-filters]');
    const city = browser.querySelector<HTMLSelectElement>('[data-performance-city]');
    const month = browser.querySelector<HTMLSelectElement>('[data-performance-month]');
    const reset = browser.querySelector<HTMLButtonElement>('[data-performance-reset]');
    const count = browser.querySelector<HTMLElement>('[data-performance-count]');
    const empty = browser.querySelector<HTMLElement>('[data-performance-empty]');
    const items = [...browser.querySelectorAll<HTMLElement>('[data-performance-item]')];
    let messages: FilterMessages;

    try {
      messages = JSON.parse(browser.dataset.filterMessages ?? '{}') as FilterMessages;
    } catch {
      return;
    }

    if (
      !filters ||
      !city ||
      !month ||
      !reset ||
      !count ||
      !empty ||
      items.length === 0 ||
      typeof messages.count !== 'string'
    ) {
      return;
    }

    filters.hidden = false;

    const update = () => {
      let visibleCount = 0;
      for (const item of items) {
        const visible =
          (city.value === 'all' || item.dataset.city === city.value) &&
          (month.value === 'all' || item.dataset.month === month.value);
        item.hidden = !visible;
        if (visible) {
          visibleCount += 1;
        }
      }

      count.textContent = formatMessage(messages.count, { count: visibleCount });
      empty.hidden = visibleCount !== 0;
    };

    city.addEventListener('change', update);
    month.addEventListener('change', update);
    reset.addEventListener('click', () => {
      city.value = 'all';
      month.value = 'all';
      update();
      city.focus();
    });
  });
}
