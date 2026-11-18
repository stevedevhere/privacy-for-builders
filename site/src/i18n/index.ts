import en from './en.json';
import fr from './fr.json';
import uk from './uk.json';
import ru from './ru.json';
import { renderEvidence, type EvidenceLabels } from './evidence';

export const LANGS = ['en', 'fr', 'uk', 'ru'] as const;
export type Lang = (typeof LANGS)[number];

export type Dict = typeof en;
const DICTS: Record<Lang, Dict> = { en, fr, uk, ru };

/**
 * Switcher label, page path, data file and Open Graph locale per language. UA is the label people expect for Ukrainian.
 * Paths have no .html: Cloudflare Pages serves fr.html at /fr and redirects /fr.html there.
 */
export const LANG_META: Record<Lang, { label: string; path: string; laws: string; locale: string }> = {
  en: { label: 'EN', path: '', laws: 'laws.json', locale: 'en_US' },
  fr: { label: 'FR', path: 'fr', laws: 'laws.fr.json', locale: 'fr_FR' },
  uk: { label: 'UA', path: 'uk', laws: 'laws.uk.json', locale: 'uk_UA' },
  ru: { label: 'RU', path: 'ru', laws: 'laws.ru.json', locale: 'ru_RU' },
};

/** A link to a language's page, relative to the site root, where every page sits. */
export const pageHref = (lang: Lang) => LANG_META[lang].path || './';

export const isLang = (value: unknown): value is Lang => LANGS.includes(value as Lang);

/** The page language, from the route: /, /fr, /uk, /ru (the files are fr.html, uk.html, ru.html). */
export function langOf(url: URL): Lang {
  const name = url.pathname.split('/').pop()?.replace(/\.html$/, '');
  return isLang(name) ? name : 'en';
}

type Path<T> = T extends string ? '' : { [K in keyof T & string]: T[K] extends string ? K : `${K}.${Path<T[K]>}` | K }[keyof T & string];

/** Text helpers for one language. `t` returns HTML with evidence badges rendered; `get` returns raw values (lists, objects). */
export function useText(lang: Lang) {
  const dict = DICTS[lang];
  const evidence: EvidenceLabels = dict.evidence;
  const get = <T = unknown>(path: Path<Dict>): T => {
    const value = path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], dict);
    if (value === undefined) throw new Error(`Missing ${lang} text: ${path}`);
    return value as T;
  };
  const html = (text: string) => renderEvidence(text, evidence);
  return { lang, dict, get, html, t: (path: Path<Dict>) => html(get<string>(path)) };
}
