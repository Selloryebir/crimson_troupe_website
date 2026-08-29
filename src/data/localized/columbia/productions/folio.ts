import type { FolioProductionId } from '../../../productions/folio.ts';
import type { ProductionContent } from '../../schema.ts';

export const columbiaFolioProductions = {
  'der-ring': {
    title: 'Der Ring',
    kind: 'Fantasy Play · Three Acts',
    tagline:
      'The lake remembers everyone who claimed its treasure—and every name they left behind.',
    duration: 'About 110 minutes, with one interval',
    durationShort: 'About 110 min',
    language: 'Performed in Leithanian · Columbian running order available',
    heading: 'A fantasy play of reflections, vows, and ownerless treasure.',
    synopsis:
      'Even if towers collapse because of it and people kill one another over it, Leithanien’s treasure will never remain on a Caprinae’s finger. The shallow lake in the forest is the home it has always longed for.',
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
    language: 'Performed in Victorian · Columbian running order available',
    heading: 'A long chronicle assembled from one hundred letters never sent.',
    synopsis:
      'Once, a commoner told a merchant a magnificent story. Passed from one person to the next, it reached the Khagan one hundred and one days later. Intrigued, he traveled incognito to seek the story’s source, only to discover that he had already had the commoner executed.',
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
    synopsis: 'Celebrate, my friend! Something this good does not happen every day.',
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
    language: 'Sung in Siracusan and Leithanian · Columbian running order available',
    heading: 'A choral drama prepared for a triumph with no victor.',
    synopsis:
      'Let us join in song to celebrate the Emperor’s triumph! Long live the Emperor! Long live Gaul!',
    guidance: 'Includes loud chorus, simulated salutes, incense, and brief bright light.',
    creatives: [
      ['Music', 'Stringless Chamber Society'],
      ['Direction', 'Old Troupe Book Room'],
      ['Chorus', 'Touring Chorus'],
      ['Ceremonial Costume', 'Gold-Thread Tailors'],
    ],
  },
  'lone-wander': {
    title: 'Lone Wander',
    kind: 'Fable play · three scenes',
    tagline: 'The lone road always keeps a second set of footsteps.',
    duration: 'Approx. 105 minutes, with one intermission',
    durationShort: 'Approx. 105 min',
    language: 'Touring repertory · programme sheet available',
    heading: 'A traveller searches an empty road for its final inn.',
    synopsis:
      'In the cracks of the land, beneath the shadows of the cities, a solitary eccentric watches everything. Within the ugly iron-bucket mask lurk conspiracy and madness.',
    guidance: 'Low light, stage haze and close sound are used; follow the usher to your place.',
    creatives: [
      ['Direction', 'Old Troupe Playroom'],
      ['Stage', 'Long Gallery Workshop'],
    ],
  },
  'wonderland-in-dream': {
    title: 'Wonderland in Dream',
    kind: 'Dream play · four acts',
    tagline: 'Every dream offers an entrance, but none offers the direction of waking.',
    duration: 'Approx. 105 minutes, with one intermission',
    durationShort: 'Approx. 105 min',
    language: 'Touring repertory · programme sheet available',
    heading: 'An inverted garden, paper doors and a sleeping guide compose this dream procession.',
    synopsis:
      'Even if you cannot reach the distant castle, at least you still have a companion, and I still have you.',
    guidance: 'Low light, stage haze and close sound are used; follow the usher to your place.',
    creatives: [
      ['Direction', 'Old Troupe Playroom'],
      ['Stage', 'Long Gallery Workshop'],
    ],
  },
  'frost-deer-and-snow-doe': {
    title: 'Frost Deer and Snow Doe',
    kind: 'Winter opera · three acts',
    tagline: 'Two tracks meet at the snowline; only one continues towards spring.',
    duration: 'Approx. 105 minutes, with one intermission',
    durationShort: 'Approx. 105 min',
    language: 'Touring repertory · programme sheet available',
    heading: 'A winter opera of pursuit, vigil and two white deer.',
    synopsis:
      'As the kindred guards of the Snowpriest, our wish is to die by cold iron.\n\nAs twins bound by blood, our wish is to live and die together.\n\nYou have too many wishes. Only one can be granted, and I shall choose which.',
    guidance: 'Low light, stage haze and close sound are used; follow the usher to your place.',
    creatives: [
      ['Direction', 'Old Troupe Playroom'],
      ['Stage', 'Long Gallery Workshop'],
    ],
  },
  'light-of-heria': {
    title: 'Light of Heria',
    kind: 'Icon play · five chapters',
    tagline: 'The light reveals the gate and leads every shadow within to one place.',
    duration: 'Approx. 105 minutes, with one intermission',
    durationShort: 'Approx. 105 min',
    language: 'Touring repertory · programme sheet available',
    heading: 'Golden icons, a long stair and lamps extinguished in sequence form this rite.',
    synopsis:
      'At the most perilous moment, heroes descended from the sun, crossed the summit of Mount Heria, and came to stand beside Minos.',
    guidance: 'Low light, stage haze and close sound are used; follow the usher to your place.',
    creatives: [
      ['Direction', 'Old Troupe Playroom'],
      ['Stage', 'Long Gallery Workshop'],
    ],
  },
} as const satisfies Partial<Record<FolioProductionId, ProductionContent>>;
