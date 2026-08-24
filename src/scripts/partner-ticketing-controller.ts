import type { TicketingMessages } from '../data/localized/schema.ts';
import type { TerraDateTime } from '../data/performances.ts';
import type { TicketingPerformanceOption } from '../data/ticketing.ts';
import {
  clearTicketingSession,
  createTicketNumber,
  getTicketingSessionStorage,
  restoreTicketingSession,
  saveTicketingSession,
} from './ticketing-session.ts';
import { handleTicketArtifactAction, renderTicketingResult } from './ticket-result-renderer.ts';
import {
  acceptRetentionOffer,
  calculateAdjustmentAmount,
  calculateBaseTotal,
  calculateFailureServiceFee,
  declinePremiumOffer,
  declineRetentionOffer,
  enterPremiumRoute,
  isValidTicketingTerraDateTime,
  openPremiumOffer,
  resolveTicketingAttempt,
  retryTicketingAttempt,
  returnToSelection,
  returnToStandardRoute,
} from './ticketing-state.ts';

export const PARTNER_PROCESSING_DELAYS_MS = [450, 650, 600] as const;

export interface PartnerTicketingDependencies {
  random?: () => number;
  ticketNumberFactory?: () => string;
  wait?: (milliseconds: number) => Promise<void>;
}

function createButton(action: string, label: string, primary = false): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.partnerAction = action;
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
  if (!Array.isArray(options) || options.length === 0) {
    throw new Error('Partner ticketing options are unavailable');
  }
  return options;
}

function parseMessages(rawValue: string | undefined): TicketingMessages {
  const messages = JSON.parse(rawValue ?? '{}') as Partial<TicketingMessages>;
  if (
    typeof messages.standardAttemptTitle !== 'string' ||
    typeof messages.partnerUnavailableCopy !== 'string'
  ) {
    throw new Error('Partner ticketing messages are unavailable');
  }
  return messages as TicketingMessages;
}

function parseAcceptedAt(rawValue: string | undefined): TerraDateTime {
  const acceptedAt: unknown = JSON.parse(rawValue ?? 'null');
  if (!isValidTicketingTerraDateTime(acceptedAt)) {
    throw new Error('Partner ticketing acceptance time is unavailable');
  }
  return acceptedAt;
}

