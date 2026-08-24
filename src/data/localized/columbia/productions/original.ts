import type { OriginalProductionId } from '../../../productions/original.ts';
import type { ProductionContent } from '../../schema.ts';

export const columbiaOriginalProductions = {
  uncrowned: {
    title: 'The Uncrowned Night',
    kind: 'Modern Tragedy · Three Acts',
    tagline: 'When the crown strikes the floor, who can prove there ever was a king?',
    duration: '125 minutes, including one intermission',
    durationShort: '125 min',
    language: 'Performed in Victorian · Columbian projected captions',
    heading: 'A modern tragedy of power, memory, and the final witness.',
    synopsis:
      'A mobile city wakes after a festival, yet no one remembers the king crowned the night before. The lone herald who continues the ceremony begins searching the audience’s dreams for a crown that never existed.',
    guidance:
      'Recommended for ages 12 and older. Includes brief bright light, theatrical haze, and simulated bells.',
    creatives: [
      ['Director', 'Lawrence Gray'],
      ['Text', 'Ada Winter'],
      ['Stage Design', 'Mira Sane'],
      ['Music', 'Troupe Chamber Ensemble'],
    ],
  },
  'caged-fire': {
    title: 'Fire in a Cage',
    kind: 'Chamber Opera · Two Acts',
    tagline: 'The flame cannot leave its cage. The song can.',
    duration: '90 minutes, no intermission',
    durationShort: '90 min',
    language: 'Sung in Leithanian · Columbian and Victorian captions',
    heading: 'A chamber opera written for a silent tower.',
    synopsis:
      'A keeper must tend a flame that may never go out and never leave its tower. In seven years he learns its language, only to hear it sing his name on the day he is allowed to depart.',
    guidance:
      'Recommended for ages 10 and older. Includes simulated open flame, low-frequency sound, and about 40 seconds of darkness.',
    creatives: [
      ['Composer', 'Elias Klein'],
      ['Director', 'Sabina Wolf'],
      ['Stage Design', 'Otto Hertz'],
      ['Lead Soprano', 'Cecilia Lane'],
    ],
  },
  'second-snow': {
    title: 'The Second Snow',
    kind: 'Experimental Dance Theater · One Part',
    tagline: 'The first snow covers the road. The second covers memory.',
    duration: '70 minutes, no intermission',
    durationShort: '70 min',
    language: 'No dialogue · Written guide available',
    heading: 'Bodies, white noise, and the shared memory of a freezing city.',
    synopsis:
      'Six dancers retrace an endless homeward journey beside abandoned rails. With every snowfall they forget another place name and gain another traveling companion.',
    guidance:
      'Recommended for ages 12 and older. The venue is kept cool and includes strobing light, white noise, and simulated snow; ask about non-strobe dates.',
    creatives: [
      ['Choreography', 'Noah Finch'],
      ['Music', 'White Plain Trio'],
      ['Lighting', 'Lucy Bach'],
      ['Installation', 'Norport Workshop'],
    ],
  },
  'red-banquet': {
    title: 'The Crimson Banquet',
    kind: 'Ceremonial Play · Four Parts',
    tagline: 'Leave your name outside. The banquet knows only those who arrive.',
    duration: 'About 140 minutes, with two intervals',
    durationShort: 'About 140 min',
    language: 'Performed in Yanese · Hand-copied program available',
    heading: 'A ceremonial play for a long night, an empty seat, and a late guest of honor.',
    synopsis:
      'Twelve attendants prepare a feast from an unsigned seating book. Each bell adds another place setting; before the final lamp dies, they must decide who may take the principal seat.',
    guidance:
      'Includes incense, low-light scenes, and close processions. Latecomers wait until the second part has ended.',
    creatives: [
      ['Chief Steward', 'Romeo'],
      ['Ritual Order', 'Madam White Elm'],
      ['Music', 'Stringless Chamber Society'],
      ['Costume and Masks', 'Crimson Gauze Workshop'],
    ],
  },
  'seventh-lantern': {
    title: 'The Seventh Lantern',
    kind: 'Shadow-Lantern Play · Seven Scenes',
    tagline: 'Six lights reveal the road home. The seventh reveals only you.',
    duration: 'About 75 minutes, without interval',
    durationShort: 'About 75 min',
    language: 'Performed in Yanese · No captions',
    heading: 'A shadow-lantern play performed only after sundown.',
    synopsis:
      'A lantern bearer recovers six lost travelers along the old road, but a seventh shadow always follows. Before dawn closes the gate, he asks the audience to name the one who never began the journey.',
    guidance:
      'Low light throughout, with moving flames and brief silence. Recommended for ages eight and older.',
    creatives: [
      ['Shadow Director', 'Huiming'],
      ['Verse', 'Zhezhi'],
      ['Figures', 'Hundred Eyes Workshop'],
      ['Percussion', 'Raven Trio'],
    ],
  },
  'procession-of-masks': {
    title: 'The Silent Procession',
    kind: 'Masked Mime · Five Scenes',
    tagline: 'After the procession passes, do not count the faces left behind.',
    duration: 'About 60 minutes, without interval',
    durationShort: 'About 60 min',
    language: 'No dialogue · Running order provided at admission',
    heading: 'A mime of masks, drums, and a street that forever turns back.',
    synopsis:
      'A leaderless procession searches the city for its festival square. Each time it crosses the same gate, the players wear masks more like the audience, until the drummer cannot distinguish the marchers from the watchers.',
    guidance:
      'Performers enter audience aisles; includes sudden drums and paper confetti. Front-row guests may be invited to raise a procession banner.',
    creatives: [
      ['Procession Director', 'Arturo'],
      ['Mask Design', 'Crimson Gauze Workshop'],
      ['Drums', 'Hermo and the Nameless Drummer'],
      ['Running Order', 'Old Troupe Book Room'],
    ],
  },
} as const satisfies Partial<Record<OriginalProductionId, ProductionContent>>;
