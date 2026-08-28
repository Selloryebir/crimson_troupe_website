import { formatMessage } from '../data/localized/format.ts';
import type { TicketArtifactProjection, TicketingPerformanceOption } from '../data/ticketing.ts';
import type { JourneyTag, TicketBasketItem, TicketingEndingId } from './ticketing-state.ts';

export interface TicketArtifactInput {
  performance: TicketingPerformanceOption;
  basketItem: TicketBasketItem;
  number: string;
  endingHistory: readonly TicketingEndingId[];
  endingLabels: Readonly<Record<TicketingEndingId, string>>;
  journeyTags: readonly JourneyTag[];
  projection: TicketArtifactProjection;
}

export interface TicketTexture {
  signature: string;
  lineYs: readonly number[];
  lineSlants: readonly number[];
  punchXs: readonly number[];
}

export interface TicketTextLayout {
  lines: readonly string[];
  fontSize: number;
  lineHeight: number;
}

export interface TicketTextLayoutOptions {
  maxWidth: number;
  maxHeight?: number;
  preferredFontSize: number;
  minimumFontSize: number;
  maxLines: number;
}

const visualColors: Record<TicketingPerformanceOption['visual'], string> = {
  moon: '#7f1724',
  flame: '#a94322',
  snow: '#365461',
  banquet: '#6f1720',
  lantern: '#8a4c24',
  masks: '#3e4038',
};

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const cjkGrapheme = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const wideGrapheme = /[\p{Extended_Pictographic}]/u;
const breakPunctuation = /[\s\-‐‑‒–—/\\·・,.;:!?，。；：！？、]/u;

export function segmentTicketGraphemes(value: string, locale: string): readonly string[] {
  if (typeof Intl.Segmenter === 'function') {
    return [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(value)].map(
      ({ segment }) => segment,
    );
  }

  const graphemes: string[] = [];
  let joinsPrevious = false;
  for (const codePoint of value) {
    const extendsPrevious =
      joinsPrevious ||
      /\p{Mark}/u.test(codePoint) ||
      /[\u{fe00}-\u{fe0f}\u{1f3fb}-\u{1f3ff}]/u.test(codePoint) ||
      codePoint === '\u200d';
    if (extendsPrevious && graphemes.length > 0) {
      graphemes[graphemes.length - 1] = `${graphemes.at(-1) ?? ''}${codePoint}`;
    } else {
      graphemes.push(codePoint);
    }
    joinsPrevious = codePoint === '\u200d';
  }
  return graphemes;
}

