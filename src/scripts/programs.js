export function initProgramFilters() {
  const monthButtons = [...document.querySelectorAll('[data-month-filter]')];
  const cityFilter = document.querySelector('[data-city-filter]');
  const programs = [...document.querySelectorAll('[data-program]')];
  const filterResult = document.querySelector('[data-filter-result]');
  const programEmpty = document.querySelector('[data-program-empty]');
  let activeMonth = 'all';

  const applyProgramFilters = () => {
    let visible = 0;
    programs.forEach((program) => {
      const matchesMonth = activeMonth === 'all' || program.dataset.month === activeMonth;
      const matchesCity = cityFilter.value === 'all' || program.dataset.city === cityFilter.value;
      const matches = matchesMonth && matchesCity;
      program.hidden = !matches;
      if (matches) visible += 1;
    });
    filterResult.textContent = `${visible} 场演出`;
    programEmpty.hidden = visible !== 0;
  };

  monthButtons.forEach((button) => {
    button.addEventListener('click', () => {
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
  document.querySelector('[data-clear-filters]').addEventListener('click', () => {
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
