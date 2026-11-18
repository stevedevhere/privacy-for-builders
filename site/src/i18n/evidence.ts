// Evidence badges. Texts mark claims inline as [label URL]: "data" (stated in the source at URL),
// "inference" (follows from sources) or "baseline <date>" (checked against the source on that date).
// The same format is used in the page dictionaries and in the public laws.<lang>.json files.

export interface EvidenceLabels {
  data: string;
  inference: string;
  baseline: string;
  verify: string;
  /** Tooltip prefix with its punctuation, e.g. "Source:" or "Source :". */
  source: string;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const domain = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

/** Replaces [label URL] tokens in trusted HTML with badge markup. */
export function renderEvidence(html: string, labels: EvidenceLabels): string {
  const kinds: Record<string, string> = { [labels.data]: 'd', [labels.inference]: 'i', [labels.verify]: 'q' };
  const names = [labels.data, labels.inference, labels.verify].map(escapeRegExp).join('|');
  const token = new RegExp(`\\[(${names}|${escapeRegExp(labels.baseline)} [0-9-]+)(?: (https?://[^\\]\\s]+))?\\]`, 'g');
  return html.replace(token, (_, label: string, url?: string) => {
    const kind = kinds[label] ?? 'd';
    return url
      ? `<a class="tag ${kind}" href="${url}" title="${labels.source} ${domain(url)}">${label}</a>`
      : `<span class="tag ${kind}">${label}</span>`;
  });
}

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

export const escapeHtml = (s: unknown) => String(s).replace(/[&<>"]/g, (c) => ESCAPES[c]);
