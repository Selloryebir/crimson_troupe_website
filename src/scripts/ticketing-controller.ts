import { formatMessage } from '../data/localized/format.ts';
import type { TicketingMessages } from '../data/localized/schema.ts';
import type { TicketingPerformanceOption } from '../data/ticketing.ts';
import {
  getTicketingSessionStorage,
  restoreTicketingSession,
  saveTicketingSession,
} from './ticketing-session.ts';
import {
  calculateBaseTotal,
  startTicketingAttempt,
  updateBasket,
  type TicketBasketItem,
} from './ticketing-state.ts';

function parseOptions(rawValue: string | undefined): readonly TicketingPerformanceOption[] {
  const options = JSON.parse(rawValue ?? '[]') as TicketingPerformanceOption[];
  if (
    !Array.isArray(options) ||
    options.length === 0 ||
    options.some(
      (option) =>
        typeof option.performanceId !== 'string' ||
        typeof option.title !== 'string' ||
        typeof option.seatingPlanId !== 'string' ||
        !Array.isArray(option.offers) ||
        option.offers.length === 0,
    )
  ) {
    throw new Error('Ticketing options are unavailable');
  }
  return options;
}

function parseMessages(rawValue: string | undefined): TicketingMessages {
  const messages = JSON.parse(rawValue ?? '{}') as Partial<TicketingMessages>;
  if (
    typeof messages.selectedCount !== 'string' ||
    typeof messages.selectionRequired !== 'string' ||
    typeof messages.submitted !== 'string'
  ) {
    throw new Error('Ticketing messages are unavailable');
  }
  return messages as TicketingMessages;
}

