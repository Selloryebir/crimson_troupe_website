import { query, queryAll } from './dom';

export interface NavigationController {
  closeMenu: () => void;
}

export function initNavigation(): NavigationController {
  const body = document.body;
  const menuButton = query<HTMLButtonElement>('.menu-button');
  const menuLabel = query<HTMLElement>('.sr-only', menuButton);
  const mainNav = query<HTMLElement>('.main-nav');

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuLabel.textContent = '打开导航';
    mainNav.classList.remove('is-open');
    body.classList.remove('is-locked');
  };

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? '关闭导航' : '打开导航';
    mainNav.classList.toggle('is-open', open);
    body.classList.toggle('is-locked', open);
  });

  queryAll<HTMLAnchorElement>('a', mainNav).forEach((link) =>
    link.addEventListener('click', closeMenu),
  );
  query<HTMLButtonElement>('.nav-ticket').addEventListener('click', closeMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  return { closeMenu };
}
