import { formatMessage, formatTerraDateTime } from '../data/localized/format.ts';
import type { TicketArtifactFinishId, TicketingMessages } from '../data/localized/schema.ts';
import type { TicketingPerformanceOption } from '../data/ticketing.ts';
import {
  createTicketStampPreviewSvg,
  createTicketSvg,
  type TicketArtifactInput,
} from './ticket-artifact.ts';
import type { TicketBasketItem, TicketingEndingId, TicketingResult } from './ticketing-state.ts';

export interface TicketingResultElements {
  journey: HTMLElement;
  receipt: HTMLElement;
  finishWorkshop: HTMLElement;
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

function renderJourneyLedger(
  result: TicketingResult,
  messages: TicketingMessages,
  target: HTMLElement,
): void {
  const endingLabels = getTicketEndingLabels(messages);
  const header = document.createElement('div');
  header.className = 'ticket-journey__header';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = messages.journey.eyebrow;
  const title = document.createElement('h2');
  title.id = 'ticket-result-title';
  title.tabIndex = -1;
  title.textContent = messages.journey.title;
  const copy = document.createElement('p');
  copy.textContent = messages.journey.copy;
  header.append(eyebrow, title, copy);

  const route = document.createElement('section');
  route.className = 'ticket-journey__route';
  const routeTitle = document.createElement('h3');
  routeTitle.textContent = messages.journey.routeTitle;
  const steps = document.createElement('ol');
  steps.className = 'ticket-journey__steps';
  steps.dataset.ticketJourneySteps = '';
  for (const endingId of result.endingHistory) {
    const item = document.createElement('li');
    item.dataset.ticketJourneyEnding = endingId;
    item.textContent = endingLabels[endingId];
    steps.append(item);
  }
  route.append(routeTitle, steps);

  const marks = document.createElement('section');
  marks.className = 'ticket-journey__marks';
  const marksTitle = document.createElement('h3');
  marksTitle.textContent = messages.journey.marksTitle;
  marks.append(marksTitle);
  if (result.journeyTags.length === 0) {
    const noMarks = document.createElement('p');
    noMarks.className = 'ticket-journey__empty';
    noMarks.textContent = messages.journey.noMarks;
    marks.append(noMarks);
  } else {
    const tagList = document.createElement('ul');
    tagList.className = 'ticket-journey__tag-list';
    for (const tag of result.journeyTags) {
      const item = document.createElement('li');
      item.dataset.ticketJourneyTag = tag;
      item.textContent = messages.journey.tags[tag];
      tagList.append(item);
    }
    marks.append(tagList);
  }

  const totals = document.createElement('dl');
  totals.className = 'ticket-journey__totals';
  addDefinition(
    totals,
    messages.receiptChannel,
    result.route === 'premium' ? messages.priorityChannel : messages.standardChannel,
  );
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

  const body = document.createElement('div');
  body.className = 'ticket-journey__body';
  body.append(route, marks, totals);

  const inspector = document.createElement('details');
  inspector.className = 'ticket-stamp-inspector';
  inspector.dataset.ticketStampInspector = '';
  const summary = document.createElement('summary');
  summary.textContent = messages.stampInspector.summary;
  const inspectorBody = document.createElement('div');
  inspectorBody.className = 'ticket-stamp-inspector__body';
  const visual = document.createElement('img');
  visual.className = 'ticket-stamp-inspector__preview';
  visual.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    createTicketStampPreviewSvg(result.endingHistory, endingLabels, result.journeyTags),
  )}`;
  visual.alt = messages.stampInspector.previewAlt;
  const explanation = document.createElement('div');
  const inspectorTitle = document.createElement('h3');
  inspectorTitle.textContent = messages.stampInspector.title;
  const inspectorCopy = document.createElement('p');
  inspectorCopy.textContent = messages.stampInspector.copy;
  const componentList = document.createElement('ul');
  componentList.className = 'ticket-stamp-inspector__components';
  for (const endingId of new Set(result.endingHistory)) {
    const item = document.createElement('li');
    item.dataset.ticketStampComponent = endingId;
    item.textContent = formatMessage(messages.stampInspector.endingComponent, {
      label: endingLabels[endingId],
    });
    componentList.append(item);
  }
  for (const tag of result.journeyTags) {
    if (tag !== 'returned-seat' && tag !== 'manual-review') {
      continue;
    }
    const item = document.createElement('li');
    item.dataset.ticketStampComponent = tag;
    item.textContent = formatMessage(messages.stampInspector.journeyComponent, {
      label: messages.journey.tags[tag],
    });
    componentList.append(item);
  }
  explanation.append(inspectorTitle, inspectorCopy, componentList);
  inspectorBody.append(visual, explanation);
  inspector.append(summary, inspectorBody);
  target.append(header, body, inspector);
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
    artifactFinishId: result.artifactFinishId,
  };
}

const ticketArtifactFinishIds: readonly TicketArtifactFinishId[] = [
  'deckle-edge',
  'registration-shift',
  'ticket-punch',
];

function renderFinishWorkshop(
  result: TicketingResult,
  messages: TicketingMessages,
  target: HTMLElement,
): void {
  target.className = 'ticket-finish-workshop';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = messages.finishWorkshop.eyebrow;
  const title = document.createElement('h2');
  title.textContent = messages.finishWorkshop.title;
  const copy = document.createElement('p');
  copy.textContent = messages.finishWorkshop.copy;
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = messages.finishWorkshop.legend;
  const choices = document.createElement('div');
  choices.className = 'ticket-finish-workshop__choices';
  for (const finishId of ticketArtifactFinishIds) {
    const choice = messages.finishWorkshop.choices[finishId];
    const label = document.createElement('label');
    label.className = 'ticket-finish-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'ticket-artifact-finish';
    input.value = finishId;
    input.dataset.ticketFinish = finishId;
    input.checked = result.artifactFinishId === finishId;
    const text = document.createElement('span');
    const choiceTitle = document.createElement('strong');
    choiceTitle.textContent = choice.title;
    const description = document.createElement('small');
    description.textContent = choice.description;
    text.append(choiceTitle, description);
    label.append(input, text);
    choices.append(label);
  }
  const hint = document.createElement('p');
  hint.className = 'ticket-finish-workshop__hint';
  hint.dataset.ticketFinishHint = '';
  hint.textContent = messages.finishWorkshop.requiredHint;
  fieldset.append(legend, choices);
  target.append(eyebrow, title, copy, fieldset, hint);
}

export function renderTicketingResult(
  result: TicketingResult,
  options: readonly TicketingPerformanceOption[],
  messages: TicketingMessages,
  locale: string,
  elements: TicketingResultElements,
): void {
  const { journey, receipt, finishWorkshop, issuedTickets } = elements;
  journey.replaceChildren();
  receipt.replaceChildren();
  finishWorkshop.replaceChildren();
  issuedTickets.replaceChildren();
  journey.className = 'ticket-journey';
  renderJourneyLedger(result, messages, journey);
  renderFinishWorkshop(result, messages, finishWorkshop);

  const heading = document.createElement('div');
  heading.className = 'ticket-receipt__heading';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = messages.receiptEyebrow;
  const title = document.createElement('h2');
  title.id = 'ticket-receipt-title';
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
    const productionGroup = document.createElement('div');
    productionGroup.className = 'issued-ticket__field-group issued-ticket__production';
    productionGroup.dataset.ticketFieldGroup = 'production';
    const ticketTitle = document.createElement('h3');
    ticketTitle.lang = primary.locale;
    ticketTitle.textContent = primary.title;
    productionGroup.append(ticketTitle);
    if (secondary) {
      const secondaryTitle = document.createElement('p');
      secondaryTitle.className = 'issued-ticket__secondary-language';
      secondaryTitle.lang = secondary.locale;
      secondaryTitle.textContent = secondary.title;
      productionGroup.append(secondaryTitle);
    }
    const kind = document.createElement('p');
    kind.className = 'issued-ticket__kind';
    kind.lang = primary.locale;
    kind.textContent = primary.kind;
    productionGroup.append(kind);

    const dateTimeGroup = document.createElement('div');
    dateTimeGroup.className = 'issued-ticket__field-group';
    dateTimeGroup.dataset.ticketFieldGroup = 'date-time';
    const primaryDateTime = document.createElement('p');
    primaryDateTime.lang = primary.locale;
    primaryDateTime.textContent = primary.dateTime;
    dateTimeGroup.append(primaryDateTime);
    if (secondary) {
      const secondaryDateTime = document.createElement('p');
      secondaryDateTime.className = 'issued-ticket__secondary-language';
      secondaryDateTime.lang = secondary.locale;
      secondaryDateTime.textContent = secondary.dateTime;
      dateTimeGroup.append(secondaryDateTime);
    }

    const venueGroup = document.createElement('div');
    venueGroup.className = 'issued-ticket__field-group';
    venueGroup.dataset.ticketFieldGroup = 'venue';
    const primaryVenue = document.createElement('p');
    primaryVenue.lang = primary.locale;
    primaryVenue.textContent = primary.place;
    venueGroup.append(primaryVenue);
    if (secondary) {
      const secondaryVenue = document.createElement('p');
      secondaryVenue.className = 'issued-ticket__secondary-language';
      secondaryVenue.lang = secondary.locale;
      secondaryVenue.textContent = secondary.place;
      venueGroup.append(secondaryVenue);
    }

    const facts = document.createElement('p');
    facts.className = 'issued-ticket__facts';
    facts.lang = primary.locale;
    facts.textContent = `${artifactZoneLabel} · ${basketItem.basePrice} LMD`;
    const ticketNumber = document.createElement('p');
    ticketNumber.className = 'issued-ticket__number';
    ticketNumber.textContent = formatMessage(messages.ticketNumber, { number: issued.number });
    const journey = document.createElement('p');
    journey.className = 'visually-hidden';
    journey.dataset.ticketEndingHistory = '';
    journey.textContent = result.endingHistory
      .map((endingId) => endingLabels[endingId])
      .join(' → ');
    const controls = document.createElement('div');
    controls.className = 'issued-ticket__controls';
    const download = createButton(`download:${issued.performanceId}`, messages.downloadSvg);
    const print = createButton(`print:${issued.performanceId}`, messages.printTicket);
    download.disabled = result.artifactFinishId === null;
    print.disabled = result.artifactFinishId === null;
    controls.append(download, print);
    caption.append(
      productionGroup,
      dateTimeGroup,
      venueGroup,
      facts,
      ticketNumber,
      journey,
      controls,
    );
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
  if (!result.artifactFinishId) {
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
