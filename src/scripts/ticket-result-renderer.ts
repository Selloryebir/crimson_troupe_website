import { formatMessage, formatTerraDateTime } from '../data/localized/format.ts';
import type { TicketingMessages } from '../data/localized/schema.ts';
import type { TicketingPerformanceOption } from '../data/ticketing.ts';
import { createTicketSvg, type TicketArtifactInput } from './ticket-artifact.ts';
import type { TicketBasketItem, TicketingEndingId, TicketingResult } from './ticketing-state.ts';

export interface TicketingResultElements {
  receipt: HTMLElement;
  issuedTickets: HTMLElement;
}

function createButton(action: string, label: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.ticketAction = action;
  button.className = 'text-button';
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

export function getTicketEndingLabels(
  messages: TicketingMessages,
): Readonly<Record<TicketingEndingId, string>> {
  return {
    ENDING_NETWORK_ERROR: messages.networkTitle,
    ENDING_NORMAL_SUCCESS: `${messages.standardChannel}: ${messages.success}`,
    ENDING_REJECT_RESCALPER: messages.returnStandard,
    ENDING_SCALPER_SUCCESS: `${messages.priorityChannel}: ${messages.success}`,
    ENDING_SCALPER_FAILED: `${messages.priorityChannel}: ${messages.premiumFailureTitle}`,
    ENDING_DISCOUNT_SUCCESS: `${messages.retentionOfferTitle}: ${messages.success}`,
    ENDING_DISCOUNT_FAILED: `${messages.retentionOfferTitle}: ${messages.premiumFailureTitle}`,
  };
}

function optionFor(
  options: readonly TicketingPerformanceOption[],
  performanceId: string,
): TicketingPerformanceOption | undefined {
  return options.find((option) => option.performanceId === performanceId);
}

function artifactInputFor(
  result: TicketingResult,
  option: TicketingPerformanceOption,
  basketItem: TicketBasketItem,
  number: string,
  messages: TicketingMessages,
): TicketArtifactInput {
  return {
    performance: option,
    basketItem,
    number,
    endingHistory: result.endingHistory,
    endingLabels: getTicketEndingLabels(messages),
    journeyTags: result.journeyTags,
    projection: option.artifact,
  };
}

export function renderTicketingResult(
  result: TicketingResult,
  options: readonly TicketingPerformanceOption[],
  messages: TicketingMessages,
  locale: string,
  elements: TicketingResultElements,
): void {
  const { receipt, issuedTickets } = elements;
  receipt.replaceChildren();
  issuedTickets.replaceChildren();

  const heading = document.createElement('div');
  heading.className = 'ticket-receipt__heading';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = messages.receiptEyebrow;
  const title = document.createElement('h2');
  title.id = 'ticket-result-title';
  title.tabIndex = -1;
  title.textContent = messages.receiptTitle;
  const copy = document.createElement('p');
  copy.textContent = messages.receiptCopy;
  heading.append(eyebrow, title, copy);

  const meta = document.createElement('dl');
  meta.className = 'ticket-receipt__meta';
  addDefinition(meta, messages.receiptAcceptedAt, formatTerraDateTime(result.acceptedAt, locale));
  addDefinition(
    meta,
    messages.receiptChannel,
    result.route === 'premium' ? messages.priorityChannel : messages.standardChannel,
  );
  addDefinition(meta, messages.receiptStatus, messages.receiptStatusAllocated);

  const lines = document.createElement('ol');
  lines.className = 'ticket-receipt__lines';
  for (const item of result.basket) {
    const option = optionFor(options, item.performanceId);
    const zoneLabel = option?.offers.find((offer) => offer.zone === item.zone)?.label;
    if (!option || !zoneLabel) {
      continue;
    }
    const line = document.createElement('li');
    const lineHeading = document.createElement('div');
    lineHeading.className = 'ticket-receipt__line-heading';
    const lineLabel = document.createElement('span');
    lineLabel.textContent = messages.receiptPerformance;
    const name = document.createElement('h3');
    name.textContent = option.title;
    lineHeading.append(lineLabel, name);
    const lineDetails = document.createElement('dl');
    lineDetails.className = 'ticket-receipt__line-details';
    addDefinition(lineDetails, messages.receiptSchedule, option.dateTime);
    addDefinition(lineDetails, messages.receiptVenue, option.place);
    addDefinition(lineDetails, messages.receiptZone, zoneLabel);
    addDefinition(lineDetails, messages.receiptFaceValue, `${item.basePrice} LMD`);
    line.append(lineHeading, lineDetails);
    lines.append(line);
  }

  const totals = document.createElement('dl');
  totals.className = 'ticket-receipt__totals';
  addDefinition(totals, messages.ticketSubtotal, `${result.baseTotal} LMD`);
  for (const adjustment of result.adjustments) {
    const sign = adjustment.amount < 0 ? '−' : '+';
    addDefinition(
      totals,
      messages.adjustments[adjustment.id],
      `${sign} ${Math.abs(adjustment.amount)} LMD`,
    );
  }
  addDefinition(totals, messages.amountDue, `${result.settledTotal} LMD`);
  const endingLabels = getTicketEndingLabels(messages);
  const disclaimer = document.createElement('small');
  disclaimer.textContent = messages.disclaimer;
  receipt.append(heading, meta, lines, totals, disclaimer);

  for (const issued of result.tickets) {
    const option = optionFor(options, issued.performanceId);
    const basketItem = result.basket.find((item) => item.performanceId === issued.performanceId);
    if (!option || !basketItem) {
      continue;
    }
    const primary = option.artifact.primary;
    const secondary = option.artifact.secondary;
    const artifactZoneLabel = primary.zoneLabels[basketItem.zone];
    if (!artifactZoneLabel) {
      continue;
    }
    const artifact = artifactInputFor(result, option, basketItem, issued.number, messages);
    const article = document.createElement('article');
    article.className = 'issued-ticket';
    article.dataset.issuedTicket = issued.performanceId;
    const image = document.createElement('img');
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createTicketSvg(artifact))}`;
    image.alt = formatMessage(primary.messages.alt, {
      title: primary.title,
      dateTime: primary.dateTime,
      place: primary.place,
      zone: artifactZoneLabel,
      price: basketItem.basePrice,
      number: issued.number,
    });
    const caption = document.createElement('div');
    caption.className = 'issued-ticket__caption';
    const ticketTitle = document.createElement('h3');
    ticketTitle.lang = primary.locale;
    ticketTitle.textContent = primary.title;
    const ticketMeta = document.createElement('p');
    ticketMeta.lang = primary.locale;
    ticketMeta.textContent = `${primary.dateTime} · ${primary.place} · ${artifactZoneLabel} · ${basketItem.basePrice} LMD`;
    const secondaryMeta = document.createElement('p');
    secondaryMeta.className = 'issued-ticket__secondary-language';
    if (secondary) {
      secondaryMeta.lang = secondary.locale;
      secondaryMeta.textContent = `${secondary.title} · ${secondary.dateTime} · ${secondary.place}`;
    } else {
      secondaryMeta.hidden = true;
    }
    const ticketNumber = document.createElement('p');
    ticketNumber.textContent = formatMessage(messages.ticketNumber, { number: issued.number });
    const journey = document.createElement('p');
    journey.className = 'visually-hidden';
    journey.dataset.ticketEndingHistory = '';
    journey.textContent = result.endingHistory
      .map((endingId) => endingLabels[endingId])
      .join(' → ');
    const controls = document.createElement('div');
    controls.className = 'issued-ticket__controls';
    controls.append(
      createButton(`download:${issued.performanceId}`, messages.downloadSvg),
      createButton(`print:${issued.performanceId}`, messages.printTicket),
    );
    caption.append(ticketTitle, ticketMeta, secondaryMeta, ticketNumber, journey, controls);
    article.append(image, caption);
    issuedTickets.append(article);
  }
}

export function handleTicketArtifactAction(
  event: Event,
  result: TicketingResult,
  options: readonly TicketingPerformanceOption[],
  messages: TicketingMessages,
  issuedTickets: HTMLElement,
  live: HTMLElement,
): void {
  const button =
    event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null;
  const action = button?.dataset.ticketAction;
  if (!action) {
    return;
  }
  const [kind, performanceId] = action.split(':');
  const issued = result.tickets.find((ticket) => ticket.performanceId === performanceId);
  const basketItem = result.basket.find((item) => item.performanceId === performanceId);
  const option = optionFor(options, performanceId);
  const article = [...issuedTickets.querySelectorAll<HTMLElement>('[data-issued-ticket]')].find(
    (item) => item.dataset.issuedTicket === performanceId,
  );
  if (!issued || !basketItem || !option || !article) {
    return;
  }
  if (kind === 'download') {
    const svg = createTicketSvg(
      artifactInputFor(result, option, basketItem, issued.number, messages),
    );
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
}
