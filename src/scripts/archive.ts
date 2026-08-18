import { archiveRecords, isArchiveRecordId } from '../data/archive-records';
import { query, queryAll } from './dom';

export function initArchive() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transcriptPanel = query<HTMLElement>('[data-transcript]');
  const toast = query<HTMLElement>('[data-invitation-toast]');
  const recordCards = queryAll<HTMLButtonElement>('[data-record]');

  const showInvitationToast = () => {
    toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
  };

  recordCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (!isArchiveRecordId(card.dataset.record)) {
        return;
      }
      const record = archiveRecords[card.dataset.record];
      recordCards.forEach((item) => item.setAttribute('aria-expanded', 'false'));
      card.setAttribute('aria-expanded', 'true');
      query<HTMLElement>('[data-transcript-code]', transcriptPanel).textContent = record.code;
      query<HTMLElement>('[data-transcript-text]', transcriptPanel).textContent = record.text;
      transcriptPanel.classList.add('is-open');
    });
  });

  query<HTMLButtonElement>('[data-close-transcript]').addEventListener('click', () => {
    transcriptPanel.classList.remove('is-open');
    recordCards.forEach((item) => item.setAttribute('aria-expanded', 'false'));
  });

  query<HTMLButtonElement>('[data-accept-invitation]').addEventListener('click', () => {
    query<HTMLElement>('#recovered').scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
    showInvitationToast();
  });

  const finalButton = query<HTMLButtonElement>('[data-accept-final]');
  finalButton.addEventListener('click', () => {
    finalButton.textContent = '你的名字已经在这里了';
    finalButton.disabled = true;
    query<HTMLElement>('[data-final-note]').textContent = '请不要离开座位。演出即将重新开始。';
    showInvitationToast();
  });
}
