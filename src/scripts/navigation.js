export function initNavigation() {
  const body = document.body;
  const menuButton = document.querySelector('.menu-button');
  const mainNav = document.querySelector('.main-nav');

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    body.classList.remove('is-locked');
  };

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    mainNav.classList.toggle('is-open', open);
    body.classList.toggle('is-locked', open);
  });

  mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.querySelector('.nav-ticket').addEventListener('click', closeMenu);

  return { closeMenu };
}
