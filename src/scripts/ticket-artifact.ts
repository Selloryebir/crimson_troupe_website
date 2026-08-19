import type { TicketingPerformanceOption } from '../data/ticketing';
import type { TicketBasketItem } from './ticketing-state';

export interface TicketArtifactInput {
  performance: TicketingPerformanceOption;
  basketItem: TicketBasketItem;
  number: string;
  stamps: readonly string[];
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
  const digits = [...number].map((value) => Number(value));
  let seed = digits.reduce((value, digit, index) => (value * 31 + digit + index) >>> 0, 17);
  const modules: boolean[] = [];
  for (let y = 0; y < 21; y += 1) {
    for (let x = 0; x < 21; x += 1) {
      const finder =
        finderModule(x, y, 0, 0) ?? finderModule(x, y, 14, 0) ?? finderModule(x, y, 0, 14);
      if (finder !== null) {
        modules.push(finder);
        continue;
      }
      seed = (seed * 1_664_525 + 1_013_904_223) >>> 0;
      modules.push(((seed >>> 29) & 1) === 1);
    }
  }
  return modules;
}

export function createTicketSvg(input: TicketArtifactInput): string {
  const { performance, basketItem, number, stamps } = input;
  const accent = visualColors[performance.visual];
  const matrix = createTicketMatrix(number);
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
  const stampMarkup = stamps
    .map(
      (stamp, index) =>
        `<g transform="translate(${650 + index * 120} 410) rotate(${index === 0 ? -7 : 5})"><rect x="-48" y="-23" width="96" height="46" rx="23"/><text x="0" y="6" fill="${accent}" stroke="none">${escapeXml(stamp)}</text></g>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 540" width="1200" height="540" role="img" aria-labelledby="title description">
  <title id="title">${escapeXml(performance.title)}纪念票</title>
  <desc id="description">${escapeXml(performance.dateTime)}，${escapeXml(performance.place)}，${escapeXml(basketItem.zoneLabel)}，${basketItem.basePrice} LMD，票号 ${number}</desc>
  <rect width="1200" height="540" fill="#f2ede3"/>
  <rect width="28" height="540" fill="${accent}"/>
  <rect x="42" y="32" width="1126" height="476" fill="none" stroke="#251a16" stroke-width="2"/>
  <path d="M880 32V508" stroke="#9a8e82" stroke-dasharray="8 8"/>
  <text x="70" y="72" font-family="sans-serif" font-size="18" letter-spacing="5" fill="${accent}">CRIMSON TROUPE · COMMEMORATIVE ADMISSION</text>
  <text x="70" y="146" font-family="serif" font-size="54" font-weight="600" fill="#211713">${escapeXml(performance.title)}</text>
  <text x="70" y="184" font-family="sans-serif" font-size="22" fill="#6d625b">${escapeXml(performance.kind)}</text>
  <text x="70" y="262" font-family="sans-serif" font-size="20" fill="#6d625b">泰拉日期与时间</text>
  <text x="70" y="298" font-family="serif" font-size="29" fill="#211713">${escapeXml(performance.dateTime)}</text>
  <text x="70" y="350" font-family="sans-serif" font-size="20" fill="#6d625b">${escapeXml(performance.place)}</text>
  <text x="70" y="440" font-family="sans-serif" font-size="20" fill="#6d625b">分区</text>
  <text x="150" y="440" font-family="serif" font-size="31" fill="#211713">${escapeXml(basketItem.zoneLabel)}</text>
  <text x="350" y="440" font-family="sans-serif" font-size="20" fill="#6d625b">票面基础价</text>
  <text x="490" y="440" font-family="serif" font-size="31" fill="#211713">${basketItem.basePrice} LMD</text>
  <g fill="#171310">${modules}</g>
  <text x="920" y="354" font-family="sans-serif" font-size="14" letter-spacing="2" fill="#6d625b">TICKET NUMBER</text>
  <text x="920" y="382" font-family="monospace" font-size="22" fill="#211713">${number}</text>
  <g fill="none" stroke="${accent}" stroke-width="3" font-family="sans-serif" font-size="15" text-anchor="middle">${stampMarkup}</g>
</svg>`;
}
