# Architecture: the reference site

## Sizing

- **Domain depth D0.** Static content; no rule that moves money or trust is computed by the site.
- **Operational weight O0.** No accounts, no server, no stored personal data; a day of downtime is an annoyance.
- **Tier S.** One deployable, no database, no backend.

Re-size if the site ever stores anything about visitors or gains accounts.

## Stack

- Astro, static output, one page in four languages. Pages are built from components; all text lives in `src/i18n/<lang>.json`.
- ClientRouter swaps the page on a language switch, so the open tab is kept. The other languages and the other alphabet's fonts are fetched when the page is idle (not with Save-Data), and the drawn map moves into the new page, so a switch needs no network.
- Files fetched at run time (map, country data, time-zone table) carry a content hash in their name, so a new build never shows an old cached copy.
- Hosted on Cloudflare Pages at privacy.stevedevhere.com (also privacy-for-builders.pages.dev); GitHub Actions tests, builds and publishes on every push to main. Every URL is relative and every page sits at the root, so the same build also runs from a sub-path.

## Decisions

- **Personal data:** none collected. The theme choice is kept in `localStorage` on the visitor's device; the map's country guess uses the device time zone and sends nothing. Fonts are self-hosted.
- **Auth, tenancy, idempotency, backups:** not needed, there is no server state.
- **Secrets:** a Cloudflare API token limited to Pages (Edit) and the account ID, stored as GitHub repository secrets; nothing in the code.
- **Errors and logs:** not needed at O0; a failed map load shows a message and the country list still works.

## Layout

```
site/src/
  i18n/        text per language + the helpers that read it and render source badges
  data/        country data (laws/<lang>.json), tab order, source list
  components/  shared pieces (tile, panel, buttons, switches, footer)
  sections/    one component per block of the page
  layouts/     the page shell
  scripts/     tabs, theme, language switch, map, copy button
  pages/       one route that renders the page per language, one that publishes the country data
```

## What is tested

- Every language has the same text keys, and each text links the same sources as English.
- Country data matches across languages; every map shape exists in the data and carries its class colour.
- Source badges render from the `[label URL]` tokens.

Static content gets no tests. Module boundary lint is skipped at tier S.
