import type { TicketingPerformanceOption } from '../data/ticketing';
import { formatMessage } from '../data/localized/format';
import type { TicketingMessages } from '../data/localized/schema';
import { createTicketSvg } from './ticket-artifact';
import {
  calculateBaseTotal,
  createTicketingState,
  enterPremiumRoute,
  resolveTicketingAttempt,
  restoreTicketingState,
  retryTicketingAttempt,
  returnToSelection,
  returnToStandardRoute,
  startTicketingAttempt,
  updateBasket,
  type TicketBasketItem,
} from './ticketing-state';

const STORAGE_KEY = 'crimson-troupe:ticketing:v2';

function getSessionStorage(): Storage | null {
  try {
    const probe = `${STORAGE_KEY}:probe`;
    sessionStorage.setItem(probe, '1');
    sessionStorage.removeItem(probe);
    return sessionStorage;
  } catch {
    return null;
  }
}

function createTicketNumber(): string {
  try {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    let value = 0n;
    for (const byte of bytes) {
      value = (value << 8n) + BigInt(byte);
    }
    return String(value % 1_000_000_000_000n).padStart(12, '0');
  } catch {
    return String(Math.floor(Math.random() * 1_000_000_000_000)).padStart(12, '0');
  }
}

function createButton(action: string, label: string, primary = false): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.ticketAction = action;
  button.className = primary ? 'button' : 'text-button';
  button.textContent = label;
  return button;
}

