/** Tab order. Each id is a panel on the page and a key under `tabs` in the dictionaries. */
export const PANELS = ['main', 'data', 'start', 'laws', 'money', 'tools'] as const;
export type PanelId = (typeof PANELS)[number];
