import { formatMessage } from '../data/localized/format.ts';
import type { TicketArtifactMessages, TicketStampId } from '../data/localized/schema.ts';
import type { TicketingPerformanceOption } from '../data/ticketing.ts';
import type { TicketBasketItem } from './ticketing-state.ts';

export interface TicketArtifactStamp {
  id: TicketStampId;
  label: string;
}

export interface TicketArtifactInput {
  performance: TicketingPerformanceOption;
  basketItem: TicketBasketItem;
  zoneLabel: string;
  number: string;
  stamps: readonly TicketArtifactStamp[];
  messages: TicketArtifactMessages;
  locale: string;
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

function createTextMarkup(
  field: string,
  value: string,
  locale: string,
  x: number,
  y: number,
  options: TicketTextLayoutOptions,
  attributes: string,
): string {
  const layout = layoutTicketText(value, locale, options);
  const lines = layout.lines
    .map(
      (line, index) =>
        `<tspan x="${x}" y="${y + index * layout.lineHeight}" data-ticket-line="${index + 1}">${escapeXml(line)}</tspan>`,
    )
    .join('');
  return `<text data-ticket-field="${field}" font-size="${layout.fontSize}" ${attributes}>${lines}</text>`;
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

function createStampShape(id: TicketStampId): string {
  if (id === 'admission-confirmed') {
    return '<ellipse rx="70" ry="21"/><ellipse rx="64" ry="16"/>';
  }
  if (id === 'priority-route') {
    return '<path d="M0-24 72 0 0 24-72 0Z"/><path d="M0-18 61 0 0 18-61 0Z"/>';
  }
  if (id === 'network-recovered') {
    return '<rect x="-68" y="-20" width="136" height="40"/><rect x="-64" y="-16" width="136" height="40" stroke-dasharray="5 4" opacity=".55"/>';
  }
  if (id === 'returned-seat') {
    return '<rect x="-70" y="-21" width="140" height="42"/><path d="M-62-14h18m-18 7h12m100 14h-18m18 7h-12"/>';
  }
  if (id === 'retention-offer') {
    return '<path d="M-70-21h50l8 8 8-8h74v42H18l-8-8-8 8h-72Z" stroke-dasharray="7 4"/>';
  }
  if (id === 'manual-review') {
    return '<rect x="-70" y="-21" width="140" height="42"/><path d="M-60-12h18m-18 8h12m90-8h18m-12 8h12"/><circle cx="-59" cy="13" r="3"/><circle cx="59" cy="13" r="3"/>';
  }
  return '<rect x="-70" y="-21" width="140" height="42"/>';
}

function createStampMarkup(stamps: readonly TicketArtifactStamp[], accent: string): string {
  return stamps
    .map((stamp, index) => {
      const x = 630 + index * 118;
      const y = 482;
      const rotation = [-4, 2, -2, 3, -3][index] ?? 0;
      const graphemeCount = segmentTicketGraphemes(stamp.label, 'und').length;
      const fontSize = Math.max(9, Math.min(12, 130 / Math.max(graphemeCount, 1)));
      const fittedText =
        graphemeCount > 10 ? ' textLength="96" lengthAdjust="spacingAndGlyphs"' : '';
      return `<g data-stamp-id="${stamp.id}" transform="translate(${x} ${y}) rotate(${rotation})" fill="none" stroke="${accent}" stroke-width="2.4"><title>${escapeXml(stamp.label)}</title><g transform="scale(.78 1)">${createStampShape(stamp.id)}</g><text x="0" y="4" fill="${accent}" stroke="none" font-family="sans-serif" font-size="${fontSize}" font-weight="700" text-anchor="middle"${fittedText}>${escapeXml(stamp.label)}</text></g>`;
    })
    .join('');
}

export function createTicketSvg(input: TicketArtifactInput): string {
  const { performance, basketItem, zoneLabel, number, stamps, messages, locale } = input;
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
  const stampMarkup = createStampMarkup(stamps, accent);
  const titleMarkup = createTextMarkup(
    'title',
    performance.title,
    locale,
    70,
    128,
    {
      maxWidth: 770,
      maxHeight: 102,
      preferredFontSize: 54,
      minimumFontSize: 30,
      maxLines: 3,
    },
    'font-family="serif" font-weight="600" fill="#211713"',
  );
  const kindMarkup = createTextMarkup(
    'kind',
    performance.kind,
    locale,
    70,
    238,
    { maxWidth: 770, maxHeight: 36, preferredFontSize: 22, minimumFontSize: 16, maxLines: 2 },
    'font-family="sans-serif" fill="#6d625b"',
  );
  const dateTimeMarkup = createTextMarkup(
    'date-time',
    performance.dateTime,
    locale,
    70,
    316,
    { maxWidth: 770, maxHeight: 45, preferredFontSize: 29, minimumFontSize: 18, maxLines: 2 },
    'font-family="serif" fill="#211713"',
  );
  const placeMarkup = createTextMarkup(
    'place',
    performance.place,
    locale,
    70,
    374,
    { maxWidth: 770, maxHeight: 40, preferredFontSize: 20, minimumFontSize: 16, maxLines: 2 },
    'font-family="sans-serif" fill="#6d625b"',
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 540" width="1200" height="540" role="img" lang="${escapeXml(locale)}" aria-labelledby="title description" data-ticket-pattern="${texture.signature}">
  <title id="title">${escapeXml(formatMessage(messages.title, { title: performance.title }))}</title>
  <desc id="description">${escapeXml(formatMessage(messages.description, { dateTime: performance.dateTime, place: performance.place, zone: zoneLabel, price: basketItem.basePrice, number }))}</desc>
  <rect width="1200" height="540" fill="#f2ede3"/>
  <g fill="none" stroke="${accent}" stroke-width="1" opacity=".075">${textureLines}</g>
  <rect width="28" height="540" fill="${accent}"/>
  <rect x="42" y="32" width="1126" height="476" fill="none" stroke="#251a16" stroke-width="2"/>
  <g fill="#f2ede3" stroke="${accent}" stroke-width="1.5">${punches}</g>
  <path d="M880 32V508" stroke="#9a8e82" stroke-dasharray="8 8"/>
  <text x="70" y="72" font-family="sans-serif" font-size="18" letter-spacing="5" fill="${accent}">${escapeXml(messages.header)}</text>
  ${titleMarkup}
  ${kindMarkup}
  <text x="70" y="286" font-family="sans-serif" font-size="20" fill="#6d625b">${escapeXml(messages.dateTime)}</text>
  ${dateTimeMarkup}
  ${placeMarkup}
  <text x="70" y="440" font-family="sans-serif" font-size="20" fill="#6d625b">${escapeXml(messages.zone)}</text>
  <text x="150" y="440" font-family="serif" font-size="31" fill="#211713">${escapeXml(zoneLabel)}</text>
  <text x="350" y="410" font-family="sans-serif" font-size="20" fill="#6d625b">${escapeXml(messages.faceValue)}</text>
  <text x="350" y="444" font-family="serif" font-size="31" fill="#211713">${basketItem.basePrice} LMD</text>
  <g fill="#171310">${modules}</g>
  <text x="920" y="354" font-family="sans-serif" font-size="14" letter-spacing="2" fill="#6d625b">${escapeXml(messages.ticketNumber)}</text>
  <text x="920" y="382" font-family="monospace" font-size="22" fill="#211713">${number}</text>
  ${stampMarkup}
</svg>`;
}