function addDefinition(list: HTMLDListElement, term: string, description: string): void {
  const row = document.createElement('div');
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = term;
  dd.textContent = description;
  row.append(dt, dd);
  list.append(row);
}

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
    typeof messages.success !== 'string' ||
    !messages.adjustments ||
    !messages.stamps ||
    !messages.artifact
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
  const flow = app.querySelector<HTMLElement>('[data-ticket-flow]');
  const flowLabel = app.querySelector<HTMLElement>('[data-ticket-flow-label]');
  const flowTitle = app.querySelector<HTMLElement>('[data-ticket-flow-title]');
  const flowCopy = app.querySelector<HTMLElement>('[data-ticket-flow-copy]');
  const flowActions = app.querySelector<HTMLElement>('[data-ticket-flow-actions]');
  const result = app.querySelector<HTMLElement>('[data-ticket-result]');
  const receipt = app.querySelector<HTMLElement>('[data-ticket-receipt]');
  const issuedTickets = app.querySelector<HTMLElement>('[data-issued-tickets]');
  const newRound = app.querySelector<HTMLButtonElement>('[data-ticket-new-round]');
  const live = app.querySelector<HTMLElement>('[data-ticketing-live]');
  if (
    !form ||
    !count ||
    !baseTotal ||
    !start ||
    !selectionFeedback ||
    !flow ||
    !flowLabel ||
    !flowTitle ||
    !flowCopy ||
    !flowActions ||
    !result ||
    !receipt ||
    !issuedTickets ||
    !newRound ||
    !live
  ) {
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
  const locale = app.dataset.ticketingLocale ?? document.documentElement.lang;

  const storage = getSessionStorage();
  let state = restoreTicketingState(
    storage?.getItem(STORAGE_KEY) ?? null,
    options.map((option) => ({ performanceId: option.performanceId, offers: option.offers })),
  );

  const save = () => {
    if (!storage) {
      return;
    }
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // The active page keeps working in memory when tab storage is unavailable.
    }
  };

  const optionFor = (performanceId: string) =>
    options.find((option) => option.performanceId === performanceId);

  const zoneLabelFor = (item: TicketBasketItem): string =>
    optionFor(item.performanceId)?.offers.find((offer) => offer.zone === item.zone)?.label ??
    item.zone;

  const stampLabels = () => state.result?.stampIds.map((stampId) => messages.stamps[stampId]) ?? [];

  const syncBasketControls = () => {
    form.querySelectorAll<HTMLElement>('[data-ticket-option]').forEach((row) => {
      const performanceId = row.dataset.ticketOption;
      const checkbox = row.querySelector<HTMLInputElement>('[data-ticket-select]');
      const select = row.querySelector<HTMLSelectElement>('[data-ticket-zone]');
      const map = row.querySelector<HTMLElement>('[data-ticket-seating-map]');
      if (!performanceId || !checkbox || !select || !map) {
        return;
      }
      const basketItem = state.basket.find((item) => item.performanceId === performanceId);
      checkbox.checked = Boolean(basketItem);
      select.disabled = !basketItem;
      row.classList.toggle('is-selected', Boolean(basketItem));
      if (basketItem) {
        select.value = basketItem.zone;
        map.dataset.selectedZone = basketItem.zone;
      } else {
        delete map.dataset.selectedZone;
      }
      map.querySelectorAll<HTMLButtonElement>('[data-ticket-zone-map]').forEach((button) => {
        button.setAttribute(
          'aria-pressed',
          String(button.dataset.ticketZoneMap === basketItem?.zone),
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

  const basketItemFromRow = (row: HTMLElement): TicketBasketItem | null => {
    const performanceId = row.dataset.ticketOption;
    const checkbox = row.querySelector<HTMLInputElement>('[data-ticket-select]');
    const select = row.querySelector<HTMLSelectElement>('[data-ticket-zone]');
    const option = performanceId ? optionFor(performanceId) : undefined;
    const offer = option?.offers.find((entry) => entry.zone === select?.value);
    if (!performanceId || !checkbox?.checked || !offer) {
      return null;
    }
    return {
      performanceId,
      zone: offer.zone,
      basePrice: offer.basePrice,
    };
  };

  const renderReceipt = () => {
    receipt.replaceChildren();
    issuedTickets.replaceChildren();
    if (!state.result) {
      return;
    }

    const heading = document.createElement('div');
    heading.className = 'ticket-receipt__heading';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = messages.receiptEyebrow;
    const title = document.createElement('h3');
    title.textContent = messages.receiptTitle;
    const copy = document.createElement('p');
    copy.textContent = messages.receiptCopy;
    heading.append(eyebrow, title, copy);

    const lines = document.createElement('ol');
    lines.className = 'ticket-receipt__lines';
    for (const item of state.result.basket) {
      const option = optionFor(item.performanceId);
      if (!option) {
        continue;
      }
      const line = document.createElement('li');
      const name = document.createElement('span');
      const price = document.createElement('strong');
      name.textContent = `${option.title} · ${zoneLabelFor(item)}`;
      price.textContent = `${item.basePrice} LMD`;
      line.append(name, price);
      lines.append(line);
    }

    const totals = document.createElement('dl');
    totals.className = 'ticket-receipt__totals';
    addDefinition(totals, messages.baseTotal, `${state.result.baseTotal} LMD`);
    if (state.result.adjustments.length === 0) {
      addDefinition(totals, messages.adjustments['premium-service'], messages.adjustmentNone);
    } else {
      for (const adjustment of state.result.adjustments) {
        addDefinition(totals, messages.adjustments[adjustment.id], `+ ${adjustment.amount} LMD`);
      }
    }
    addDefinition(totals, messages.settledTotal, `${state.result.settledTotal} LMD`);
    const disclaimer = document.createElement('small');
    disclaimer.textContent = messages.disclaimer;
    receipt.append(heading, lines, totals, disclaimer);

    for (const issued of state.result.tickets) {
      const option = optionFor(issued.performanceId);
      const basketItem = state.result.basket.find(
        (item) => item.performanceId === issued.performanceId,
      );
      if (!option || !basketItem) {
        continue;
      }
      const artifact = {
        performance: option,
        basketItem,
        zoneLabel: zoneLabelFor(basketItem),
        number: issued.number,
        stamps: stampLabels(),
        messages: messages.artifact,
        locale,
      };
      const article = document.createElement('article');
      article.className = 'issued-ticket';
      article.dataset.issuedTicket = issued.performanceId;
      const image = document.createElement('img');
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createTicketSvg(artifact))}`;
      image.alt = formatMessage(messages.artifact.alt, {
        title: option.title,
        dateTime: option.dateTime,
        place: option.place,
        zone: zoneLabelFor(basketItem),
        price: basketItem.basePrice,
        number: issued.number,
      });
      const caption = document.createElement('div');
      caption.className = 'issued-ticket__caption';
      const ticketTitle = document.createElement('h4');
      ticketTitle.textContent = option.title;
      const ticketMeta = document.createElement('p');
      ticketMeta.textContent = `${option.dateTime} · ${option.place} · ${zoneLabelFor(basketItem)} · ${basketItem.basePrice} LMD`;
      const ticketNumber = document.createElement('p');
      ticketNumber.textContent = formatMessage(messages.ticketNumber, { number: issued.number });
      const stamps = document.createElement('p');
      stamps.className = 'issued-ticket__stamps';
      stamps.textContent = stampLabels().join(' · ');
      const controls = document.createElement('div');
      controls.className = 'issued-ticket__controls';
      controls.append(
        createButton(`download:${issued.performanceId}`, messages.downloadSvg),
        createButton(`print:${issued.performanceId}`, messages.printTicket),
      );
      caption.append(ticketTitle, ticketMeta, ticketNumber, stamps, controls);
      article.append(image, caption);
      issuedTickets.append(article);
    }
  };

  const renderFlow = () => {
    flowActions.replaceChildren();
    flowLabel.textContent =
      state.route === 'premium' ? messages.priorityChannel : messages.standardChannel;
    if (state.phase === 'attempt') {
      flowTitle.textContent =
        state.route === 'premium' ? messages.premiumAttemptTitle : messages.standardAttemptTitle;
      flowCopy.textContent =
        state.route === 'premium' ? messages.premiumAttemptCopy : messages.standardAttemptCopy;
      flowActions.append(
        createButton('resolve', messages.submitRequest, true),
        createButton('back', messages.backToBasket),
      );
      return;
    }
    if (state.phase === 'network') {
      flowTitle.textContent = messages.networkTitle;
      flowCopy.textContent = messages.networkCopy;
      flowActions.append(
        createButton('retry', messages.retryBasket, true),
        createButton('back', messages.backToBasket),
      );
      return;
    }
    flowTitle.textContent =
      state.route === 'premium' ? messages.premiumFailureTitle : messages.standardFailureTitle;
    flowCopy.textContent =
      state.route === 'premium' ? messages.premiumFailureCopy : messages.standardFailureCopy;
    if (state.route === 'standard') {
      flowActions.append(
        createButton('retry', messages.retryStandard, true),
        createButton('premium', messages.tryPremium),
        createButton('back', messages.backToBasket),
      );
    } else {
      flowActions.append(
        createButton('retry', messages.retryPremium, true),
        createButton('standard', messages.returnStandard),
        createButton('back', messages.backToBasket),
      );
    }
  };

  const render = (focusStage = false) => {
    const selection = state.phase === 'selection';
    form.hidden = !selection;
    flow.hidden = selection || state.phase === 'success';
    result.hidden = state.phase !== 'success';
    syncBasketControls();
    if (!flow.hidden) {
      renderFlow();
    }
    if (!result.hidden) {
      renderReceipt();
    }
    if (focusStage) {
      (state.phase === 'success' ? result : state.phase === 'selection' ? form : flow).focus();
    }
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
    checkbox.checked = true;
    select.disabled = false;
    select.value = offer.zone;
    state = updateBasket(state, basketItemFromRow(row), performanceId);
    save();
    live.textContent = messages.selectionReady;
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
    render(true);
  });

  flowActions.addEventListener('click', (event) => {
    const button =
      event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null;
    const action = button?.dataset.ticketAction;
    if (!action) {
      return;
    }
    if (action === 'resolve') {
      state = resolveTicketingAttempt(state, Math.random, createTicketNumber);
    } else if (action === 'retry') {
      state = retryTicketingAttempt(state);
    } else if (action === 'premium') {
      state = enterPremiumRoute(state);
    } else if (action === 'standard') {
      state = returnToStandardRoute(state);
    } else if (action === 'back') {
      state = returnToSelection(state);
    }
    save();
    live.textContent = state.phase === 'success' ? messages.success : messages.stateUpdated;
    render(true);
  });

  issuedTickets.addEventListener('click', (event) => {
    const button =
      event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null;
    const action = button?.dataset.ticketAction;
    if (!action || !state.result) {
      return;
    }
    const [kind, performanceId] = action.split(':');
    const issued = state.result.tickets.find((ticket) => ticket.performanceId === performanceId);
    const basketItem = state.result.basket.find((item) => item.performanceId === performanceId);
    const option = optionFor(performanceId);
    const article = [...issuedTickets.querySelectorAll<HTMLElement>('[data-issued-ticket]')].find(
      (item) => item.dataset.issuedTicket === performanceId,
    );
    if (!issued || !basketItem || !option || !article) {
      return;
    }
    if (kind === 'download') {
      const svg = createTicketSvg({
        performance: option,
        basketItem,
        zoneLabel: zoneLabelFor(basketItem),
        number: issued.number,
        stamps: stampLabels(),
        messages: messages.artifact,
        locale,
      });
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `crimson-troupe-${performanceId}-${issued.number}.svg`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      live.textContent = formatMessage(messages.downloadStarted, { title: option.title });
    } else if (kind === 'print') {
      document.body.classList.add('is-printing-ticket');
      article.classList.add('is-print-target');
      const cleanup = () => {
        document.body.classList.remove('is-printing-ticket');
        article.classList.remove('is-print-target');
      };
      window.addEventListener('afterprint', cleanup, { once: true });
      window.print();
    }
  });

  newRound.addEventListener('click', () => {
    state = createTicketingState();
    if (storage) {
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        // In-memory reset still succeeds.
      }
    }
    live.textContent = messages.newRound;
    render(true);
  });

  fallback.hidden = true;
  app.hidden = false;
  render();
}
