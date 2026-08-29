import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';
import { createFolioProductionContent } from '../../folio-source-texts.ts';

export const columbiaFolioProductions = {
  'der-ring': createFolioProductionContent('columbia', 'der-ring', {
    kind: 'Fantasy Play · Three Acts',
    duration: 'About 110 minutes, with one interval',
    durationShort: 'About 110 min',
    language: 'Performed in Leithanian · Columbian running order available',
    heading: 'A fantasy play of reflections, vows, and ownerless treasure.',
    guidance: 'Low light, reflected water effects, theatrical haze, and close whispers throughout.',
    creatives: [
      ['Adaptation', 'Old Troupe Book Room'],
      ['Lake Machinery', 'The Nameless Mirrormaker'],
      ['Music', 'Twin-Tower Strings'],
      ['Costume', 'Crimson Gauze Workshop'],
    ],
  }),
  'one-hundred-and-one-days': createFolioProductionContent('columbia', 'one-hundred-and-one-days', {
    kind: 'Chronicle Play · Five Chapters',
    duration: 'About 135 minutes, with two intervals',
    durationShort: 'About 135 min',
    language: 'Performed in Victorian · Columbian running order available',
    heading: 'A long chronicle assembled from one hundred letters never sent.',
    guidance:
      'Includes bells, simulated burning paper, and extended silence. Late seating waits for the next chapter.',
    creatives: [
      ['Text', 'An Unnamed Clerk'],
      ['Direction', 'Old Troupe Book Room'],
      ['Stage Machinery', 'Gallery Workshop'],
      ['Recitation', 'Touring Chorus'],
    ],
  }),
  'the-carnival': createFolioProductionContent('columbia', 'the-carnival', {
    kind: 'Festival Play · Seven Scenes',
    duration: 'About 95 minutes, without interval',
    durationShort: 'About 95 min',
    language: 'Multilingual performance · No captions',
    heading: 'Drums, paper streamers, and a procession that cannot be declared over.',
    guidance:
      'Performers enter audience aisles; includes sudden drums, confetti, low light, and close interaction.',
    creatives: [
      ['Festival Direction', 'Old Troupe Book Room'],
      ['Drums', 'The Nameless Drummer'],
      ['Masks', 'Crimson Gauze Workshop'],
      ['Procession', 'The Night Parade'],
    ],
  }),
  'ode-au-triomphe': createFolioProductionContent('columbia', 'ode-au-triomphe', {
    kind: 'Choral Drama · Four Parts',
    duration: 'About 120 minutes, with one interval',
    durationShort: 'About 120 min',
    language: 'Sung in Siracusan and Leithanian · Columbian running order available',
    heading: 'A choral drama prepared for a triumph with no victor.',
    guidance: 'Includes loud chorus, simulated salutes, incense, and brief bright light.',
    creatives: [
      ['Music', 'Stringless Chamber Society'],
      ['Direction', 'Old Troupe Book Room'],
      ['Chorus', 'Touring Chorus'],
      ['Ceremonial Costume', 'Gold-Thread Tailors'],
    ],
  }),
  'lone-wander': createFolioProductionContent('columbia', 'lone-wander', {
    kind: 'Fable play · three scenes',
    duration: 'Approx. 105 minutes, with one intermission',
    durationShort: 'Approx. 105 min',
    language: 'Touring repertory · programme sheet available',
    heading: 'A traveller searches an empty road for its final inn.',
    guidance: 'Low light, stage haze and close sound are used; follow the usher to your place.',
    creatives: [
      ['Direction', 'Old Troupe Playroom'],
      ['Stage', 'Long Gallery Workshop'],
    ],
  }),
  'wonderland-in-dream': createFolioProductionContent('columbia', 'wonderland-in-dream', {
    kind: 'Dream play · four acts',
    duration: 'Approx. 105 minutes, with one intermission',
    durationShort: 'Approx. 105 min',
    language: 'Touring repertory · programme sheet available',
    heading: 'An inverted garden, paper doors and a sleeping guide compose this dream procession.',
    guidance: 'Low light, stage haze and close sound are used; follow the usher to your place.',
    creatives: [
      ['Direction', 'Old Troupe Playroom'],
      ['Stage', 'Long Gallery Workshop'],
    ],
  }),
  'frost-deer-and-snow-doe': createFolioProductionContent('columbia', 'frost-deer-and-snow-doe', {
    kind: 'Winter opera · three acts',
    duration: 'Approx. 105 minutes, with one intermission',
    durationShort: 'Approx. 105 min',
    language: 'Touring repertory · programme sheet available',
    heading: 'A winter opera of pursuit, vigil and two white deer.',
    guidance: 'Low light, stage haze and close sound are used; follow the usher to your place.',
    creatives: [
      ['Direction', 'Old Troupe Playroom'],
      ['Stage', 'Long Gallery Workshop'],
    ],
  }),
  'light-of-heria': createFolioProductionContent('columbia', 'light-of-heria', {
    kind: 'Icon play · five chapters',
    duration: 'Approx. 105 minutes, with one intermission',
    durationShort: 'Approx. 105 min',
    language: 'Touring repertory · programme sheet available',
    heading: 'Golden icons, a long stair and lamps extinguished in sequence form this rite.',
    guidance: 'Low light, stage haze and close sound are used; follow the usher to your place.',
    creatives: [
      ['Direction', 'Old Troupe Playroom'],
      ['Stage', 'Long Gallery Workshop'],
    ],
  }),
} as const satisfies Partial<Record<FolioProductionId, ProductionContent>>;
