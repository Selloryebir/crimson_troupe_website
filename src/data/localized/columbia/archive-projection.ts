import type { ArchiveProjectionContent } from '../schema.ts';

export const columbiaArchiveProjection = {
  statusAnnouncement: 'The archive display has converged on one open invitation record.',
  ariaLabel: 'Calais-Blason open archive record',
  roleLabel: 'Recorded capacities',
  productionLabel: 'Production',
  venueLabel: 'Venue',
  attendanceLabel: 'Attendance',
  role: 'guest / local resident / dramatic role',
  production: 'The Carnival',
  venue: 'Calais-Blason Woodland Castle',
  attendance: 'before the third bell, Terra Year 1091',
  closing:
    'Dates, venues, and seats previously shown on this site need not be cancelled individually. Upon arrival at the castle, they will be filed as separate records of the same performance. Exit instructions will be issued after the final curtain.',
  views: {
    invitation: {
      eyebrow: 'Calais-Blason District Archive Addendum',
      title: 'Notice of Consolidated Open Records',
      summary:
        "The Viscount's banquet register, the district levy shortfall, the Victorian reception inventory, and the Crimson Troupe's new-stage seating book retain the same unresolved vacancy. The first three records are closed; the last still awaits its guest. All four vacancies are now assigned to the bearer of this invitation.",
    },
    register: {
      eyebrow: 'Seating book / consolidated collation',
      title: 'Nine records share one unresolved vacancy',
      summary:
        'The dates, venues, and numbers under current and historical performances remain valid archive records. Each has also been marked as a separate volume of the same performance, to be surrendered together upon arrival at the woodland castle.',
    },
    'performance-record': {
      eyebrow: 'Performance record / pending consolidation',
      title: 'This performance is not cancelled; it has not yet arrived',
      summary:
        'The time, venue, and seating on this page retain their original registration. The archive treats them as advance records made before arrival at Calais-Blason and adds this page visitor to the final register awaiting attendance.',
    },
    'production-record': {
      eyebrow: 'Production record / alternate-title collation',
      title: 'The catalog title is registered as a rehearsal name',
      summary:
        'This page retains its title, synopsis, and creative record. The consolidated archive adds only a cross-reference: each distinct title is filed in the new-stage seating book under the same production, The Carnival.',
    },
    company: {
      eyebrow: 'Company register / capacity addendum',
      title: 'Guest, local resident, and dramatic role share one field',
      summary:
        "The troupe history and company register have not been removed. Only the new-stage seating book erases the boundary between three capacities and enters the invitation's bearer into the remaining vacancy.",
    },
    inquiry: {
      eyebrow: 'Archive inquiry / cross-reference',
      title: 'Results remain separate; their filing destination agrees',
      summary:
        'The returned pages, productions, and performances still point to their original records. The archive appends the same open number to each result, pending their collation at the woodland castle as separate evidence of one performance.',
    },
    office: {
      eyebrow: 'Seating office / open assignment',
      title: 'The historic snapshot sells no ticket, but the vacancy has transferred',
      summary:
        "This page still provides no purchase, payment, or redemption. The notice treats vacancies in the banquet, levy, reception, and theater as one seat assignment requiring no transaction, transferred to this invitation's bearer.",
    },
  },
} satisfies ArchiveProjectionContent;
