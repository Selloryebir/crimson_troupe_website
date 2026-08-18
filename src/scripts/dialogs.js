import { shows } from '../data/shows.js';

let showDialog;
let showHero;
let currentShow = 'uncrowned';

function bindDialog(dialogSelector, openSelector, closeSelector) {
  const dialog = document.querySelector(dialogSelector);
  if (!dialog) return;

  document.querySelectorAll(openSelector).forEach((button) => {
    button.addEventListener('click', () => dialog.showModal());
  });
  dialog.querySelector(closeSelector)?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

export function openShow(showId) {
  const show = shows[showId];
  if (!show || !showDialog) return;

  currentShow = showId;
  showHero.dataset.showTheme = show.theme;
  showHero.dataset.index = show.index;
  showDialog.querySelector('[data-show-kind]').textContent = show.kind;
  showDialog.querySelector('[data-show-title]').textContent = show.title;
  showDialog.querySelector('[data-show-tagline]').textContent = show.tagline;
  showDialog.querySelector('[data-show-date]').textContent = show.date;
  showDialog.querySelector('[data-show-place]').textContent = show.place;
  showDialog.querySelector('[data-show-duration]').textContent = show.duration;
  showDialog.querySelector('[data-show-language]').textContent = show.language;
  showDialog.querySelector('[data-show-heading]').textContent = show.heading;
  showDialog.querySelector('[data-show-synopsis]').textContent = show.synopsis;
  showDialog.querySelector('[data-show-guidance]').textContent = show.guidance;
  showDialog.querySelector('[data-show-creatives]').innerHTML = show.creatives
    .map(([role, name]) => `<div><dt>${role}</dt><dd>${name}</dd></div>`)
    .join('');
  showDialog.showModal();
  showDialog.scrollTop = 0;
}

export function initDialogs() {
  bindDialog('[data-ticket-dialog]', '[data-open-ticket]', '[data-close-ticket]');
  bindDialog('[data-film-dialog]', '[data-open-film]', '[data-close-film]');

  showDialog = document.querySelector('[data-show-dialog]');
  showHero = showDialog.querySelector('.show-dialog__hero');

  document.querySelectorAll('[data-open-show]').forEach((button) => {
    button.addEventListener('click', () => openShow(button.dataset.openShow));
  });
  showDialog.querySelector('[data-close-show]').addEventListener('click', () => showDialog.close());
  showDialog.addEventListener('click', (event) => {
    if (event.target === showDialog) showDialog.close();
  });

  showDialog.querySelector('[data-show-ticket]').addEventListener('click', () => {
    const ticketDialog = document.querySelector('[data-ticket-dialog]');
    const showSelect = ticketDialog.querySelector('select[name="show"]');
    showSelect.value = shows[currentShow].title;
    showDialog.close();
    window.setTimeout(() => ticketDialog.showModal(), 80);
  });
}
