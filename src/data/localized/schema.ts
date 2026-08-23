import type { ArchivePollutionProfile } from '../archive-pollution.ts';
import type { LocationId } from '../locations';
import type { PerformanceId, TicketZone } from '../performances';
import type { ProductionId } from '../productions/index.ts';

export type LocalizedShape<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly LocalizedShape<Item>[]
    : T extends object
      ? { readonly [Key in keyof T]: LocalizedShape<T[Key]> }
      : T;

export interface LocalizedRecord<T> {
  value: T;
  sourceLocale: string;
  usedFallback: boolean;
}

export interface LocationContent {
  cityLabel: string;
}

export interface PerformanceContent {
  index: string;
  dateTimeDisplay: string;
  venue: string;
  searchDetail: string;
  searchKeywords: string;
  previousDateTimeDisplay?: string;
  operationalNotice?: {
    sourceRevision: string;
    text: string;
  };
}

export interface ProductionContent {
  title: string;
  kind: string;
  tagline: string;
  duration: string;
  durationShort: string;
  language: string;
  heading: string;
  synopsis: string;
  guidance: string;
  creatives: readonly (readonly [role: string, name: string])[];
}

export interface ProgramContentBase {
  locations: Record<LocationId, LocationContent>;
  performances: Record<PerformanceId, PerformanceContent>;
  ticketZones: Record<TicketZone, string>;
}

export interface ProgramContent extends ProgramContentBase {
  productions: Record<ProductionId, ProductionContent>;
}

export interface AuthoringProgramContent {
  locations?: Partial<Record<LocationId, LocationContent>>;
  performances?: Partial<Record<PerformanceId, PerformanceContent>>;
  productions?: Partial<Record<ProductionId, ProductionContent>>;
  ticketZones?: Partial<Record<TicketZone, string>>;
}

export interface LocalizationAuthoringPackage<SiteContent, MessageContent> {
  site?: Partial<SiteContent>;
  programs?: AuthoringProgramContent;
  messages?: Partial<MessageContent>;
  archiveProjection?: ArchiveProjectionContent;
}

export interface LocalizationPackage<SiteContent, MessageContent> {
  site: SiteContent;
  programs: ProgramContent;
  messages: MessageContent;
  archiveProjection: ArchiveProjectionContent;
}

export interface ArchiveProjectionView {
  eyebrow: string;
  title: string;
  summary: string;
}

export interface ArchiveProjectionContent {
  statusAnnouncement: string;
  ariaLabel: string;
  roleLabel: string;
  productionLabel: string;
  venueLabel: string;
  attendanceLabel: string;
  role: string;
  production: string;
  venue: string;
  attendance: string;
  closing: string;
  views: Record<ArchivePollutionProfile, ArchiveProjectionView>;
}

export interface SearchMessages {
  label: string;
  submit: string;
  scope: string;
  unavailable: string;
  prompt: string;
  resultCount: string;
  noResults: string;
  noscriptTitle: string;
  noscriptCopy: string;
}

export interface FilterMessages {
  city: string;
  allCities: string;
  month: string;
  allMonths: string;
  monthOption: string;
  reset: string;
  count: string;
  empty: string;
}

export type TicketStampId =
  | 'admission-confirmed'
  | 'standard-route'
  | 'priority-route'
  | 'network-recovered'
  | 'returned-seat'
  | 'retention-offer'
  | 'manual-review';
export type TicketAdjustmentId = 'priority-service' | 'retention-service';

export interface TicketArtifactMessages {
  title: string;
  description: string;
  header: string;
  dateTime: string;
  zone: string;
  faceValue: string;
  ticketNumber: string;
  alt: string;
}

export interface TicketingMessages {
  selectedCount: string;
  emptyBasket: string;
  selectionReady: string;
  selectionRequired: string;
  zonePreview: string;
  zoneInBasket: string;
  seatingPlanSummary: string;
  seatingPlanAria: string;
  stageDirection: string;
  seatingLevelLabel: string;
  seatingPlanNotice: string;
  selectSeatingZone: string;
  receiptEyebrow: string;
  receiptTitle: string;
  receiptCopy: string;
  baseTotal: string;
  adjustmentNone: string;
  settledTotal: string;
  disclaimer: string;
  ticketNumber: string;
  downloadSvg: string;
  printTicket: string;
  standardChannel: string;
  priorityChannel: string;
  standardAttemptTitle: string;
  standardAttemptCopy: string;
  premiumAttemptTitle: string;
  premiumAttemptCopy: string;
  submitRequest: string;
  backToBasket: string;
  networkTitle: string;
  networkCopy: string;
  retryBasket: string;
  premiumFailureTitle: string;
  premiumFailureCopy: string;
  premiumOfferTitle: string;
  premiumOfferCopy: string;
  retentionOfferTitle: string;
  retentionOfferCopy: string;
  standardFailureTitle: string;
  standardFailureCopy: string;
  retryStandard: string;
  tryPremium: string;
  acceptPremium: string;
  declinePremium: string;
  acceptRetention: string;
  declineRetention: string;
  retryPremium: string;
  returnStandard: string;
  offerBaseTotal: string;
  offerAdjustment: string;
  offerFinalTotal: string;
  failureRecordTitle: string;
  allocatedSeats: string;
  failureServiceFee: string;
  failureRecordDisclaimer: string;
  startRequired: string;
  submitted: string;
  success: string;
  stateUpdated: string;
  downloadStarted: string;
  newRound: string;
  adjustments: Record<TicketAdjustmentId, string>;
  stamps: Record<TicketStampId, string>;
  artifact: TicketArtifactMessages;
}
