const root = document.documentElement;
const body = document.body;
const frontPanel = document.querySelector('[data-world-panel="front"]');
const archivePanel = document.querySelector('[data-world-panel="archive"]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

function setPanelAccessibility(world) {
  const isArchive = world === 'archive';
  frontPanel.setAttribute('aria-hidden', String(isArchive));
  archivePanel.setAttribute('aria-hidden', String(!isArchive));
}

async function switchWorld(world, options = {}) {
  if (root.dataset.world === world) return;

  body.classList.add('is-crossing', 'is-locked');
  if (!reducedMotion) await wait(620);

  root.dataset.world = world;
  setPanelAccessibility(world);
  document.querySelector('meta[name="theme-color"]').content = world === 'archive' ? '#0b0808' : '#eee9df';
  document.title = world === 'archive' ? '档案 091｜不要回头' : '猩红剧团｜Crimson Troupe';
  const cleanUrl = window.location.href.split('#')[0];
  history.replaceState(null, '', world === 'archive' ? `${cleanUrl}#archive-091` : cleanUrl);
  window.scrollTo({ top: 0, behavior: 'auto' });

  await wait(reducedMotion ? 10 : 440);
  body.classList.remove('is-crossing', 'is-locked');

  const focusTarget = world === 'archive'
    ? document.querySelector('.archive-exit')
    : document.querySelector('.brand');
  if (!options.skipFocus) focusTarget?.focus({ preventScroll: true });
}

document.querySelectorAll('[data-enter-archive]').forEach((button) => {
  button.addEventListener('click', () => switchWorld('archive'));
});

document.querySelectorAll('[data-exit-archive]').forEach((button) => {
  button.addEventListener('click', () => switchWorld('front'));
});

if (window.location.hash === '#archive-091') {
  root.dataset.world = 'archive';
  setPanelAccessibility('archive');
  document.title = '档案 091｜不要回头';
  document.querySelector('meta[name="theme-color"]').content = '#0b0808';
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.13 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('.main-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mainNav.classList.remove('is-open');
  body.classList.remove('is-locked');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  mainNav.classList.toggle('is-open', open);
  body.classList.toggle('is-locked', open);
});

mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.querySelector('.nav-ticket').addEventListener('click', closeMenu);

const monthButtons = [...document.querySelectorAll('[data-month-filter]')];
const cityFilter = document.querySelector('[data-city-filter]');
const programs = [...document.querySelectorAll('[data-program]')];
const filterResult = document.querySelector('[data-filter-result]');
const programEmpty = document.querySelector('[data-program-empty]');
let activeMonth = 'all';

function applyProgramFilters() {
  let visible = 0;
  programs.forEach((program) => {
    const matchesMonth = activeMonth === 'all' || program.dataset.month === activeMonth;
    const matchesCity = cityFilter.value === 'all' || program.dataset.city === cityFilter.value;
    const matches = matchesMonth && matchesCity;
    program.hidden = !matches;
    if (matches) visible += 1;
  });
  filterResult.textContent = `${visible} 场演出`;
  programEmpty.hidden = visible !== 0;
}

monthButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeMonth = button.dataset.monthFilter;
    monthButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    applyProgramFilters();
  });
});

