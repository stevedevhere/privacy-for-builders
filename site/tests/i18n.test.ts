// The four languages must say the same thing: same keys, same list lengths, and every claim keeps its source.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderEvidence } from '../src/i18n/evidence.ts';

const LANGS = ['en', 'fr', 'uk', 'ru'];
const load = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const dicts = Object.fromEntries(LANGS.map((l) => [l, load(`../src/i18n/${l}.json`)]));
const laws = Object.fromEntries(LANGS.map((l) => [l, load(`../src/data/laws/${l}.json`)]));

/** path -> value for every string in a nested dictionary */
function leaves(node: unknown, path = '', out = new Map<string, string>()): Map<string, string> {
  if (typeof node === 'string') out.set(path, node);
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) leaves(v, path ? `${path}.${k}` : k, out);
  return out;
}

const urls = (s: string) => [...s.matchAll(/https?:\/\/[^\s"\]<>]+/g)].map((m) => m[0]).sort();

test('every language has the same texts as English', () => {
  const en = [...leaves(dicts.en).keys()];
  for (const l of LANGS) assert.deepEqual([...leaves(dicts[l]).keys()], en, `${l} keys differ`);
});

test('every text links the same sources in every language', () => {
  const en = leaves(dicts.en);
  for (const l of LANGS) {
    for (const [path, text] of leaves(dicts[l])) assert.deepEqual(urls(text), urls(en.get(path)!), `${l} ${path}`);
  }
});

test('country data matches across languages', () => {
  for (const l of LANGS) {
    assert.deepEqual(Object.keys(laws[l].countries), Object.keys(laws.en.countries), `${l} countries`);
    for (const [key, c] of Object.entries<{ c: string; info: string | null }>(laws[l].countries)) {
      assert.equal(c.c, laws.en.countries[key].c, `${l} ${key} class`);
      if (c.info) assert.ok(laws[l].info[c.info], `${l} ${key} note ${c.info}`);
    }
    for (const [key, note] of Object.entries<{ s: string; d: string[] }>(laws[l].info)) {
      assert.deepEqual(urls(note.s), urls(laws.en.info[key].s), `${l} ${key} source`);
      assert.equal(note.d.length, laws.en.info[key].d.length, `${l} ${key} detail lines`);
    }
  }
});

test('evidence tokens become badges with the source link', () => {
  const labels = dicts.fr.evidence;
  const html = renderEvidence('Texte [données https://gdpr-info.eu/art-3-gdpr/] et [déduction].', labels);
  assert.match(html, /<a class="tag d" href="https:\/\/gdpr-info\.eu\/art-3-gdpr\/" title="Source : gdpr-info\.eu">données<\/a>/);
  assert.match(html, /<span class="tag i">déduction<\/span>/);
  assert.equal(renderEvidence('[référence 2026-11-17 https://x.org]', labels), '<a class="tag d" href="https://x.org" title="Source : x.org">référence 2026-11-17</a>');
});

test('no evidence token is left unrendered on any page text', () => {
  for (const l of LANGS) {
    for (const [path, text] of leaves(dicts[l])) {
      if (path.startsWith('evidence.')) continue;
      assert.doesNotMatch(renderEvidence(text, dicts[l].evidence), /\[[^\]\s]+ https?:/, `${l} ${path}`);
    }
  }
});

test('every map shape has the colour of its country class', () => {
  const svg = readFileSync(new URL('../src/assets/map/map.svg', import.meta.url), 'utf8');
  const shapes = [...svg.matchAll(/<(?:path|circle)\b[^>]*\bclass="([^"]*)"[^>]*\bdata-k="([^"]+)"/g)];
  const drawn = new Set(shapes.map((m) => m[2]));
  for (const l of LANGS) {
    assert.deepEqual([...drawn].sort(), Object.keys(laws[l].countries).sort(), `${l} map and data list different countries`);
    for (const [, cls, key] of shapes) assert.match(cls, new RegExp(`\\bk-${laws[l].countries[key].c}\\b`), `${l} ${key}`);
  }
});

test('the map carries no text of its own: every label comes from the data or the dictionaries', () => {
  const svg = readFileSync(new URL('../src/assets/map/map.svg', import.meta.url), 'utf8');
  assert.doesNotMatch(svg, /<title>[^<]/);
  for (const label of svg.matchAll(/data-label="([^"]+)"/g)) {
    for (const l of LANGS) assert.ok(dicts[l].map[label[1]], `${l} map.${label[1]}`);
  }
});
