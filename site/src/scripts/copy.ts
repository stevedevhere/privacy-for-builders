// Copy buttons next to commands: [data-copy] copies the <code> in the same block.
document.addEventListener('click', async (e) => {
  const button = (e.target as Element).closest<HTMLButtonElement>('[data-copy]');
  const code = button?.closest('.cmd')?.querySelector('code');
  if (!button || !code) return;
  const label = button.textContent;
  try {
    await navigator.clipboard.writeText(code.textContent ?? '');
    button.textContent = button.dataset.done ?? label;
  } catch {
    button.textContent = button.dataset.fail ?? label;
  }
  setTimeout(() => (button.textContent = label), 1800);
});
