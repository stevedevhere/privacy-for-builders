import { escapeHtml, renderEvidence, type EvidenceLabels } from '../i18n/evidence';
import type { LawsData } from '../data/laws';

// The laws map. The SVG, the country data and the time-zone table load only when the Laws tab is first shown.
// The selected country survives a language switch: country keys are the same in every laws.<lang>.json.
// One SVG serves every language (labels come from the data), and fetched files are kept for the whole visit,
// so after a language switch only the new language's data is new, and it is usually fetched before the click.

interface MapText {
  laws: string;
  lawsByLang: Record<string, string>;
  svg: string;
  zones: string;
  imageTitle: string;
  frenchGuiana: string;
  evidence: EvidenceLabels;
  version: string;
  dla: string;
  hasLaw: string;
  unctad: string;
  diff: string;
  regulatorSite: string;
  where: string;
  more: string;
  less: string;
  timeZone: string;
  loadFailed: string;
}

const UNCTAD = 'https://unctad.org/topic/ecommerce-and-digital-economy/ecommerce-law-reform/summary-adoption-e-commerce-legislation-worldwide';
const dlaUrl = (iso: string) => `https://www.dlapiperdataprotection.com/?c=${iso}&t=law`;

let selected: string | null = null;
let current: LawsMap | null = null;
// the drawn map, moved into the next page on a language switch instead of being parsed again
let drawing: SVGSVGElement | null = null;

