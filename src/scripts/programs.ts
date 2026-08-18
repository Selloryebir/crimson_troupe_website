import { query, queryAll } from './dom';

type MonthFilter = 'all' | '09' | '10';

function isMonthFilter(value: string | undefined): value is MonthFilter {
  return value === 'all' || value === '09' || value === '10';
}

export function initProgramFilters() {
  const monthButtons = queryAll<HTMLButtonElement>('[data-month-filter]');
  const cityFilter = query<HTMLSelectElement>('[data-city-filter]');
  const programs = queryAll<HTMLElement>('[data-program]');
  const filterResult = query<HTMLElement>('[data-filter-result]');
  const programEmpty = query<HTMLElement>('[data-program-empty]');
  let activeMonth: MonthFilter = 'all';

  const applyProgramFilters = () => {
    let visible = 0;
    programs.forEach((program) => {
      const matchesMonth = activeMonth === 'all' || program.dataset.month === activeMonth;
      const matchesCity = cityFilter.value === 'all' || program.dataset.city === cityFilter.value;
      const matches = matchesMonth && matchesCity;
      program.hidden = !matches;
      if (matches) {
        visible += 1;
      }
    });
    filterResult.textContent = `${visible} 场演出`;
    programEmpty.hidden = visible !== 0;
  };

  monthButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!isMonthFilter(button.dataset.monthFilter)) {
        return;
      }
      activeMonth = button.dataset.monthFilter;
      monthButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyProgramFilters();
    });
  });

  cityFilter.addEventListener('change', applyProgramFilters);
  query<HTMLButtonElement>('[data-clear-filters]').addEventListener('click', () => {
    activeMonth = 'all';
    cityFilter.value = 'all';
    monthButtons.forEach((button) => {
      const active = button.dataset.monthFilter === 'all';
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    applyProgramFilters();
  });
}
