// Auto / light / dark. The choice is stored on this device only and applied to <html> as color-scheme,
// which drives every light-dark() token.
const KEY = 'gdpr-theme';
type Theme = 'auto' | 'light' | 'dark';

function saved(): Theme {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : 'auto';
  } catch {
    return 'auto'; // storage can be blocked; the system theme still works
  }
}

function apply(theme: Theme) {
  document.documentElement.style.colorScheme = theme === 'auto' ? '' : theme;
  document.querySelectorAll<HTMLElement>('[data-theme-choice]').forEach((b) => {
    b.setAttribute('aria-checked', String(b.dataset.themeChoice === theme));
  });
}

/** Re-applies the saved theme; called on load and after every page swap, which resets <html>. */
export const restoreTheme = () => apply(saved());

document.addEventListener('click', (e) => {
  const button = (e.target as Element).closest<HTMLElement>('[data-theme-choice]');
  if (!button) return;
  const theme = button.dataset.themeChoice as Theme;
  apply(theme);
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
});