export function initPartnerTicketingExperience(
  dependencies: PartnerTicketingDependencies = {},
): void {
  const app = document.querySelector<HTMLElement>('[data-partner-ticketing-app]');
  const fallback = document.querySelector<HTMLElement>('[data-partner-ticketing-fallback]');
  if (!app || !fallback) {
    return;
  }

  const progress = app.querySelector<HTMLElement>('[data-partner-progress]');
  const progressLabel = app.querySelector<HTMLElement>('[data-partner-progress-label]');
  const progressValue = app.querySelector<HTMLProgressElement>('[data-partner-progress-value]');
  const review = app.querySelector<HTMLButtonElement>('[data-partner-review]');
  const dialog = app.querySelector<HTMLDialogElement>('[data-partner-dialog]');
  const title = app.querySelector<HTMLElement>('[data-partner-title]');
  const copy = app.querySelector<HTMLElement>('[data-partner-copy]');
  const channel = app.querySelector<HTMLElement>('[data-partner-channel]');
  const details = app.querySelector<HTMLElement>('[data-partner-details]');
  const actions = app.querySelector<HTMLElement>('[data-partner-actions]');
  const result = app.querySelector<HTMLElement>('[data-ticket-result]');
  const receipt = app.querySelector<HTMLElement>('[data-ticket-receipt]');
  const issuedTickets = app.querySelector<HTMLElement>('[data-issued-tickets]');
  const newRound = app.querySelector<HTMLButtonElement>('[data-ticket-new-round]');
  const live = app.querySelector<HTMLElement>('[data-partner-live]');
  if (
    !progress ||
    !progressLabel ||
    !progressValue ||
    !review ||
    !dialog ||
    !title ||
    !copy ||
    !channel ||
    !details ||
    !actions ||
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
  let acceptedAt: TerraDateTime;
  try {
    options = parseOptions(app.dataset.ticketingOptions);
    messages = parseMessages(app.dataset.ticketingMessages);
    acceptedAt = parseAcceptedAt(app.dataset.ticketingAcceptedAt);
  } catch {
    return;
  }

  const officialPath = app.dataset.ticketingOfficialPath;
  const locale = app.dataset.ticketingLocale;
  if (!locale) {
    return;
  }
  const catalog = options.map((option) => ({
    performanceId: option.performanceId,
    offers: option.offers,
  }));
  const storage = getTicketingSessionStorage();
  let state = restoreTicketingSession(storage, catalog);
  if (state.phase === 'selection' || state.basket.length === 0) {
    return;
  }

  const random = dependencies.random ?? Math.random;
  const ticketNumberFactory = dependencies.ticketNumberFactory ?? createTicketNumber;
  const wait =
    dependencies.wait ??
    ((milliseconds: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds)));
  let processing = false;
  let suppressCloseFocus = false;

  const save = () => saveTicketingSession(storage, state);
  const showBrand = (platformId: 'rice-network' | 'drop-tower') => {
    app.querySelectorAll<HTMLElement>('[data-partner-brand]').forEach((brand) => {
      brand.hidden = brand.dataset.partnerBrand !== platformId;
    });
  };
  const renderOffer = (offerVariant: 'full' | 'retention') => {
    const base = calculateBaseTotal(state.basket);
    const adjustment = calculateAdjustmentAmount(base, offerVariant);
    const ledger = document.createElement('dl');
    ledger.className = 'ticket-flow__ledger';
    addDefinition(ledger, messages.offerBaseTotal, `${base} LMD`);
    addDefinition(ledger, messages.offerAdjustment, `+ ${adjustment} LMD`);
    addDefinition(ledger, messages.offerFinalTotal, `${base + adjustment} LMD`);
    details.append(ledger);
  };

  const openDialog = () => {
    result.hidden = true;
    review.hidden = true;
    if (!dialog.open) {
      dialog.showModal();
    }
    title.focus();
  };

  const showResult = (focusStage = false) => {
    if (!state.result) {
      window.location.replace(officialPath ?? '/');
      return;
    }
    progress.hidden = true;
    review.hidden = true;
    result.hidden = false;
    renderTicketingResult(state.result, options, messages, locale, { receipt, issuedTickets });
    live.textContent = messages.success;
    if (focusStage) {
      result.querySelector<HTMLElement>('#ticket-result-title')?.focus();
    }
  };

  const renderDialog = () => {
    progress.hidden = true;
    details.replaceChildren();
    actions.replaceChildren();
    const usesDropTower =
      state.route === 'premium' ||
      state.phase === 'premium-offer' ||
      state.phase === 'retention-offer';
    showBrand(usesDropTower ? 'drop-tower' : 'rice-network');
    channel.textContent = usesDropTower ? messages.priorityChannel : messages.standardChannel;

    if (state.phase === 'premium-offer') {
      title.textContent = messages.premiumOfferTitle;
      copy.textContent = messages.premiumOfferCopy;
      renderOffer('full');
      actions.append(
        createButton('accept-premium', messages.acceptPremium, true),
        createButton('decline-premium', messages.declinePremium),
      );
    } else if (state.phase === 'retention-offer') {
      title.textContent = messages.retentionOfferTitle;
      copy.textContent = messages.retentionOfferCopy;
      renderOffer('retention');
      actions.append(
        createButton('accept-retention', messages.acceptRetention, true),
        createButton('decline-retention', messages.declineRetention),
      );
    } else if (state.phase === 'network') {
      title.textContent = messages.networkTitle;
      copy.textContent = messages.networkCopy;
      actions.append(
        createButton('retry', messages.retryBasket, true),
        createButton('back', messages.backToBasket),
      );
    } else if (state.phase === 'failure' && state.route === 'standard') {
      title.textContent = messages.standardFailureTitle;
      copy.textContent = messages.standardFailureCopy;
      actions.append(
        createButton('retry', messages.retryStandard, true),
        createButton('offer', messages.tryPremium, true),
        createButton('back', messages.backToBasket),
      );
    } else if (state.phase === 'failure') {
      title.textContent = messages.premiumFailureTitle;
      copy.textContent = messages.premiumFailureCopy;
      const base = calculateBaseTotal(state.basket);
      const record = document.createElement('section');
      record.className = 'ticket-flow__failure-record';
      const recordTitle = document.createElement('h3');
      recordTitle.textContent = messages.failureRecordTitle;
      const ledger = document.createElement('dl');
      ledger.className = 'ticket-flow__ledger';
      addDefinition(ledger, messages.allocatedSeats, '0');
      addDefinition(ledger, messages.offerBaseTotal, `${base} LMD`);
      addDefinition(ledger, messages.failureServiceFee, `${calculateFailureServiceFee(base)} LMD`);
      const notice = document.createElement('small');
      notice.textContent = messages.failureRecordDisclaimer;
      record.append(recordTitle, ledger, notice);
      details.append(record);
      actions.append(
        createButton('retry', messages.retryPremium, true),
        createButton('standard', messages.returnStandard),
        createButton('back', messages.backToBasket),
      );
    } else if (state.phase === 'success') {
      title.textContent = messages.success;
      copy.textContent = messages.receiptCopy;
      actions.append(createButton('receipt', messages.receiptTitle, true));
    } else {
      window.location.replace(officialPath ?? '/');
      return;
    }
    openDialog();
    live.textContent = title.textContent ?? messages.stateUpdated;
  };

  const processAttempt = async () => {
    if (processing || state.phase !== 'attempt') {
      renderDialog();
      return;
    }
    processing = true;
    state = resolveTicketingAttempt(state, random, ticketNumberFactory, acceptedAt);
    save();
    if (dialog.open) {
      suppressCloseFocus = true;
      dialog.close();
    }
    review.hidden = true;
    progress.hidden = false;
    const labels = [messages.submitted, messages.standardAttemptTitle, messages.stateUpdated];
    for (const [index, delay] of PARTNER_PROCESSING_DELAYS_MS.entries()) {
      progressValue.value = index + 1;
      progressLabel.textContent = labels[index];
      live.textContent = labels[index];
      await wait(delay);
    }
    processing = false;
    renderDialog();
  };

  actions.addEventListener('click', (event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>('[data-partner-action]')
        : null;
    const action = button?.dataset.partnerAction;
    if (!action || processing) {
      return;
    }
    suppressCloseFocus = true;
    dialog.close();
    if (action === 'retry') {
      state = retryTicketingAttempt(state);
    } else if (action === 'offer') {
      state = openPremiumOffer(state);
    } else if (action === 'accept-premium') {
      state = enterPremiumRoute(state);
    } else if (action === 'decline-premium') {
      state = declinePremiumOffer(state);
    } else if (action === 'accept-retention') {
      state = acceptRetentionOffer(state);
    } else if (action === 'decline-retention') {
      state = declineRetentionOffer(state);
    } else if (action === 'standard') {
      state = returnToStandardRoute(state);
    } else if (action === 'back') {
      state = returnToSelection(state);
    }
    save();
    if (action === 'receipt') {
      showResult(true);
      return;
    }
    if (action === 'back' || action === 'decline-retention') {
      window.location.assign(officialPath ?? '/');
      return;
    }
    if (state.phase === 'attempt') {
      void processAttempt();
    } else {
      renderDialog();
    }
  });

  review.addEventListener('click', renderDialog);
  dialog.addEventListener('close', () => {
    if (suppressCloseFocus) {
      suppressCloseFocus = false;
      return;
    }
    review.hidden = false;
    review.focus();
  });
  issuedTickets.addEventListener('click', (event) => {
    if (state.result) {
      handleTicketArtifactAction(event, state.result, options, messages, issuedTickets, live);
    }
  });
  newRound.addEventListener('click', () => {
    clearTicketingSession(storage);
    window.location.assign(officialPath ?? '/');
  });

  fallback.hidden = true;
  app.hidden = false;
  if (state.phase === 'attempt') {
    void processAttempt();
  } else if (state.phase === 'success') {
    showResult(true);
  } else {
    renderDialog();
  }
}
