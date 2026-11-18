// Entry point. Modules register their document-level listeners once; the per-page setup below runs on the
// first load and again after each ClientRouter swap (a language switch, or back/forward between languages).
import { restoreTheme } from './theme';
import { showTab } from './tabs';
import { takeLanguageSwitch } from './lang-switch';
import { initLawsMap } from './laws-map';
import './copy';

let swapped = false;

// runs after the new page is in the DOM, before it is painted
document.addEventListener('astro:after-swap', () => {
  swapped = true;
  const hash = takeLanguageSwitch();
  if (hash) history.replaceState(history.state, '', hash);
  restoreTheme();
  showTab(false);
});

document.addEventListener('astro:page-load', () => {
  if (!swapped) {
    restoreTheme();
    showTab(Boolean(location.hash));
  }
  swapped = false;
  initLawsMap();
});
