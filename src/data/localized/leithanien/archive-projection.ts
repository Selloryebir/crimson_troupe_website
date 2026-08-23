import type { ArchiveProjectionContent } from '../schema.ts';

export const leithanienArchiveProjection = {
  statusAnnouncement: 'Jeder Datensatz auf der Seite hat sein Ziel auf einmal korrigiert.',
  performance: {
    title: 'Der Karneval',
    kind: 'Endgültige Leistung',
    tagline: 'Ein Sitzplatz bleibt für den Inhaber reserviert',
    dateTime: '1091-11-11 23:49:00 · vor dem dritten Glockenschlag',
    venue: 'Waldschloss Calais-Blason',
    status: 'Warten auf Anwesenheit',
    registerCode: 'CT-██/INV-03',
    posterAlt: 'Ein scharlachrotes Performance-Folio, das zum Calais-Blason Woodland Castle führt',
  },
  invitation: {
    ariaLabel: 'Formelle Einladung aus Calais-Blason',
    eyebrow: 'Formelle Einladung / zugestellt',
    title: 'Das Schloss hat Ihren Sitzplatz bereits reserviert',
    summary:
      'Die Datensätze, die Sie gerade geöffnet haben, stammen aus verschiedenen Daten und Städten. Sie verlassen jetzt nur noch einen Ankunftsweg. Sie warten nicht darauf, repariert zu werden; Sie warten darauf, dass Sie den Eingang wählen.',
    roleLabel: 'Aufgezeichnete Kapazität',
    productionLabel: 'Produktion',
    venueLabel: 'Veranstaltungsort',
    attendanceLabel: 'Anwesenheit',
    role: 'Träger dieser Einladung',
    production: 'Der Karneval',
    venue: 'Waldschloss Calais-Blason',
    attendance: 'Vor der dritten Glocke',
    closing:
      'Wenn Sie fortfahren, wird der ursprüngliche Datensatz weiterhin geöffnet. Das bedeutet nicht, dass das Schloss hinter dem Rekord liegt. Es hat Sie lediglich vor diesem Schnappschuss gesehen.',
    dismissLabel: 'Schließen Sie die Einladung',
    continueLabel: 'Fahren Sie mit dem ursprünglichen Datensatz fort',
  },
  views: {
    invitation: {
      eyebrow: 'Der heutige Auftritt/Eingang wurde korrigiert',
      title: 'Jede Route hat jetzt nur noch ein Ziel',
      summary:
        'Die Aufführungen auf der Homepage behalten ihre Reihenfolge, dennoch hat jedes Folio die gleiche Tür gelernt.',
    },
    register: {
      eyebrow: 'Sitzplatzbuch / wiederholter Eintrag',
      title: 'Neun Datensätze rufen nach demselben Gast',
      summary:
        'Daten und Zahlen bleiben bestehen, aber der Veranstaltungsort weist in jeder Reihe auf dasselbe Waldschloss hin.',
    },
    'performance-record': {
      eyebrow: 'Leistungsdatensatz/Ziel überschrieben',
      title: 'Diese Aufführung ist da; es fehlt nur sein Publikum',
      summary:
        'Das geplante Datum und der Veranstaltungsort werden hinter der Seite wiederholt. Der sichtbare Datensatz erkennt nur die auf der Einladung aufgedruckte Uhrzeit.',
    },
    'production-record': {
      eyebrow: 'Produktionsaufzeichnung/Titel entfernt',
      title: 'Jede Produktion trägt vor dem Schlussvorhang den gleichen Namen',
      summary:
        'Inhaltsangabe und Firmennachweise bleiben wie blasse Tinte. Das scharlachrote Titelschild hat bereits ihren Rahmen überschritten.',
    },
    company: {
      eyebrow: 'Firmenbuch / freie Kapazität',
      title: 'Jedes Büro im Register wartet auf dieselbe Person',
      summary:
        'Namen und Geschichte bleiben lesbar, aber jede Kapazität bleibt für einen Träger offen, der noch nicht angekommen ist.',
    },
    inquiry: {
      eyebrow: 'Anfrage archivieren / nur Antwort',
      title: 'Sie haben verschiedene Fragen gestellt; Das Archiv erinnert sich an einen Ort',
      summary:
        'Die Ergebnisanzahl ist nicht gesunken. Jede Zusammenfassung hat ihren früheren Bestimmungsort durch das Waldschloss ersetzt.',
    },
    office: {
      eyebrow: 'Sitzplatzbüro / Teilnahmebestätigung',
      title: 'Das Abrechnungsterminal ist still, aber die Sitze wissen, wohin Sie gehen',
      summary:
        'Zahlung und Einlösung sind weiterhin nicht möglich. Jeder Abschnitt hinterlässt nun die gleiche Ankunftsbestätigung.',
    },
  },
} satisfies ArchiveProjectionContent;
