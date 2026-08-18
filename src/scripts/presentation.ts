import { query, queryAll } from './dom';
import { reducedMotion } from './world';

function initReveals() {
  const revealItems = queryAll<HTMLElement>('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.13 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
}

function initParallax() {
  const stage = document.querySelector<HTMLElement>('[data-parallax]');
  if (!stage || reducedMotion || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  stage.addEventListener('pointermove', (event) => {
    const bounds = stage.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
    stage.style.setProperty('--parallax-x', `${x}px`);
    stage.style.setProperty('--parallax-y', `${y}px`);
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--parallax-x', '0px');
    stage.style.setProperty('--parallax-y', '0px');
  });
}

function initClock() {
  const clock = query<HTMLElement>('[data-terra-clock]');
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const updateClock = () => {
    clock.textContent = `TRIMOUNT ${formatter.format(new Date())}`;
  };

  updateClock();
  window.setInterval(updateClock, 1000);
}

export function initPresentation() {
  initReveals();
  initParallax();
  initClock();
}
