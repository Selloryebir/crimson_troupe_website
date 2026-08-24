const TRIGGER_SELECTOR = '[data-archive-invitation-trigger]';
const LEVEL_THREE = '3';

function isPlainActivation(event: MouseEvent, trigger: HTMLElement): boolean {
  const anchor = trigger instanceof HTMLAnchorElement ? trigger : null;
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    (!anchor?.target || anchor.target === '_self') &&
    !anchor?.hasAttribute('download')
  );
}

export function initArchiveInvitation(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-archive-invitation]');
  if (!dialog || dialog.dataset.invitationReady === 'true') {
    return;
  }
  dialog.dataset.invitationReady = 'true';

  const closeButtons = dialog.querySelectorAll<HTMLButtonElement>(
    '[data-archive-invitation-close]',
  );
  const continueButton = dialog.querySelector<HTMLButtonElement>(
    '[data-archive-invitation-continue]',
  );
  let activeTrigger: HTMLElement | null = null;
  let bypassTrigger: HTMLElement | null = null;

  const closeInvitation = (): void => {
    if (dialog.open) {
      dialog.close();
    }
  };

  document.addEventListener(
    'click',
    (event) => {
      if (
        !(event instanceof MouseEvent) ||
        document.documentElement.dataset.pollutionLevel !== LEVEL_THREE
      ) {
        return;
      }
      const trigger =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(TRIGGER_SELECTOR)
          : null;
      if (!trigger || trigger === bypassTrigger || !isPlainActivation(event, trigger)) {
        if (trigger === bypassTrigger) {
          bypassTrigger = null;
        }
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      activeTrigger = trigger;
      continueButton?.toggleAttribute(
        'hidden',
        !(trigger instanceof HTMLAnchorElement || trigger.dataset.archiveInvitationHref),
      );
      if (!dialog.open) {
        dialog.showModal();
      }
      closeButtons[0]?.focus();
    },
    { capture: true },
  );

  closeButtons.forEach((button) => button.addEventListener('click', closeInvitation));
  dialog.addEventListener('close', () => {
    activeTrigger?.focus({ preventScroll: true });
  });

  continueButton?.addEventListener('click', () => {
    const trigger = activeTrigger;
    if (!trigger) {
      closeInvitation();
      return;
    }
    if (trigger instanceof HTMLAnchorElement) {
      bypassTrigger = trigger;
      closeInvitation();
      trigger.click();
      return;
    }
    const href = trigger.dataset.archiveInvitationHref;
    closeInvitation();
    if (href) {
      window.location.assign(href);
    }
  });
}