const files = new Map<string, Promise<Response>>();
/** Fetches a file once per visit; a failed fetch is forgotten so the next try goes to the network again. */
function fetchOnce(url: string): Promise<Response> {
  let request = files.get(url);
  if (!request) {
    request = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${url}: ${r.status}`);
      return r;
    });
    request.catch(() => files.delete(url));
    files.set(url, request);
  }
  return request.then((r) => r.clone());
}

class LawsMap {
  private data: LawsData | null = null;
  private svg: SVGSVGElement | null = null;
  private loading: Promise<void> | null = null;
  private readonly text: MapText;
  private readonly slot: HTMLElement;
  private readonly body: HTMLElement;
  private readonly pick: HTMLSelectElement;

  constructor(private readonly root: HTMLElement) {
    this.text = JSON.parse(root.querySelector('[data-map-text]')!.textContent!);
    this.slot = root.querySelector('.world-slot')!;
    this.body = root.querySelector('[data-map-body]')!;
    this.pick = root.querySelector('[data-map-pick]')!;
    if (drawing) this.adopt(drawing);
    this.slot.addEventListener('click', (e) => {
      const shape = (e.target as Element).closest<SVGElement>('[data-k]');
      if (shape) this.show(shape.dataset.k!, true);
    });
    this.pick.addEventListener('change', () => this.pick.value && this.whenLoaded(() => this.show(this.pick.value, false)));
    root.querySelectorAll<HTMLButtonElement>('.lg').forEach((b) => b.addEventListener('click', () => this.highlight(b)));
  }

  /** Starts loading; safe to call many times. */
  load(): Promise<void> {
    this.loading ??= this.fetchAll();
    return this.loading;
  }

  private whenLoaded(fn: () => void) {
    this.load().then(() => this.data && fn());
  }

  private async fetchAll() {
    const t = this.text;
    try {
      const [data, zones] = await Promise.all([
        fetchOnce(t.laws).then((r) => r.json() as Promise<LawsData>),
        fetchOnce(t.zones)
          .then((r) => r.json() as Promise<Record<string, string>>)
          .catch(() => ({}) as Record<string, string>),
        this.svg ??
          fetchOnce(t.svg)
            .then((r) => r.text())
            .then((svg) => {
              this.slot.innerHTML = svg;
              this.svg = drawing = this.slot.querySelector('svg');
            }),
      ]);
      this.data = data;
      this.label(data);
      if (selected && data.countries[selected]) this.show(selected, false);
      else this.guessFromTimeZone(zones);
    } catch {
      this.loading = null; // let the next tab visit try again
      this.slot.innerHTML = `<p class="muted">${escapeHtml(t.loadFailed)}</p>`;
    }
  }

  private adopt(svg: SVGSVGElement) {
    svg.classList.remove('dim');
    svg.querySelectorAll('.on').forEach((el) => el.classList.remove('on'));
    this.slot.replaceChildren(svg);
    this.svg = svg;
  }

  /** Gives every shape its name in this page's language, shown as a tooltip; the country list is the accessible way to pick. */
  private label(data: LawsData) {
    const svg = this.svg;
    if (!svg) return;
    svg.querySelector('#map-title')!.textContent = this.text.imageTitle;
    svg.querySelectorAll<SVGElement>('[data-k]').forEach((shape) => {
      shape.querySelector('title')?.remove(); // a map moved from another language still has that language's names
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = shape.dataset.label === 'frenchGuiana' ? this.text.frenchGuiana : (data.countries[shape.dataset.k!]?.n ?? '');
      shape.append(title);
    });
  }

  /** Starts fetching another language's data while the reader reaches for its link, once this map is in use. */
  warm(lang: string) {
    const url = this.text.lawsByLang[lang];
    if (this.loading && url) fetchOnce(url).catch(() => {});
  }

  // the device's own time zone picks a starting country; nothing is sent anywhere
  private guessFromTimeZone(zones: Record<string, string>) {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const iso = Object.keys(zones).find((code) => zones[code].split(' ').includes(zone));
    const key = iso && Object.keys(this.data!.countries).find((k) => this.data!.countries[k].iso === iso);
    if (!key) return;
    this.show(key, false);
    this.body.insertAdjacentHTML('afterbegin', `<p class="tz-note">${escapeHtml(this.text.timeZone)}</p>`);
  }

  private show(key: string, fromMap: boolean) {
    const { data, svg, text: t } = this;
    const country = data?.countries[key];
    if (!data || !country) return;
    selected = key;
    this.pick.value = key;
    svg?.querySelectorAll('.sel').forEach((el) => el.classList.remove('sel'));
    svg?.querySelectorAll(`[data-k="${key}"]`).forEach((el) => {
      el.classList.add('sel');
      el.parentNode!.appendChild(el); // draw the selected outline on top of its neighbours
    });

    const tags = (s: string) => renderEvidence(escapeHtml(s), t.evidence);
    // the year of the version in force, unless the law's name already carries it
    const showYear = Boolean(country.y && country.law && !country.law.includes(String(country.y)));
    const cls = data.cls[country.c];
    const note = country.info ? data.info[country.info] : undefined;
    const dla = country.iso ? `<a href="${dlaUrl(country.iso)}">${escapeHtml(t.dla)}</a>` : '';
    const regulator = note?.reg ? `<a href="${note.reg[1]}">${escapeHtml(note.reg[0])}</a>` : '';

    let where: string;
    if (country.c === 'p' || country.c === 'n') where = `${escapeHtml(t.hasLaw)} <a href="${UNCTAD}">${escapeHtml(t.unctad)}</a>${dla ? ' · ' + dla : ''}`;
    else if (!note) where = `${escapeHtml(t.diff)} ${dla || escapeHtml(t.regulatorSite)}`;
    else where = `${escapeHtml(t.where)} ${[regulator, dla].filter(Boolean).join(' · ')}`;

    this.body.innerHTML = [
      `<h4>${escapeHtml(country.n)}</h4>`,
      `<span class="cls k-${country.c}"><i></i>${escapeHtml(cls.name)}</span>`,
      country.law ? `<p class="law">${tags(country.law)}${showYear ? `, ${escapeHtml(t.version)} ${country.y}` : ''}</p>` : '',
      `<p>${note ? tags(note.s) : escapeHtml(cls.note)}</p>`,
      `<p class="where">${where}</p>`,
      note?.d.length
        ? `<button type="button" class="more" aria-expanded="false">${escapeHtml(t.more)}</button><ul hidden>${note.d.map((x) => `<li>${tags(x)}</li>`).join('')}</ul>`
        : '',
    ].join('');

    const more = this.body.querySelector<HTMLButtonElement>('.more');
    more?.addEventListener('click', () => {
      const list = more.nextElementSibling as HTMLElement;
      const open = list.hidden;
      list.hidden = !open;
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? t.less : t.more;
    });
    // on narrow screens the panel is below the map, so bring it into view after a tap on the map
    if (fromMap && matchMedia('(max-width:1000px)').matches) this.body.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  private highlight(button: HTMLButtonElement) {
    const on = button.getAttribute('aria-pressed') !== 'true';
    this.root.querySelectorAll('.lg').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    if (!this.svg) return;
    this.svg.querySelectorAll('.on').forEach((el) => el.classList.remove('on'));
    this.svg.classList.toggle('dim', on);
    if (!on) return;
    button.setAttribute('aria-pressed', 'true');
    this.svg.querySelectorAll(`.k-${button.dataset.c}`).forEach((el) => el.classList.add('on'));
  }
}

/** Binds the map on the current page; called on load and after every page swap. */
export function initLawsMap() {
  const root = document.querySelector<HTMLElement>('[data-laws-map]');
  current = root ? new LawsMap(root) : null;
  if (current && !document.getElementById('laws')?.hidden) current.load();
}

document.addEventListener('tabshown', (e) => {
  if ((e as CustomEvent<string>).detail === 'laws') current?.load();
});

// start fetching as soon as the reader points at a link to the Laws tab, or at another language while the map is open
for (const type of ['pointerover', 'focusin']) {
  document.addEventListener(type, (e) => {
    const link = (e.target as Element).closest?.<HTMLAnchorElement>('a[href="#laws"], a[data-lang-link]');
    if (!link) return;
    if (link.hasAttribute('data-lang-link')) current?.warm(link.hreflang);
    else current?.load();
  });
}