cityFilter.addEventListener('change', applyProgramFilters);
document.querySelector('[data-clear-filters]').addEventListener('click', () => {
  activeMonth = 'all';
  cityFilter.value = 'all';
  monthButtons.forEach((button) => {
    const active = button.dataset.monthFilter === 'all';
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  applyProgramFilters();
});

const stage = document.querySelector('[data-parallax]');
if (stage && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
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

function updateClock() {
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const clock = document.querySelector('[data-terra-clock]');
  if (clock) clock.textContent = `TRIMOUNT ${formatter.format(new Date())}`;
}

updateClock();
window.setInterval(updateClock, 1000);

function bindDialog(dialogSelector, openSelector, closeSelector) {
  const dialog = document.querySelector(dialogSelector);
  if (!dialog) return;

  document.querySelectorAll(openSelector).forEach((button) => {
    button.addEventListener('click', () => dialog.showModal());
  });
  dialog.querySelector(closeSelector)?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

bindDialog('[data-ticket-dialog]', '[data-open-ticket]', '[data-close-ticket]');
bindDialog('[data-film-dialog]', '[data-open-film]', '[data-close-film]');

const shows = {
  uncrowned: {
    index: '01',
    theme: 'uncrowned',
    title: '《无冕之夜》',
    kind: '现代悲剧 · 三幕',
    tagline: '王冠落地以后，谁来证明国王曾经存在？',
    date: '1098.09.17 / 19:30',
    place: '特里蒙大剧院 · 主舞台',
    duration: '125 分钟，含一次幕间',
    language: '维多利亚语演出 · 中文投影字幕',
    heading: '一场关于权力、记忆与见证者的现代悲剧。',
    synopsis: '一座移动城市在庆典翌日醒来，却没有人记得昨夜加冕的王。唯一仍坚持演出仪式的报幕人，开始从观众的梦里寻找那顶不存在的王冠。',
    guidance: '建议 12 岁以上观众观看。演出包含短暂强光、舞台烟雾与模拟钟声。',
    creatives: [['导演', '洛伦斯·格雷'], ['文本', '艾达·温特'], ['舞台设计', '米拉·塞恩'], ['音乐', '剧团室内乐组']],
  },
  'caged-fire': {
    index: '02',
    theme: 'caged-fire',
    title: '《笼中火》',
    kind: '室内歌剧 · 两幕',
    tagline: '火焰不能离开笼子，歌声却可以。',
    date: '1098.10.03 / 20:00',
    place: '维谢海姆宫廷剧院 · 镜厅',
    duration: '90 分钟，无幕间休息',
    language: '莱塔尼亚语演唱 · 中维双语字幕',
    heading: '写给一座沉默高塔的室内歌剧。',
    synopsis: '守塔人被要求照看一簇永远不能熄灭、也永远不能带出高塔的火。他用七年学会火焰的语言，却在获准离开的那天听见它唱出了自己的名字。',
    guidance: '建议 10 岁以上观众观看。演出使用舞台明火效果、低频音响与持续约 40 秒的黑暗场景。',
    creatives: [['作曲', '伊莱亚斯·克莱因'], ['导演', '萨宾娜·沃尔夫'], ['舞台设计', '奥托·赫兹'], ['首席女高音', '塞西莉亚·莱恩']],
  },
  'second-snow': {
    index: '03',
    theme: 'second-snow',
    title: '《第二次雪》',
    kind: '实验舞剧 · 无幕',
    tagline: '第一次雪覆盖道路，第二次雪覆盖记忆。',
    date: '1098.10.29 / 18:45',
    place: '诺伯特郡旧车站 · 临时舞台',
    duration: '70 分钟，无幕间休息',
    language: '无对白 · 提供文字导赏册',
    heading: '身体、白噪声与一座失温城市的共同记忆。',
    synopsis: '六名舞者沿着已经停运的轨道，重复一段没有终点的归乡旅程。每次雪落，他们都会少记得一个地名，也会多出一位同行者。',
    guidance: '建议 12 岁以上观众观看。现场温度较低，包含频闪、白噪声与模拟降雪；可索取无频闪场次信息。',
    creatives: [['编舞', '诺亚·芬奇'], ['音乐', '白原三重奏'], ['灯光设计', '露西·巴赫'], ['装置', '诺伯特工坊']],
  },
};

const showDialog = document.querySelector('[data-show-dialog]');
const showHero = showDialog.querySelector('.show-dialog__hero');
let currentShow = 'uncrowned';

function openShow(showId) {
  const show = shows[showId];
  if (!show) return;
  currentShow = showId;
  showHero.dataset.showTheme = show.theme;
  showHero.dataset.index = show.index;
  showDialog.querySelector('[data-show-kind]').textContent = show.kind;
  showDialog.querySelector('[data-show-title]').textContent = show.title;
  showDialog.querySelector('[data-show-tagline]').textContent = show.tagline;
  showDialog.querySelector('[data-show-date]').textContent = show.date;
  showDialog.querySelector('[data-show-place]').textContent = show.place;
  showDialog.querySelector('[data-show-duration]').textContent = show.duration;
  showDialog.querySelector('[data-show-language]').textContent = show.language;
  showDialog.querySelector('[data-show-heading]').textContent = show.heading;
  showDialog.querySelector('[data-show-synopsis]').textContent = show.synopsis;
  showDialog.querySelector('[data-show-guidance]').textContent = show.guidance;
  showDialog.querySelector('[data-show-creatives]').innerHTML = show.creatives
    .map(([role, name]) => `<div><dt>${role}</dt><dd>${name}</dd></div>`)
    .join('');
  showDialog.showModal();
  showDialog.scrollTop = 0;
}

document.querySelectorAll('[data-open-show]').forEach((button) => {
  button.addEventListener('click', () => openShow(button.dataset.openShow));
});
showDialog.querySelector('[data-close-show]').addEventListener('click', () => showDialog.close());
showDialog.addEventListener('click', (event) => {
  if (event.target === showDialog) showDialog.close();
});

showDialog.querySelector('[data-show-ticket]').addEventListener('click', () => {
  const ticketDialog = document.querySelector('[data-ticket-dialog]');
  const showSelect = ticketDialog.querySelector('select[name="show"]');
  showSelect.value = shows[currentShow].title;
  showDialog.close();
  window.setTimeout(() => ticketDialog.showModal(), 80);
});

const searchDialog = document.querySelector('[data-search-dialog]');
const searchInput = searchDialog.querySelector('[data-search-input]');
const searchResults = searchDialog.querySelector('[data-search-results]');
const searchIndex = [
  { category: '本季演出', title: '《无冕之夜》', detail: '9月17日 · 特里蒙 · 现代悲剧', keywords: '九月 9月 特里蒙 悲剧 王冠', action: 'show', value: 'uncrowned' },
  { category: '本季演出', title: '《笼中火》', detail: '10月3日 · 维谢海姆 · 室内歌剧', keywords: '十月 10月 维谢海姆 歌剧 火', action: 'show', value: 'caged-fire' },
  { category: '本季演出', title: '《第二次雪》', detail: '10月29日 · 诺伯特郡 · 实验舞剧', keywords: '十月 10月 诺伯特 舞剧 雪', action: 'show', value: 'second-snow' },
  { category: '观演服务', title: '无障碍观演服务', detail: '无阶梯席位、辅助听觉与字幕投影', keywords: '无障碍 字幕 听觉 轮椅 服务', action: 'target', value: '#experience' },
  { category: '剧团', title: '新猩红剧团的故事', detail: '演员、作曲家与技术人员共同组成的巡演团体', keywords: '剧团历史 关于 新剧团 艺术家', action: 'target', value: '#company' },
  { category: '手记', title: '一座空剧场，如何成为另一座城市', detail: '幕后 · 舞台与城市', keywords: '手记 幕后 剧场 城市', action: 'target', value: '#journal' },
  { category: '馆藏记录', title: 'CT–091–██', detail: '该记录不在公开馆藏中', keywords: '091 旧剧团 失踪 档案 archive', action: 'archive', value: 'archive' },
];
let activeSearchResult = -1;
let currentResults = [];

function normalizeSearch(value) {
  return value.toLowerCase().trim().replaceAll('《', '').replaceAll('》', '');
}

function renderSearchResults(query) {
  const normalized = normalizeSearch(query);
  if (!normalized) {
    currentResults = [];
    activeSearchResult = -1;
    searchResults.innerHTML = '<p class="search-results__label">输入关键词开始搜索</p><div class="search-results__hint"><span>CT</span><p>演出、巡演城市、艺术家和剧团手记都可以在这里找到。</p></div>';
    return;
  }
  currentResults = searchIndex.filter((item) => normalizeSearch(`${item.title} ${item.detail} ${item.keywords}`).includes(normalized));
  activeSearchResult = currentResults.length ? 0 : -1;
  searchResults.innerHTML = `<p class="search-results__label">找到 ${currentResults.length} 条结果</p>${currentResults.length
    ? currentResults.map((item, index) => `<button class="search-result${index === 0 ? ' is-active' : ''}" type="button" data-search-result="${index}"><span>${item.category}</span><span><strong>${item.title}</strong><small>${item.detail}</small></span><i>↗</i></button>`).join('')
    : '<div class="search-results__hint"><span>∅</span><p>没有公开记录。请检查关键词，或尝试搜索日期与城市。</p></div>'}`;
}

function runSearchResult(index) {
  const item = currentResults[index];
  if (!item) return;
  searchDialog.close();
  if (item.action === 'show') {
    window.setTimeout(() => openShow(item.value), 80);
  } else if (item.action === 'archive') {
    switchWorld('archive');
  } else {
    document.querySelector(item.value)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}

function updateActiveSearchResult(direction) {
  if (!currentResults.length) return;
  activeSearchResult = (activeSearchResult + direction + currentResults.length) % currentResults.length;
  searchDialog.querySelectorAll('[data-search-result]').forEach((button, index) => {
    button.classList.toggle('is-active', index === activeSearchResult);
  });
}

document.querySelectorAll('[data-open-search]').forEach((button) => {
  button.addEventListener('click', () => {
    closeMenu();
    searchDialog.showModal();
    window.setTimeout(() => searchInput.focus(), 50);
  });
});
searchDialog.querySelector('[data-close-search]').addEventListener('click', () => searchDialog.close());
searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));
searchDialog.querySelectorAll('[data-search-query]').forEach((button) => {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.searchQuery;
    renderSearchResults(searchInput.value);
    searchInput.focus();
  });
});
searchResults.addEventListener('click', (event) => {
  const result = event.target.closest('[data-search-result]');
  if (result) runSearchResult(Number(result.dataset.searchResult));
});
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') { event.preventDefault(); updateActiveSearchResult(1); }
  if (event.key === 'ArrowUp') { event.preventDefault(); updateActiveSearchResult(-1); }
  if (event.key === 'Enter') { event.preventDefault(); runSearchResult(activeSearchResult); }
});

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

const transcriptPanel = document.querySelector('[data-transcript]');
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

const toast = document.querySelector('[data-invitation-toast]');
function showInvitationToast() {
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

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

document.addEventListener('keydown', (event) => {
  const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
  if (event.key === '/' && !typing && !searchDialog.open && root.dataset.world === 'front') {
    event.preventDefault();
    searchDialog.showModal();
    window.setTimeout(() => searchInput.focus(), 50);
  }
  if (event.shiftKey && event.key.toLowerCase() === 'd') {
    switchWorld(root.dataset.world === 'archive' ? 'front' : 'archive');
  }
});
