import { defineConfig } from 'astro/config';

// Every URL is relative and every page sits at the root (index.html, fr.html, …), so the same build
// also works when served from a sub-path.
export default defineConfig({
  // the canonical address; hreflang and canonical links point here, in-page links stay relative
  site: 'https://privacy.stevedevhere.com/',
  // assets/ not _astro/: the artifact host reserves names starting with _
  build: { format: 'file', assets: 'assets', assetsPrefix: '.', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
