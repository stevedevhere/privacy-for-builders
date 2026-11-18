// Tabs. Every panel stays in the HTML; the script shows one. #id in the URL picks the tab that holds that id,
// so a link to any block (#rep, #map) opens the right tab. Other scripts listen for 'tabshown'.

export function showTab(scroll: boolean) {
  const panels = [...document.querySelectorAll<HTMLElement>('.panel')];
  if (!panels.length) return;
  const id = decodeURIComponent(location.hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  const panel = target?.closest<HTMLElement>('.panel') ?? panels[0];
  panels.forEach((p) => (p.hidden = p !== panel));
  document.querySelectorAll('.tabs [role="tab"]').forEach((tab) => {
    tab.setAttribute('aria-selected', String(tab.getAttribute('aria-controls') === panel.id));
  });
  document.documentElement.classList.add('tabs-ready');
  document.dispatchEvent(new CustomEvent('tabshown', { detail: panel.id }));
  if (!scroll) return;
  if (target && target !== panel) {
    target.scrollIntoView({ block: 'start' });
    return;
  }
  // the tab bar is sticky, so scrolling to the panel itself does nothing once the page is scrolled: go to the panel's top
  const bar = document.querySelector<HTMLElement>('.tabs');
  const top = panel.getBoundingClientRect().top + scrollY - (bar?.offsetHeight ?? 0);
  if (scrollY > top) scrollTo(0, top);
}

addEventListener('hashchange', () => showTab(true));

// In-page links (#laws, #rep) stay with the browser: ClientRouter would handle them itself and change the URL
// without a hashchange. Clicking the tab that is already open still brings its top into view.
addEventListener(
  'click',
  (e) => {
    const link = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const hash = link.getAttribute('href')!;
    if (hash === location.hash) showTab(true);
    else location.hash = hash;
  },
  { capture: true },
);
