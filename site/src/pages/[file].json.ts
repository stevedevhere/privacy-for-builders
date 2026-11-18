import type { APIRoute } from 'astro';
import { LANGS, LANG_META, type Lang } from '../i18n';
import { loadLaws } from '../data/laws';

// Publishes the country data as laws.json, laws.fr.json, … for the map script and for anyone reusing it.
export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { file: LANG_META[lang].laws.replace('.json', '') }, props: { lang } }));
}

export const GET: APIRoute<{ lang: Lang }> = ({ props }) =>
  new Response(JSON.stringify(loadLaws(props.lang)), { headers: { 'Content-Type': 'application/json' } });
