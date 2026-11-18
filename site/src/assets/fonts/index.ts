import displayLatin from './unbounded-latin.woff2?url';
import displayCyrillic from './unbounded-cyrillic.woff2?url';
import bodyLatin from './golos-text-latin.woff2?url';
import bodyCyrillic from './golos-text-cyrillic.woff2?url';
import type { Lang } from '../../i18n';

const latin = [displayLatin, bodyLatin];
const cyrillic = [displayCyrillic, bodyCyrillic];

/**
 * The fonts a language's first screen needs now, and those a language switch may need later.
 * Cyrillic pages need both alphabets at once: their headings carry Latin names (GDPR, nFADP).
 */
export function fontsFor(lang: Lang) {
  return lang === 'uk' || lang === 'ru' ? { now: [...cyrillic, ...latin], later: [] } : { now: latin, later: cyrillic };
}
