import type { Dict } from '../i18n';
import type { LawsData } from './laws';

const OWN = /github\.com\/stevedevhere|stevedevhere\.com/;

/** Every external source cited on the page, in reading order: page text first, then the country data and notes. */
export function collectSources(dict: Dict, laws: LawsData): string[] {
  const found = new Set<string>();
  const visit = (node: unknown): void => {
    if (typeof node === 'string') {
      for (const [url] of node.matchAll(/https?:\/\/[^\s"\]<>]+/g)) if (!OWN.test(url)) found.add(url);
    } else if (node && typeof node === 'object') {
      Object.values(node).forEach(visit);
    }
  };
  visit(dict);
  visit(laws);
  return [...found];
}

/** "domain / last path segment", short enough for a list of links. */
export function sourceLabel(url: string): string {
  const { hostname, pathname } = new URL(url);
  const last = pathname.split('/').filter(Boolean).pop();
  return [hostname.replace(/^www\./, ''), last].filter(Boolean).join(' / ');
}