export function initTicketingExperience(): void {
  const app = document.querySelector<HTMLElement>('[data-ticketing-app]');
  const fallback = document.querySelector<HTMLElement>('[data-ticket-fallback]');
  if (!app || !fallback) {
    return;
  }

  const form = app.querySelector<HTMLFormElement>('[data-ticket-basket]');
  const count = app.querySelector<HTMLElement>('[data-ticket-count]');
  const baseTotal = app.querySelector<HTMLElement>('[data-ticket-base-total]');
  const start = app.querySelector<HTMLButtonElement>('[data-ticket-start]');
  const selectionFeedback = app.querySelector<HTMLElement>('[data-ticket-selection-feedback]');
  const live = app.querySelector<HTMLElement>('[data-ticketing-live]');
  if (!form || !count || !baseTotal || !start || !selectionFeedback || !live) {
    return;
  }

  let options: readonly TicketingPerformanceOption[];
  let messages: TicketingMessages;
  try {
    options = parseOptions(app.dataset.ticketingOptions);
    messages = parseMessages(app.dataset.ticketingMessages);
  } catch {
    return;
  }

  const partnerPath = app.dataset.ticketingPartnerPath;
  const storage = getTicketingSessionStorage();
  let state = restoreTicketingSession(
    storage,
    options.map((option) => ({ performanceId: option.performanceId, offers: option.offers })),
  );
  if (state.phase !== 'selection') {
    if (partnerPath) {
      window.location.replace(partnerPath);
    }
    return;
  }

  const save = () => saveTicketingSession(storage, state);
  const optionFor = (performanceId: string) =>
    options.find((option) => option.performanceId === performanceId);

  const basketItemFromRow = (row: HTMLElement): TicketBasketItem | null => {
    const performanceId = row.dataset.ticketOption;
    const checkbox = row.querySelector<HTMLInputElement>('[data-ticket-select]');
    const select = row.querySelector<HTMLSelectElement>('[data-ticket-zone]');
    const option = performanceId ? optionFor(performanceId) : undefined;
    const offer = option?.offers.find((entry) => entry.zone === select?.value);
    if (!performanceId || !checkbox?.checked || !offer) {
      return null;
    }
    return { performanceId, zone: offer.zone, basePrice: offer.basePrice };
  };

  const syncBasketControls = () => {
    form.querySelectorAll<HTMLElement>('[data-ticket-option]').forEach((row) => {
      const performanceId = row.dataset.ticketOption;
      const checkbox = row.querySelector<HTMLInputElement>('[data-ticket-select]');
      const select = row.querySelector<HTMLSelectElement>('[data-ticket-zone]');
      const map = row.querySelector<HTMLElement>('[data-ticket-seating-map]');
      const feedback = row.querySelector<HTMLElement>('[data-ticket-zone-feedback]');
      if (!performanceId || !checkbox || !select || !map || !feedback) {
        return;
      }
      const basketItem = state.basket.find((item) => item.performanceId === performanceId);
      const option = optionFor(performanceId);
      const selectedOffer =
        option?.offers.find((offer) => offer.zone === (basketItem?.zone ?? select.value)) ??
        option?.offers[0];
      if (!selectedOffer) {
        return;
      }
      checkbox.checked = Boolean(basketItem);
      select.disabled = false;
      row.classList.toggle('is-selected', Boolean(basketItem));
      select.value = selectedOffer.zone;
      map.dataset.selectedZone = selectedOffer.zone;
      feedback.textContent = formatMessage(
        basketItem ? messages.zoneInBasket : messages.zonePreview,
        { zone: selectedOffer.label, price: selectedOffer.basePrice },
      );
      map.querySelectorAll<HTMLButtonElement>('[data-ticket-zone-map]').forEach((button) => {
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.ticketZoneMap === selectedOffer.zone),
        );
      });
    });
    const total = calculateBaseTotal(state.basket);
    count.textContent =
      state.basket.length > 0
        ? formatMessage(messages.selectedCount, { count: state.basket.length })
        : messages.emptyBasket;
    baseTotal.textContent = `${total} LMD`;
    start.disabled = state.basket.length === 0;
    selectionFeedback.textContent =
      state.basket.length > 0 ? messages.selectionReady : messages.selectionRequired;
  };

  form.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
      return;
    }
    const row = target.closest<HTMLElement>('[data-ticket-option]');
    const performanceId = row?.dataset.ticketOption;
    if (!row || !performanceId) {
      return;
    }
    state = updateBasket(state, basketItemFromRow(row), performanceId);
    save();
    syncBasketControls();
  });

  form.addEventListener('click', (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>('[data-ticket-zone-map]')
        : null;
    const row = button?.closest<HTMLElement>('[data-ticket-option]');
    const performanceId = row?.dataset.ticketOption;
    const zone = button?.dataset.ticketZoneMap;
    const checkbox = row?.querySelector<HTMLInputElement>('[data-ticket-select]');
    const select = row?.querySelector<HTMLSelectElement>('[data-ticket-zone]');
    const offer = performanceId
      ? optionFor(performanceId)?.offers.find((entry) => entry.zone === zone)
      : undefined;
    if (!row || !performanceId || !checkbox || !select || !offer) {
      return;
    }
    select.value = offer.zone;
    state = updateBasket(state, basketItemFromRow(row), performanceId);
    save();
    live.textContent = formatMessage(
      checkbox.checked ? messages.zoneInBasket : messages.zonePreview,
      { zone: offer.label, price: offer.basePrice },
    );
    syncBasketControls();
  });

  form.addEventListener(
    'toggle',
    (event) => {
      const opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) {
        return;
      }
      form
        .querySelectorAll<HTMLDetailsElement>('[data-ticket-seating-details][open]')
        .forEach((details) => {
          if (details !== opened) {
            details.open = false;
          }
        });
    },
    true,
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const next = startTicketingAttempt(state);
    if (next === state) {
      selectionFeedback.textContent = messages.startRequired;
      return;
    }
    state = next;
    save();
    live.textContent = messages.submitted;
    if (partnerPath) {
      window.location.assign(partnerPath);
    }
  });

  fallback.hidden = true;
  app.hidden = false;
  syncBasketControls();
}
