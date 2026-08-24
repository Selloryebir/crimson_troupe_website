import type { LocalizedShape } from '../schema';
import type { yanMessages } from '../yan/messages';
import type { yanTicketingPlatforms } from '../yan/messages';

export const victoriaTicketingPlatforms = {
  'rice-network': { displayName: 'RiceNet', logoAlt: 'RiceNet preview mark' },
  'drop-tower': { displayName: 'Drop Tower', logoAlt: 'Drop Tower preview mark' },
} as const satisfies LocalizedShape<typeof yanTicketingPlatforms>;

export const victoriaMessages = {
  filters: {
    city: 'City',
    allCities: 'All Cities',
    month: 'Month',
    allMonths: 'All Months',
    monthOption: 'Month {month}',
    reset: 'Reset Filters',
    count: '{count} performances',
    empty: 'No performances match these filters. Try another city or month.',
  },
  search: {
    label: 'Search this website',
    submit: 'Search',
    scope: 'Search scope: {scope}',
    unavailable: 'The search index is temporarily unavailable. Continue with the main navigation.',
    prompt: 'Enter a term to find performances, productions, and website pages.',
    minimumQuery: 'Enter at least {count} characters.',
    resultCount: '{count} results found.',
    noResults: 'No matching content was found.',
    noscriptTitle: 'Search requires JavaScript',
    noscriptCopy:
      'This page sends no query and loads no remote service. You can still browse performances and company information with the main navigation.',
  },
  ticketing: {
    partnerPageEyebrow: 'OFFICIAL TICKETING PARTNER',
    partnerPageTitle: '{platform} Seat Service',
    partnerPageIntroduction:
      'The troupe website has handed this basket to its partner platform. This preview provides only a reliable fallback destination.',
    partnerUnavailableTitle: 'Connection flow not yet open',
    partnerUnavailableCopy:
      'This preview contacts no remote service and creates no transaction. You may safely return to the official basket.',
    returnToBasket: 'Return to Official Basket',
    selectedCount: '{count} performances selected',
    emptyBasket: 'No performances selected',
    selectionReady: 'The performance and seating zone are in this basket.',
    selectionRequired: 'Select at least one performance to continue.',
    zonePreview: 'Viewing: {zone} · {price} LMD. Not yet in the basket.',
    zoneInBasket: 'In basket: {zone} · {price} LMD.',
    seatingPlanSummary: 'View Stage and Zone Diagram',
    seatingPlanAria: 'Stage and seating zones for {title}',
    stageDirection: 'STAGE',
    seatingLevelLabel: 'Level {level}',
    seatingPlanNotice:
      'Zone diagram only, not individual seat selection. The diagram and selector use the same prices.',
    selectSeatingZone: 'Select {zone}, base price {price} LMD',
    receiptEyebrow: 'SIMULATED RECEIPT',
    receiptTitle: 'Seat Registration Receipt',
    receiptCopy:
      'This request is confirmed. The amounts and seats below belong only to this simulated experience.',
    baseTotal: 'Base Total',
    adjustmentNone: 'None',
    settledTotal: 'Simulated Settlement Total',
    disclaimer: 'Game content only. This receipt creates no redemption obligation.',
    ticketNumber: 'Ticket number {number}',
    downloadSvg: 'Download SVG',
    printTicket: 'Print This Ticket',
    standardChannel: 'STANDARD CHANNEL',
    priorityChannel: 'PRIORITY CHANNEL',
    standardAttemptTitle: 'Ticketing traffic is currently heavy',
    standardAttemptCopy:
      'The system asks you to confirm every performance in your basket. Availability may change after submission.',
    premiumAttemptTitle: 'The priority channel is searching again',
    premiumAttemptCopy:
      'The channel claims to improve your queue position and adds a service adjustment on success. It may still fail.',
    submitRequest: 'Confirm and Submit',
    backToBasket: 'Back to Basket',
    networkTitle: 'The network stopped responding before confirmation',
    networkCopy:
      'No settlement was created and your basket remains intact. Retry on the same route.',
    retryBasket: 'Keep Basket and Retry',
    premiumFailureTitle: 'The priority channel still found no seats',
    premiumFailureCopy:
      'The channel found no seats but issued a simulated search-service record. Your basket and base prices remain unchanged.',
    premiumOfferTitle: 'The Joint Seat Return Channel offers another search',
    premiumOfferCopy:
      'The channel will remark your request order and add a service adjustment equal to 50% of the basket base total on success. It cannot guarantee a seat.',
    retentionOfferTitle: 'One final quote before you leave',
    retentionOfferCopy:
      'The service adjustment has moved from 50% to 48%. This is the only retention quote in this round, and accepting it still cannot guarantee a seat.',
    standardFailureTitle: 'Heavy traffic: ticket request failed',
    standardFailureCopy:
      'Keep the basket and submit again, or try the priority route that adds a charge on success.',
    retryStandard: 'Retry Standard Route',
    tryPremium: 'Review Seat Return Quote',
    acceptPremium: 'Accept 150% Quote and Search Again',
    declinePremium: 'Decline This Quote',
    acceptRetention: 'Accept the 148% Retention Quote',
    declineRetention: 'Still Decline and Return to Basket',
    retryPremium: 'Retry Priority Route',
    returnStandard: 'Cancel Markup and Return to Standard',
    offerBaseTotal: 'Basket Base Total',
    offerAdjustment: 'Simulated Service Adjustment',
    offerFinalTotal: 'Current Simulated Quote',
    failureRecordTitle: 'Failed Service Record',
    allocatedSeats: 'Seats Allocated',
    failureServiceFee: 'Simulated Search-Service Fee',
    failureRecordDisclaimer:
      'No real charge occurred. This record creates no receipt, commemorative ticket, or redemption obligation.',
    startRequired: 'Select at least one performance first.',
    submitted: 'Basket submitted. Entering the simulated ticketing flow.',
    success: 'Ticketing succeeded. Your commemorative tickets are ready.',
    stateUpdated: 'The ticketing state has been updated.',
    downloadStarted: 'The download for {title} has started.',
    newRound: 'The previous round has ended. You may select performances again.',
    adjustments: {
      'priority-service': 'Priority Route Service Adjustment',
      'retention-service': 'Retention Quote Service Adjustment',
    },
    stamps: {
      'admission-confirmed': 'ADMISSION CONFIRMED',
      'standard-route': 'STANDARD ROUTE',
      'priority-route': 'PRIORITY ROUTE',
      'network-recovered': 'NETWORK RECOVERED',
      'returned-seat': 'RETURNED SEAT',
      'retention-offer': 'RETENTION QUOTE',
      'manual-review': 'MANUAL REVIEW',
    },
    artifact: {
      title: '{title} Commemorative Ticket',
      description: '{dateTime}, {place}, {zone}, {price} LMD, ticket number {number}',
      header: 'CRIMSON TROUPE · COMMEMORATIVE ADMISSION',
      dateTime: 'TERRA DATE AND TIME',
      zone: 'ZONE',
      faceValue: 'BASE FACE VALUE',
      ticketNumber: 'TICKET NUMBER',
      alt: '{title} commemorative ticket: {dateTime}, {place}, {zone}, {price} LMD, ticket and matrix number {number}',
    },
  },
  programs: {
    archiveRegister: 'Touring Register No. {index}',
    productionCount: '{count} productions',
  },
} as const satisfies LocalizedShape<typeof yanMessages>;
