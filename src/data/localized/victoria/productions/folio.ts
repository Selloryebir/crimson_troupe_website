import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';

export const victoriaFolioProductions = {
  'der-ring': {
    title: 'Der Ring',
    kind: 'Fantasy Play · Three Acts',
    tagline:
      'The lake remembers everyone who claimed its treasure—and every name they left behind.',
    duration: 'About 110 minutes, with one interval',
    durationShort: 'About 110 min',
    language: 'Performed in Leithanian · Victorian running order available',
    heading: 'A fantasy play of reflections, vows, and ownerless treasure.',
    synopsis:
      'A lake keeper entrusts a ring to a visitor, though no one can carry it away. After three moonsets the ring remains, while the keepers’ reflections descend one by one beneath the water.',
    guidance: 'Low light, reflected water effects, theatrical haze, and close whispers throughout.',
    creatives: [
      ['Adaptation', 'Old Troupe Book Room'],
      ['Lake Machinery', 'The Nameless Mirrormaker'],
      ['Music', 'Twin-Tower Strings'],
      ['Costume', 'Crimson Gauze Workshop'],
    ],
  },
  'one-hundred-and-one-days': {
    title: 'One Hundred and One Days',
    kind: 'Chronicle Play · Five Chapters',
    tagline: 'The hundredth day is for the living. The last belongs to those without return.',
    duration: 'About 135 minutes, with two intervals',
    durationShort: 'About 135 min',
    language: 'Performed in Victorian · Printed running order available',
    heading: 'A long chronicle assembled from one hundred letters never sent.',
    synopsis:
      'A clerk copies the same letter for a distant recipient each day. When the hundredth copy is finished, a second desk appears, and no one will say who must sign the hundred-and-first day.',
    guidance:
      'Includes bells, simulated burning paper, and extended silence. Late seating waits for the next chapter.',
    creatives: [
      ['Text', 'An Unnamed Clerk'],
      ['Direction', 'Old Troupe Book Room'],
      ['Stage Machinery', 'Gallery Workshop'],
      ['Recitation', 'Touring Chorus'],
    ],
  },
  'the-carnival': {
    title: 'The Carnival',
    kind: 'Festival Play · Seven Scenes',
    tagline: 'A celebration never lacks guests. It only sometimes lacks those who leave.',
    duration: 'About 95 minutes, without interval',
    durationShort: 'About 95 min',
    language: 'Multilingual performance · No captions',
    heading: 'Drums, paper streamers, and a procession that cannot be declared over.',
    synopsis:
      'The herald announces the festival seven times as the boundary between players and audience dissolves with each drumbeat. When the final banner rises, those still seated are invited to complete the curtain call.',
    guidance:
      'Performers enter audience aisles; includes sudden drums, confetti, low light, and close interaction.',
    creatives: [
      ['Festival Direction', 'Old Troupe Book Room'],
      ['Drums', 'The Nameless Drummer'],
      ['Masks', 'Crimson Gauze Workshop'],
      ['Procession', 'The Night Parade'],
    ],
  },
  'ode-au-triomphe': {
    title: 'Ode au Triomphe',
    kind: 'Choral Drama · Four Parts',
    tagline: 'The victor has not returned. The ode already remembers his voice.',
    duration: 'About 120 minutes, with one interval',
    durationShort: 'About 120 min',
    language: 'Sung in Siracusan and Leithanian · Victorian running order available',
    heading: 'A choral drama prepared for a triumph with no victor.',
    synopsis:
      'The city gate opens for a company that never departed, while the chorus praises each returnee from a blank register. Before the final bell, the audience must decide whether to rise for their own names.',
    guidance: 'Includes loud chorus, simulated salutes, incense, and brief bright light.',
    creatives: [
      ['Music', 'Stringless Chamber Society'],
      ['Direction', 'Old Troupe Book Room'],
      ['Chorus', 'Touring Chorus'],
      ['Ceremonial Costume', 'Gold-Thread Tailors'],
    ],
  },
} as const satisfies Record<FolioProductionId, ProductionContent>;
