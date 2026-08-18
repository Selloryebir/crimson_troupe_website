const transcripts = {
  '01': {
    code: 'RECORD 091–01 / AUDIO TRANSCRIPT',
    text: '我听见掌声从空座位里升起来。不是一双手，是许多双。指挥叫我们继续，可那一晚，台上根本没有指挥。',
  },
  '02': {
    code: 'RECORD 091–17 / PHOTOGRAPH NOTE',
    text: '我们反复清点了底片。快门按下时台上只有十二个人。第十三个人站在最中间，而且看着镜头。',
  },
  '03': {
    code: 'RECORD 091–██ / MANUSCRIPT',
    text: '最后一句台词不是写给演员的。它要由观众念出。请翻到节目单背面——如果那里已经出现了你的名字，就不要出声。',
  },
};

export function initArchive() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transcriptPanel = document.querySelector('[data-transcript]');
  const toast = document.querySelector('[data-invitation-toast]');

  const showInvitationToast = () => {
    toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
  };

  document.querySelectorAll('[data-record]').forEach((card) => {
    card.addEventListener('click', () => {
      const record = transcripts[card.dataset.record];
      document.querySelectorAll('[data-record]').forEach((item) => item.setAttribute('aria-expanded', 'false'));
      card.setAttribute('aria-expanded', 'true');
      transcriptPanel.querySelector('[data-transcript-code]').textContent = record.code;
      transcriptPanel.querySelector('[data-transcript-text]').textContent = record.text;
      transcriptPanel.classList.add('is-open');
    });
  });

  document.querySelector('[data-close-transcript]').addEventListener('click', () => {
    transcriptPanel.classList.remove('is-open');
    document.querySelectorAll('[data-record]').forEach((item) => item.setAttribute('aria-expanded', 'false'));
  });

  document.querySelector('[data-accept-invitation]').addEventListener('click', () => {
    document.querySelector('#recovered').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    showInvitationToast();
  });

  document.querySelector('[data-accept-final]').addEventListener('click', (event) => {
    event.currentTarget.textContent = '你的名字已经在这里了';
    event.currentTarget.disabled = true;
    document.querySelector('[data-final-note]').textContent = '请不要离开座位。演出即将重新开始。';
    showInvitationToast();
  });
}
