import { isShowId, shows, type Creative, type ShowId } from '../data/shows';
import { query, queryAll } from './dom';

let showDialog: HTMLDialogElement;
let showHero: HTMLElement;
let currentShow: ShowId = 'uncrowned';

function bindDialog(dialogSelector: string, openSelector: string, closeSelector: string) {
  const dialog = query<HTMLDialogElement>(dialogSelector);

  queryAll<HTMLButtonElement>(openSelector).forEach((button) => {
    button.addEventListener('click', () => dialog.showModal());
  });
  query<HTMLButtonElement>(closeSelector, dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function setShowText(selector: string, value: string) {
  query<HTMLElement>(selector, showDialog).textContent = value;
}

function renderCreatives(creatives: readonly Creative[]) {
  const creativeList = query<HTMLDListElement>('[data-show-creatives]', showDialog);
  const rows = creatives.map(([role, name]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = role;
    description.textContent = name;
    row.append(term, description);
    return row;
  });
  creativeList.replaceChildren(...rows);
}

export function openShow(showId: string) {
  if (!isShowId(showId)) {
    return;
  }
  const show = shows[showId];

  currentShow = showId;
  showHero.dataset.showTheme = show.theme;
  showHero.dataset.index = show.index;
  setShowText('[data-show-kind]', show.kind);
  setShowText('[data-show-title]', show.title);
  setShowText('[data-show-tagline]', show.tagline);
  setShowText('[data-show-date]', show.date);
  setShowText('[data-show-place]', show.place);
  setShowText('[data-show-duration]', show.duration);
  setShowText('[data-show-language]', show.language);
  setShowText('[data-show-heading]', show.heading);
  setShowText('[data-show-synopsis]', show.synopsis);
  setShowText('[data-show-guidance]', show.guidance);
  renderCreatives(show.creatives);
  showDialog.showModal();
  showDialog.scrollTop = 0;
}

export function initDialogs() {
  bindDialog('[data-ticket-dialog]', '[data-open-ticket]', '[data-close-ticket]');
  bindDialog('[data-film-dialog]', '[data-open-film]', '[data-close-film]');

  showDialog = query<HTMLDialogElement>('[data-show-dialog]');
  showHero = query<HTMLElement>('.show-dialog__hero', showDialog);

  queryAll<HTMLButtonElement>('[data-open-show]').forEach((button) => {
    button.addEventListener('click', () => openShow(button.dataset.openShow ?? ''));
  });
  query<HTMLButtonElement>('[data-close-show]', showDialog).addEventListener('click', () =>
    showDialog.close(),
  );
  showDialog.addEventListener('click', (event) => {
    if (event.target === showDialog) {
      showDialog.close();
    }
  });

  query<HTMLButtonElement>('[data-show-ticket]', showDialog).addEventListener('click', () => {
    const ticketDialog = query<HTMLDialogElement>('[data-ticket-dialog]');
    query<HTMLSelectElement>('select[name="show"]', ticketDialog).value = shows[currentShow].title;
    showDialog.close();
    window.setTimeout(() => ticketDialog.showModal(), 80);
  });
}
