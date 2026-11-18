import en from './laws/en.json';
import fr from './laws/fr.json';
import uk from './laws/uk.json';
import ru from './laws/ru.json';
import type { Lang } from '../i18n';

/** Country data, also published as open data (laws.json, laws.fr.json, …), see llms.txt. */
export interface LawsData {
  cls: Record<string, { name: string; note: string }>;
  countries: Record<string, { n: string; en: string; c: string; law: string | null; y: number | null; info: string | null; iso: string | null }>;
  info: Record<string, { t: string; s: string; d: string[]; reg?: [string, string] }>;
}

const LAWS = { en, fr, uk, ru } as unknown as Record<Lang, LawsData>;

export const loadLaws = (lang: Lang): LawsData => LAWS[lang];

/** Legend order on the map, strongest protection first. */
export const CLASS_ORDER = ['g', 'a', 'u', 'l', 'p', 'n'] as const;

export function countByClass(data: LawsData): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of Object.values(data.countries)) counts[c.c] = (counts[c.c] ?? 0) + 1;
  return counts;
}
