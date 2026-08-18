import { query, queryAll } from './dom';

function completeConceptInteraction(button: HTMLButtonElement, label: string) {
  const checkmark = document.createElement('span');
  checkmark.textContent = '✓';
  checkmark.setAttribute('aria-hidden', 'true');
  button.replaceChildren(label, ' ', checkmark);
  button.disabled = true;
}

function requiredFieldsAreValid(root: ParentNode) {
  return queryAll<HTMLInputElement>('input[required]', root).every((input) =>
    input.reportValidity(),
  );
}

function clearInputs(root: ParentNode) {
  queryAll<HTMLInputElement>('input', root).forEach((input) => {
    input.value = '';
  });
}

export function initForms() {
  const ticketGroup = query<HTMLElement>('[data-ticket-form]');
  const ticketButton = query<HTMLButtonElement>('button', ticketGroup);
  ticketButton.addEventListener('click', () => {
    if (!requiredFieldsAreValid(ticketGroup)) {
      return;
    }
    const note = query<HTMLElement>('[data-ticket-note]', ticketGroup);
    clearInputs(ticketGroup);
    const showSelect = query<HTMLSelectElement>('select[name="show"]', ticketGroup);
    showSelect.selectedIndex = 0;
    completeConceptInteraction(ticketButton, '演示已完成');
    note.textContent = '概念交互已完成；姓名、信使地址和预约信息均未发送或保存。';
  });

  const newsletterGroup = query<HTMLElement>('[data-newsletter-form]');
  const newsletterButton = query<HTMLButtonElement>('button', newsletterGroup);
  newsletterButton.addEventListener('click', () => {
    if (!requiredFieldsAreValid(newsletterGroup)) {
      return;
    }
    clearInputs(newsletterGroup);
    completeConceptInteraction(newsletterButton, '演示已完成');
    query<HTMLInputElement>('input', newsletterGroup).disabled = true;
    query<HTMLElement>('[data-form-note]').textContent = '概念交互已完成；信使地址未发送或保存。';
  });
}
