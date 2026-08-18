export function initForms() {
  document.querySelector('[data-ticket-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button[type="submit"]');
    const note = event.currentTarget.querySelector('[data-ticket-note]');
    button.innerHTML = '预约已登记 <span>✓</span>';
    button.disabled = true;
    note.textContent = '确认函已交由信使。感谢您对舞台的耐心。';
  });

  document.querySelector('[data-newsletter-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const note = document.querySelector('[data-form-note]');
    form.querySelector('button').innerHTML = '已订阅 <span>✓</span>';
    form.querySelector('input').disabled = true;
    note.textContent = '您的地址已写入下一封信。';
  });
}
