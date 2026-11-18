import { navigate } from 'astro:transitions/client';

// Switching language swaps the page in place (ClientRouter) and keeps the open tab. The switcher sits at the top
// of the page, so the reader is already there and the router's scroll to the top costs nothing.
let pending: string | null = null;

// capture phase: runs before ClientRouter's own link handler, which then sees the click as handled
addEventListener(
  'click',
  (e) => {
    const link = (e.target as Element).closest?.<HTMLAnchorElement>('a[data-lang-link]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (link.getAttribute('aria-current') === 'page') return;
    pending = location.hash;
    // navigate without the hash, or the router would scroll to that anchor; the hash goes back after the swap
    navigate(link.href.split('#')[0]);
  },
  { capture: true },
);

// Once the page is idle, the other languages and the other alphabet's fonts are fetched at the lowest priority,
// so a switch needs no network. Skipped when the reader's browser asks to save data.
document.addEventListener('astro:page-load', () => {
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
  const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 1500));
  idle(() => {
    const nav = document.querySelector<HTMLElement>('[data-later-fonts]');
    const pages = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lang-link]:not([aria-current])')].map((a) => a.href.split('#')[0]);
    const fonts: string[] = nav ? JSON.parse(nav.dataset.laterFonts!) : [];
    for (const url of [...pages, ...fonts]) warm(url, fonts.includes(url));
  });
});

const warmed = new Set<string>();
function warm(url: string, font: boolean) {
  if (warmed.has(url)) return;
  warmed.add(url);
  const link = document.createElement('link');
  if (!link.relList.supports('prefetch')) return void fetch(url, { priority: 'low' }).catch(() => {}); // Safari
  link.rel = 'prefetch';
  link.href = url;
  if (font) link.crossOrigin = 'anonymous'; // fonts load in CORS mode; a matching prefetch is reused from the cache
  document.head.append(link);
}

/** The hash to put back after a language switch, once; null for any other navigation. */
export function takeLanguageSwitch() {
  const hash = pending;
  pending = null;
  return hash;
}
