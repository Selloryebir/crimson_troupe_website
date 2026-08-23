import type { ArchiveProjectionContent } from '../schema.ts';

export const columbiaArchiveProjection = {
  statusAnnouncement: 'Every record on the page has corrected its destination at once.',
  performance: {
    title: 'The Carnival',
    kind: 'Final performance',
    tagline: 'A seat remains reserved for the bearer',
    dateTime: '1084-11-11 23:49:00 · before the third bell',
    venue: 'Calais-Blason Woodland Castle',
    status: 'Awaiting attendance',
    registerCode: 'CT-██/INV-03',
    posterAlt: 'A scarlet performance folio leading to Calais-Blason Woodland Castle',
  },
  invitation: {
    ariaLabel: 'Formal invitation from Calais-Blason',
    eyebrow: 'Formal invitation / delivered',
    title: 'The castle has already reserved your seat',
    summary:
      'The records you just opened came from different dates and cities. They now leave only one route of arrival. They are not waiting to be repaired; they are waiting for you to choose the entrance.',
    roleLabel: 'Recorded capacity',
    productionLabel: 'Production',
    venueLabel: 'Venue',
    attendanceLabel: 'Attendance',
    role: 'Bearer of this invitation',
    production: 'The Carnival',
    venue: 'Calais-Blason Woodland Castle',
    attendance: 'Before the third bell',
    closing:
      'If you continue, the original record will still open. Do not take that to mean the castle lies behind the record. It merely saw you before this snapshot did.',
    dismissLabel: 'Close the invitation',
    continueLabel: 'Continue to the original record',
  },
  views: {
    invitation: {
      eyebrow: "Tonight's performance / entrance corrected",
      title: 'Every route now has only one destination',
      summary:
        'The performances on the home page retain their order, yet every folio has learned the same door.',
    },
    register: {
      eyebrow: 'Seating book / repeated entry',
      title: 'Nine records are calling for the same guest',
      summary:
        'Dates and numbers remain in place, but the venue in every row points to the same woodland castle.',
    },
    'performance-record': {
      eyebrow: 'Performance record / destination overwritten',
      title: 'This performance has arrived; only its audience is missing',
      summary:
        'The scheduled date and venue repeat behind the page. The visible record recognizes only the time printed on the invitation.',
    },
    'production-record': {
      eyebrow: 'Production record / title stripped',
      title: 'Every production takes the same name before the final curtain',
      summary:
        'Synopsis and company credits remain as pale ink. The scarlet title plate has already crossed their frame.',
    },
    company: {
      eyebrow: 'Company register / vacant capacity',
      title: 'Every office in the register is waiting for the same person',
      summary:
        'Names and history remain legible, but each capacity is held open for a bearer who has not yet arrived.',
    },
    inquiry: {
      eyebrow: 'Archive inquiry / only answer',
      title: 'You asked different questions; the archive remembers one place',
      summary:
        'The result count has not fallen. Every summary has replaced its former destination with the woodland castle.',
    },
    office: {
      eyebrow: 'Seating office / attendance confirmation',
      title: 'The settlement terminal is silent, but the seats know where you are going',
      summary:
        'Payment and redemption remain unavailable. Every section now leaves the same confirmation of arrival.',
    },
  },
} satisfies ArchiveProjectionContent;
