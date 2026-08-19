import type { TicketingPerformanceOption } from '../data/ticketing';
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

const STORAGE_KEY = 'crimson-troupe:ticketing:v1';

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
        !Array.isArray(option.offers) ||
        option.offers.length === 0,
    )
  ) {
    throw new Error('Ticketing options are unavailable');
  }
  return options;
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
  try {
    options = parseOptions(app.dataset.ticketingOptions);
  } catch {
    return;
  }

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

  const syncBasketControls = () => {
    form.querySelectorAll<HTMLElement>('[data-ticket-option]').forEach((row) => {
      const performanceId = row.dataset.ticketOption;
      const checkbox = row.querySelector<HTMLInputElement>('[data-ticket-select]');
      const select = row.querySelector<HTMLSelectElement>('[data-ticket-zone]');
      if (!performanceId || !checkbox || !select) {
        return;
      }
      const basketItem = state.basket.find((item) => item.performanceId === performanceId);
      checkbox.checked = Boolean(basketItem);
      select.disabled = !basketItem;
      if (basketItem) {
        select.value = basketItem.zone;
      }
    });
    const total = calculateBaseTotal(state.basket);
    count.textContent =
      state.basket.length > 0 ? `已选择 ${state.basket.length} 个场次` : '尚未选择场次';
    baseTotal.textContent = `${total} LMD`;
    start.disabled = state.basket.length === 0;
    selectionFeedback.textContent =
      state.basket.length > 0 ? '场次与分区已加入本次票篮。' : '至少选择一个场次后方可继续。';
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
      zoneLabel: offer.label,
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
    eyebrow.textContent = 'SIMULATED RECEIPT';
    const title = document.createElement('h3');
    title.textContent = '席位登记存单';
    const copy = document.createElement('p');
    copy.textContent = '本次请求已经得到确认。以下金额与席位仅属于当前模拟体验。';
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
      name.textContent = `${option.title} · ${item.zoneLabel}`;
      price.textContent = `${item.basePrice} LMD`;
      line.append(name, price);
      lines.append(line);
    }

    const totals = document.createElement('dl');
    totals.className = 'ticket-receipt__totals';
    addDefinition(totals, '基础总额', `${state.result.baseTotal} LMD`);
    if (state.result.adjustments.length === 0) {
      addDefinition(totals, '差额', '无');
    } else {
      for (const adjustment of state.result.adjustments) {
        addDefinition(totals, adjustment.label, `+ ${adjustment.amount} LMD`);
      }
    }
    addDefinition(totals, '模拟结算总额', `${state.result.settledTotal} LMD`);
    const disclaimer = document.createElement('small');
    disclaimer.textContent = '仅为小游戏内容，不产生任何兑换责任。';
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
        number: issued.number,
        stamps: state.result.stamps,
      };
      const article = document.createElement('article');
      article.className = 'issued-ticket';
      article.dataset.issuedTicket = issued.performanceId;
      const image = document.createElement('img');
      image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createTicketSvg(artifact))}`;
      image.alt = `${option.title}纪念票：${option.dateTime}，${option.place}，${basketItem.zoneLabel}，${basketItem.basePrice} LMD，票号与二维码数值 ${issued.number}`;
      const caption = document.createElement('div');
      caption.className = 'issued-ticket__caption';
      const ticketTitle = document.createElement('h4');
      ticketTitle.textContent = option.title;
      const ticketMeta = document.createElement('p');
      ticketMeta.textContent = `${option.dateTime} · ${option.place} · ${basketItem.zoneLabel} · ${basketItem.basePrice} LMD`;
      const ticketNumber = document.createElement('p');
      ticketNumber.textContent = `票面数值 ${issued.number}`;
      const stamps = document.createElement('p');
      stamps.className = 'issued-ticket__stamps';
      stamps.textContent = state.result.stamps.join(' · ');
      const controls = document.createElement('div');
      controls.className = 'issued-ticket__controls';
      controls.append(
        createButton(`download:${issued.performanceId}`, '下载 SVG'),
        createButton(`print:${issued.performanceId}`, '打印此票'),
      );
      caption.append(ticketTitle, ticketMeta, ticketNumber, stamps, controls);
      article.append(image, caption);
      issuedTickets.append(article);
    }
  };

  const renderFlow = () => {
    flowActions.replaceChildren();
    flowLabel.textContent = state.route === 'premium' ? 'PRIORITY CHANNEL' : 'STANDARD CHANNEL';
    if (state.phase === 'attempt') {
      flowTitle.textContent =
        state.route === 'premium' ? '优先线路正在重新检索席位' : '当前购票人数较多';
      flowCopy.textContent =
        state.route === 'premium'
          ? '线路声称可以提高请求顺序，并将在成功时加入服务差额。结果仍可能失败。'
          : '系统要求再次确认您仍然需要票篮中的全部场次。库存数字可能在提交后发生变化。';
      flowActions.append(
        createButton('resolve', '确认并提交请求', true),
        createButton('back', '返回票篮'),
      );
      return;
    }
    if (state.phase === 'network') {
      flowTitle.textContent = '网络在确认席位前失去响应';
      flowCopy.textContent = '请求没有形成结算结果，当前票篮已经保留。您可以按原线路重试。';
      flowActions.append(
        createButton('retry', '保留票篮并重试', true),
        createButton('back', '返回票篮'),
      );
      return;
    }
    flowTitle.textContent =
      state.route === 'premium' ? '优先线路仍未取得席位' : '当前购票人数较多，抢票失败';
    flowCopy.textContent =
      state.route === 'premium'
        ? '本次请求没有形成结算，票篮和基础价格保持不变。'
        : '您可以保留当前票篮重新提交，或尝试会在成功时增加费用的优先线路。';
    if (state.route === 'standard') {
      flowActions.append(
        createButton('retry', '按原线路重试', true),
        createButton('premium', '尝试加价线路'),
        createButton('back', '返回票篮'),
      );
    } else {
      flowActions.append(
        createButton('retry', '重试优先线路', true),
        createButton('standard', '取消加价并返回普通线路'),
        createButton('back', '返回票篮'),
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

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const next = startTicketingAttempt(state);
    if (next === state) {
      selectionFeedback.textContent = '请先选择至少一个场次。';
      return;
    }
    state = next;
    save();
    live.textContent = '票篮已提交，进入模拟购票流程。';
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
    live.textContent =
      state.phase === 'success' ? '购票成功，纪念票已经生成。' : '购票流程状态已更新。';
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
        number: issued.number,
        stamps: state.result.stamps,
      });
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `crimson-troupe-${performanceId}-${issued.number}.svg`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      live.textContent = `${option.title}纪念票下载已开始。`;
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
    live.textContent = '上一轮体验已经结束，可以重新选择场次。';
    render(true);
  });

  fallback.hidden = true;
  app.hidden = false;
  render();
}