function graphemeWidth(grapheme: string): number {
  if (/^\s$/u.test(grapheme)) {
    return 0.34;
  }
  if (cjkGrapheme.test(grapheme) || wideGrapheme.test(grapheme)) {
    return 1;
  }
  if (/^[ilI1'’.,:;|!]$/u.test(grapheme)) {
    return 0.3;
  }
  if (/^[mwMW@#%&]$/u.test(grapheme)) {
    return 0.85;
  }
  if (/^[A-ZА-ЯЁΆ-Ώ]$/u.test(grapheme)) {
    return 0.68;
  }
  return 0.58;
}

function isBreakOpportunity(grapheme: string): boolean {
  return cjkGrapheme.test(grapheme) || breakPunctuation.test(grapheme);
}

function wrapTicketText(value: string, locale: string, maxUnits: number): readonly string[] {
  const graphemes = segmentTicketGraphemes(value.trim(), locale);
  if (graphemes.length === 0) {
    return [''];
  }

  const lines: string[] = [];
  let start = 0;
  while (start < graphemes.length) {
    let cursor = start;
    let width = 0;
    let lastBreak = -1;
    while (cursor < graphemes.length) {
      const nextWidth = width + graphemeWidth(graphemes[cursor]);
      if (nextWidth > maxUnits && cursor > start) {
        break;
      }
      width = nextWidth;
      cursor += 1;
      if (isBreakOpportunity(graphemes[cursor - 1])) {
        lastBreak = cursor;
      }
    }

    if (cursor < graphemes.length && lastBreak > start) {
      cursor = lastBreak;
    }
    lines.push(graphemes.slice(start, cursor).join('').trim());
    start = cursor;
    while (start < graphemes.length && /^\s$/u.test(graphemes[start])) {
      start += 1;
    }
  }
  return lines;
}

export function layoutTicketText(
  value: string,
  locale: string,
  options: TicketTextLayoutOptions,
): TicketTextLayout {
  const {
    maxWidth,
    maxHeight = Number.POSITIVE_INFINITY,
    preferredFontSize,
    minimumFontSize,
    maxLines,
  } = options;
  for (let fontSize = preferredFontSize; fontSize >= minimumFontSize; fontSize -= 2) {
    const lines = wrapTicketText(value, locale, maxWidth / fontSize);
    const lineHeight = Math.round(fontSize * 1.12);
    if (lines.length <= maxLines && lines.length * lineHeight <= maxHeight) {
      return {
        lines,
        fontSize,
        lineHeight,
      };
    }
  }
  throw new Error(
    `票面文字在最小字号 ${minimumFontSize} 下仍超过 ${maxLines} 行或 ${maxHeight} 像素高度。`,
  );
}

interface TicketTextBlock {
  markup: string;
  bottomY: number;
}

function createTicketTextBlock(
  field: string,
  value: string,
  locale: string,
  x: number,
  y: number,
  options: TicketTextLayoutOptions,
  attributes: string,
): TicketTextBlock {
  const layout = layoutTicketText(value, locale, options);
  const lines = layout.lines
    .map(
      (line, index) =>
        `<tspan x="${x}" y="${y + index * layout.lineHeight}" data-ticket-line="${index + 1}">${escapeXml(line)}</tspan>`,
    )
    .join('');
  return {
    markup: `<text data-ticket-field="${field}" font-size="${layout.fontSize}" ${attributes}>${lines}</text>`,
    bottomY: y + (layout.lines.length - 1) * layout.lineHeight,
  };
}

function seedFromNumber(number: string): number {
  return [...number].reduce(
    (seed, character, index) => (seed * 31 + character.charCodeAt(0) + index) >>> 0,
    17,
  );
}

function nextSeed(seed: number): number {
  return (seed * 1_664_525 + 1_013_904_223) >>> 0;
}

function finderModule(x: number, y: number, originX: number, originY: number): boolean | null {
  const localX = x - originX;
  const localY = y - originY;
  if (localX < 0 || localY < 0 || localX > 6 || localY > 6) {
    return null;
  }
  const border = localX === 0 || localX === 6 || localY === 0 || localY === 6;
  const center = localX >= 2 && localX <= 4 && localY >= 2 && localY <= 4;
  return border || center;
}

export function createTicketMatrix(number: string): readonly boolean[] {
  let seed = seedFromNumber(number);
  const modules: boolean[] = [];
  for (let y = 0; y < 21; y += 1) {
    for (let x = 0; x < 21; x += 1) {
      const finder =
        finderModule(x, y, 0, 0) ?? finderModule(x, y, 14, 0) ?? finderModule(x, y, 0, 14);
      if (finder !== null) {
        modules.push(finder);
        continue;
      }
      seed = nextSeed(seed);
      modules.push(((seed >>> 29) & 1) === 1);
    }
  }
  return modules;
}

export function createTicketTexture(number: string): TicketTexture {
  let seed = seedFromNumber(number);
  const lineYs: number[] = [];
  const lineSlants: number[] = [];
  const punchXs: number[] = [];
  for (let index = 0; index < 8; index += 1) {
    seed = nextSeed(seed);
    lineYs.push(92 + (seed % 310));
    seed = nextSeed(seed);
    lineSlants.push((seed % 37) - 18);
    seed = nextSeed(seed);
    punchXs.push(92 + index * 102 + (seed % 34));
  }
  const signature = [...lineYs, ...lineSlants, ...punchXs].join('-');
  return { signature, lineYs, lineSlants, punchXs };
}

const endingComponents: Readonly<Record<TicketingEndingId, string>> = {
  ENDING_NETWORK_ERROR:
    '<path d="M-91-4a94 64 0 0 1 29-43M-41-58a94 64 0 0 1 110 15M83-25a94 64 0 0 1 1 49" stroke-dasharray="15 7"/>',
  ENDING_NORMAL_SUCCESS:
    '<ellipse rx="45" ry="29"/><path d="M-22 0-7 15 25-17M-34-17h14m40 34h14"/>',
  ENDING_REJECT_RESCALPER:
    '<circle cx="-76" cy="31" r="7"/><circle cx="76" cy="-31" r="7"/><path d="M-67 25 67-25"/>',
  ENDING_SCALPER_SUCCESS:
    '<path d="M0-49 31-14 18-14 18 30-18 30-18-14-31-14Z"/><path d="M-12 13h24"/>',
  ENDING_SCALPER_FAILED:
    '<path d="M-69-32h33v18h-33zm105 46h33v18H36z"/><path d="M-58-23 58 23" stroke-dasharray="5 5"/>',
  ENDING_DISCOUNT_SUCCESS:
    '<path d="M-82 10q23-31 50-37M82-10Q59 21 32 27M-78 17l18-2-7-17M78-17l-18 2 7 17"/>',
  ENDING_DISCOUNT_FAILED:
    '<path d="M-94-17h19v-19M94 17H75v19M-94 17h19v19M94-17H75v-19"/><path d="M-15-8 15 8M-15 8 15-8"/>',
};

function createCompositeStampMarkup(
  endingHistory: readonly TicketingEndingId[],
  endingLabels: Readonly<Record<TicketingEndingId, string>>,
  journeyTags: readonly JourneyTag[],
  accent: string,
  transform = 'translate(1020 445) rotate(-3) scale(.78)',
  includeInactive = true,
): string {
  const activeEndings = new Set(endingHistory);
  const uniqueHistory = [...activeEndings];
  const accessibleHistory = uniqueHistory.map((endingId) => endingLabels[endingId]).join(' / ');
  const components = Object.entries(endingComponents)
    .filter(([endingId]) => includeInactive || activeEndings.has(endingId as TicketingEndingId))
    .map(([endingId, shape]) => {
      const active = activeEndings.has(endingId as TicketingEndingId);
      return `<g data-ending-component="${endingId}" data-active="${active}" opacity="${active ? '1' : '.1'}">${shape}</g>`;
    })
    .join('');
  const administrativeTexture = journeyTags.includes('returned-seat')
    ? '<path data-journey-mark="returned-seat" d="M-58 45h116M-43 51h86" stroke-dasharray="4 5"/>'
    : journeyTags.includes('manual-review')
      ? '<path data-journey-mark="manual-review" d="M-58 45h18m8 0h24m8 0h18m8 0h32M-48 51h96"/>'
      : '';
  const transformAttribute = transform ? ` transform="${transform}"` : '';
  return `<g data-ticket-composite-stamp="" data-ending-components="${escapeXml(uniqueHistory.join(' '))}"${transformAttribute} fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><title>${escapeXml(accessibleHistory)}</title><ellipse rx="102" ry="66" opacity=".7"/><ellipse rx="97" ry="61" stroke-dasharray="3 5" opacity=".52"/>${components}${administrativeTexture}</g>`;
}

export function createTicketStampPreviewSvg(
  endingHistory: readonly TicketingEndingId[],
  endingLabels: Readonly<Record<TicketingEndingId, string>>,
  journeyTags: readonly JourneyTag[],
): string {
  const stampMarkup = createCompositeStampMarkup(
    endingHistory,
    endingLabels,
    journeyTags,
    '#a94322',
    '',
    false,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -84 240 168" width="480" height="336" role="img"><rect x="-120" y="-84" width="240" height="168" rx="12" fill="#f2ede3"/>${stampMarkup}</svg>`;
}

export function createTicketSvg(input: TicketArtifactInput): string {
  const { performance, basketItem, number, endingHistory, endingLabels, journeyTags, projection } =
    input;
  const { primary, secondary } = projection;
  const zoneLabel = primary.zoneLabels[basketItem.zone];
  if (!zoneLabel) {
    throw new Error(`票面主语言 ${primary.editionId} 缺少 ${basketItem.zone} 分区标签。`);
  }
  const messages = primary.messages;
  const locale = primary.locale;
  const accent = visualColors[performance.visual];
  const matrix = createTicketMatrix(number);
  const texture = createTicketTexture(number);
  const modules = matrix
    .map((filled, index) => {
      if (!filled) {
        return '';
      }
      const x = 920 + (index % 21) * 10;
      const y = 112 + Math.floor(index / 21) * 10;
      return `<rect x="${x}" y="${y}" width="10" height="10"/>`;
    })
    .join('');
  const textureLines = texture.lineYs
    .map((y, index) => `<path d="M42 ${y}L880 ${y + (texture.lineSlants[index] ?? 0)}"/>`)
    .join('');
  const punches = texture.punchXs
    .map((x) => `<circle cx="${x}" cy="32" r="3"/><circle cx="${x}" cy="508" r="3"/>`)
    .join('');
  const stampMarkup = createCompositeStampMarkup(endingHistory, endingLabels, journeyTags, accent);
  let contentCursorY = 120;
  const titleBlock = createTicketTextBlock(
    'title',
    primary.title,
    locale,
    70,
    contentCursorY,
    {
      maxWidth: 770,
      maxHeight: 100,
      preferredFontSize: 52,
      minimumFontSize: 28,
      maxLines: 2,
    },
    'font-family="serif" font-weight="600" fill="#211713"',
  );
  contentCursorY = titleBlock.bottomY + 20;
  const secondaryTitleBlock = secondary
    ? createTicketTextBlock(
        'secondary-title',
        secondary.title,
        secondary.locale,
        70,
        contentCursorY,
        {
          maxWidth: 770,
          maxHeight: 44,
          preferredFontSize: 18,
          minimumFontSize: 13,
          maxLines: 2,
        },
        'font-family="serif" font-weight="600" fill="#4f4540"',
      )
    : undefined;
  if (secondaryTitleBlock) {
    contentCursorY = secondaryTitleBlock.bottomY + 20;
  }
  const kindBlock = createTicketTextBlock(
    'kind',
    primary.kind,
    locale,
    70,
    contentCursorY,
    { maxWidth: 770, maxHeight: 40, preferredFontSize: 20, minimumFontSize: 14, maxLines: 2 },
    'font-family="sans-serif" fill="#6d625b"',
  );
  const dateTimeLabelY = Math.max(kindBlock.bottomY + 34, 248);
  const dateTimeBlock = createTicketTextBlock(
    'date-time',
    primary.dateTime,
    locale,
    70,
    dateTimeLabelY + 30,
    { maxWidth: 770, maxHeight: 48, preferredFontSize: 27, minimumFontSize: 17, maxLines: 2 },
    'font-family="serif" fill="#211713"',
  );
  const secondaryDateTimeBlock = secondary
    ? createTicketTextBlock(
        'secondary-date-time',
        secondary.dateTime,
        secondary.locale,
        70,
        dateTimeBlock.bottomY + 22,
        {
          maxWidth: 770,
          maxHeight: 22,
          preferredFontSize: 14,
          minimumFontSize: 12,
          maxLines: 1,
        },
        'font-family="sans-serif" fill="#6d625b"',
      )
    : undefined;
  const dateTimeGroupBottom = secondaryDateTimeBlock?.bottomY ?? dateTimeBlock.bottomY;
  const placeY = Math.max(dateTimeGroupBottom + 34, 370);
  const placeBlock = createTicketTextBlock(
    'place',
    primary.place,
    locale,
    70,
    placeY,
    { maxWidth: 770, maxHeight: 42, preferredFontSize: 20, minimumFontSize: 15, maxLines: 2 },
    'font-family="sans-serif" fill="#6d625b"',
  );
  const secondaryPlaceBlock = secondary
    ? createTicketTextBlock(
        'secondary-place',
        secondary.place,
        secondary.locale,
        70,
        placeBlock.bottomY + 21,
        {
          maxWidth: 770,
          maxHeight: 22,
          preferredFontSize: 14,
          minimumFontSize: 12,
          maxLines: 1,
        },
        'font-family="sans-serif" fill="#6d625b"',
      )
    : undefined;
  const contentBottom = secondaryPlaceBlock?.bottomY ?? placeBlock.bottomY;
  if (contentBottom > 424) {
    throw new Error(`票面字段组超过可用内容高度：${contentBottom}。`);
  }

  const primaryLanguage = `data-ticket-language="primary" lang="${escapeXml(primary.locale)}"`;
  const secondaryLanguage = secondary
    ? `data-ticket-language="secondary" lang="${escapeXml(secondary.locale)}" opacity=".78"`
    : '';
  const productionGroupMarkup = `<g data-ticket-field-group="production">
  <g ${primaryLanguage}>${titleBlock.markup}</g>
  ${secondaryTitleBlock ? `<g ${secondaryLanguage}>${secondaryTitleBlock.markup}</g>` : ''}
  <g ${primaryLanguage}>${kindBlock.markup}</g>
</g>`;
  const dateTimeGroupMarkup = `<g data-ticket-field-group="date-time">
  <g ${primaryLanguage}>
    <text data-ticket-field="date-time-label" x="70" y="${dateTimeLabelY}" font-family="sans-serif" font-size="18" fill="#6d625b">${escapeXml(messages.dateTime)}</text>
    ${dateTimeBlock.markup}
  </g>
  ${secondaryDateTimeBlock ? `<g ${secondaryLanguage}>${secondaryDateTimeBlock.markup}</g>` : ''}
</g>`;
  const venueGroupMarkup = `<g data-ticket-field-group="venue">
  <g ${primaryLanguage}>${placeBlock.markup}</g>
  ${secondaryPlaceBlock ? `<g ${secondaryLanguage}>${secondaryPlaceBlock.markup}</g>` : ''}
</g>`;
  const zoneGroupMarkup = `<g data-ticket-field-group="zone">
  <g ${primaryLanguage}>
    <text data-ticket-field="zone-label" x="70" y="456" font-family="sans-serif" font-size="18" fill="#6d625b">${escapeXml(messages.zone)}</text>
    <text data-ticket-field="zone" x="150" y="480" font-family="serif" font-size="29" fill="#211713">${escapeXml(zoneLabel)}</text>
  </g>
  ${secondary ? `<g ${secondaryLanguage}><text data-ticket-field="secondary-zone-label" x="70" y="478" font-family="sans-serif" font-size="12" fill="#6d625b">${escapeXml(secondary.messages.zone)}</text></g>` : ''}
</g>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 540" width="1200" height="540" role="img" lang="${escapeXml(locale)}" aria-labelledby="title description" data-ticket-pattern="${texture.signature}">
  <title id="title">${escapeXml(formatMessage(messages.title, { title: primary.title }))}</title>
  <desc id="description">${escapeXml(formatMessage(messages.description, { dateTime: primary.dateTime, place: primary.place, zone: zoneLabel, price: basketItem.basePrice, number }))}</desc>
  <rect width="1200" height="540" fill="#f2ede3"/>
  <g fill="none" stroke="${accent}" stroke-width="1" opacity=".075">${textureLines}</g>
  <rect width="28" height="540" fill="${accent}"/>
  <rect x="42" y="32" width="1126" height="476" fill="none" stroke="#251a16" stroke-width="2"/>
  <g fill="#f2ede3" stroke="${accent}" stroke-width="1.5">${punches}</g>
  <path d="M880 32V508" stroke="#9a8e82" stroke-dasharray="8 8"/>
  <g ${primaryLanguage}>
  <text x="70" y="72" font-family="sans-serif" font-size="18" letter-spacing="5" fill="${accent}">${escapeXml(messages.header)}</text>
  </g>
  ${productionGroupMarkup}
  ${dateTimeGroupMarkup}
  ${venueGroupMarkup}
  ${zoneGroupMarkup}
  <g ${primaryLanguage}>
    <text data-ticket-field="face-value-label" x="350" y="450" font-family="sans-serif" font-size="18" fill="#6d625b">${escapeXml(messages.faceValue)}</text>
    <text data-ticket-field="face-value" x="350" y="480" font-family="serif" font-size="29" fill="#211713">${basketItem.basePrice} LMD</text>
  </g>
  <g fill="#171310">${modules}</g>
  <text x="920" y="354" font-family="sans-serif" font-size="14" letter-spacing="2" fill="#6d625b">${escapeXml(messages.ticketNumber)}</text>
  <text x="920" y="382" font-family="monospace" font-size="22" fill="#211713">${number}</text>
  ${stampMarkup}
</svg>`;
}
