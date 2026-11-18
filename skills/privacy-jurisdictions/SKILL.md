---
name: privacy-jurisdictions
description: Decides which data-protection laws apply to a product and what each changes compared with GDPR — EU GDPR and ePrivacy, Swiss nFADP (in depth), UK GDPR after the Data (Use and Access) Act, and trigger-level coverage of US state laws, LGPD, PIPL and DPDP — plus a dated baseline of moving rules (Digital Omnibus, EU-US Data Privacy Framework, AI Act dates, adequacy list) to re-check before relying on them. Use when the user asks "which laws apply to my project", "does GDPR / nFADP / CCPA apply to me", "how does nFADP differ from GDPR", "we are launching in the UK / US / Brazil" (in any language), and as the applicable-law step of privacy-director. For AI Act questions only where personal data is involved.
---

# Privacy jurisdictions

Two questions: which laws apply to this product, and what each adds on top of the GDPR baseline. Plus the baseline of rules that keep moving, because confident advice built on last year's status is the most common way privacy advice goes wrong.

If `privacy-director` is loaded, use its evidence tags. Otherwise use these: `[source: name, date]` for what you read this session, `[baseline 2026-11-17]` for anything taken from this file, `[user]` for facts the user gave, `[inference]` for reasoning, `[verify]` for model knowledge.

## How to treat this file

Everything below was checked against sources on **2026-11-17** and is a **baseline to compare against, not a fact for today**. Tag it `[baseline 2026-11-17]`.

- Re-check an item by web search only when it would change a finding, its severity or the user's decision. A quick answer may cite the baseline with its tag.
- When a search shows the baseline is out of date, use the new status, and output the corrected row so the user can update this skill: `Update privacy-jurisdictions: [row] → [new status, source, date]`. If a product is in view, hand the gap list back to `privacy-director`.
- After **2027-02-15** treat the whole file as stale: re-check every row you rely on and run the refresh below.

## Where to verify

Check in this order and cite what you opened with its date. Official text and the regulator outrank any summary; a summary is enough to find the right article, never to quote it.

| Jurisdiction | Official text | Regulator | Summary to orient |
|---|---|---|---|
| EU | eur-lex.europa.eu (GDPR: /eli/reg/2016/679/oj) | edpb.europa.eu (guidelines, member authorities list) | DLA Piper `dlapiperdataprotection.com/?c=XX&t=law` |
| EU member state | national gazette, linked from the authority | the national authority (EDPB members list) | same, with that country's code |
| Switzerland | fedlex.admin.ch (nFADP SR 235.1, Ordinance SR 235.11) | edoeb.admin.ch (FDPIC) | same |
| UK | legislation.gov.uk (UK GDPR, DPA 2018, Data (Use and Access) Act 2025) | ico.org.uk | same |
| US | state code via the state legislature site | the state attorney general; California: cppa.ca.gov; FTC for deception | IAPP state privacy legislation tracker |
| Brazil | planalto.gov.br (Lei 13.709) | gov.br/anpd | DLA Piper |
| Canada | laws-lois.justice.gc.ca (PIPEDA); Quebec: legisquebec.gouv.qc.ca | priv.gc.ca; Quebec: cai.gouv.qc.ca | DLA Piper |
| Japan | elaws.e-gov.go.jp | ppc.go.jp/en | DLA Piper |
| South Korea | law.go.kr | pipc.go.kr/eng | DLA Piper |
| Australia | legislation.gov.au | oaic.gov.au | DLA Piper |
| India | egazette.gov.in, meity.gov.in | Data Protection Board (via meity.gov.in) | DLA Piper |
| China | cac.gov.cn (Chinese original) | CAC | DLA Piper; reliable English translations are secondary |
| Any other country | the national gazette or the regulator's site | the regulator (Global Privacy Assembly members list at globalprivacyassembly.org) | DLA Piper with the ISO code; CMS expert guide; UNCTAD global tracker for whether a law exists |
| Adequacy, transfers | Commission adequacy decisions page; dataprivacyframework.gov for US certifications | — | — |
| Court decisions, fines | curia.europa.eu; national court sites | — | CMS Enforcement Tracker (enforcementtracker.com) |

If a site is not reachable within the search budget, say which one and keep the item as `[verify]`; do not fill the gap from a blog.

## Refreshing this skill

Laws move; this file should move with them without a separate maintenance job.

1. **When**: a search during any task shows a baseline row is out of date; the file is past its stale date; or the user asks to refresh.
2. **What**: re-check each row of "Baseline of moving rules" (and any Step 2 line the task relied on) against the sources in "Where to verify". Record for each row: unchanged, or the new status with source and date.
3. **Output**: a short list `Update privacy-jurisdictions: [row] → [new status, source, date]`, plus the new check date for the file.
4. **Apply**, only after the user says yes:
   - where you can write the skill's own file (the folder this skill was loaded from, such as `~/.claude/skills/`, `~/.agents/skills/`, or the user's repository copy), edit the rows and both dates (the check date and the stale date, three months later), and show the diff;
   - where the agent has a tool for proposing skill updates instead of file access (claude.ai, for example), propose the edited rows as an update to this skill;
   - otherwise give the edited table to paste.
5. **Keep it current on a schedule**, if the user wants: where the agent can create scheduled or recurring tasks, offer once to set one up (monthly or quarterly) that runs steps 2–3 and sends the list for approval, and never create it without a yes. Where it cannot, tell the user once that they can ask to "refresh privacy-jurisdictions" whenever they like, and that it becomes stale on its own on the stale date.

## Step 1 — applicability

For each law: **applies / probably applies / does not apply**, with the single trigger that decides it. Name the missing fact that would flip an uncertain answer. Facts the user gave are `[user]`; the conclusion that a law applies is `[inference]`.

| Law | Applies when | Notes |
|---|---|---|
| **EU GDPR** | An EEA establishment processes data in the context of its activities (Art. 3(1)); or a non-EEA operator offers goods or services to people in the EEA (Art. 3(2)(a)) or monitors their behaviour there (Art. 3(2)(b)) | Targeting signs: an EU language or currency, delivery, ads aimed at EU countries; mere accessibility is not enough (recital 23). A language spoken across many countries (English, Russian, Ukrainian, Spanish) is not by itself targeting; then decide by country selection, payment, marketing, domain and the operator's stated markets `[user]`. A non-EEA operator under Art. 3(2) appoints an EU representative (Art. 27) unless processing is occasional, does not include large-scale processing of special categories or criminal-offence data, and is unlikely to result in risk. |
| **ePrivacy** (device storage and access) | Anything is stored on or read from a device in the EEA | National laws (Germany: TDDDG § 25; France: Art. 82 Loi Informatique et Libertés) `[verify]`; consent unless strictly necessary for the service requested. Covers local storage and SDK identifiers, not only cookies. |
| **Swiss nFADP** | Processing has effects in Switzerland (Art. 3), including by foreign operators | In force since 2023-09-01. Foreign controllers regularly processing data of people in Switzerland on a large scale with high risk appoint a Swiss representative (Art. 14). |
| **UK GDPR + DPA 2018** | UK establishment, or offering to / monitoring people in the UK | Amended by the Data (Use and Access) Act 2025; non-UK operators in scope appoint a UK representative. |
| **US state privacy laws** (CCPA/CPRA and others) | Doing business in the state and passing its threshold (California: revenue above a CPI-adjusted amount, about USD 26.6M; or 100,000+ California consumers' or households' data bought, sold or shared; or 50%+ revenue from selling/sharing). Other states mostly count residents. | Opt-out model; research the specific states live. Federal sectoral laws on top: COPPA (under-13 users of child-directed services), HIPAA, GLBA. |
| **Brazil LGPD** | Processing in Brazil, offering to or processing data of people in Brazil, or data collected there | Research live; key deltas below. |
| **China PIPL** | Processing in China, or from abroad to provide products/services to or analyse people in China | Research live; key deltas below. |
| **India DPDP** | Processing in India, or from abroad in connection with offering goods or services in India | Phased start; research live. |
| **EU AI Act** | AI systems placed on the EU market or used in the EU, or whose output is used in the EU | Applies alongside GDPR when personal data is involved. |

Anything else (Canada PIPEDA and Quebec Law 25, Australia, Japan, Korea, Turkey, Ukraine): research live from primary sources and say there was no prepared baseline.

## Step 2 — what changes against the GDPR baseline

### GDPR baseline

Six legal bases (Art. 6). Special categories need an Art. 9(2) exception, in apps usually explicit consent. Digital consent age 16 by default, 13–16 by country (Art. 8). DPIA when high risk is likely (Art. 35). DPO only in three cases (Art. 37). Breach: authority within 72 hours of awareness unless unlikely to result in risk; people without undue delay if high risk (Art. 33–34); a processor notifies the controller. Rights requests within one month, extendable by two (Art. 12(3)). Transfers out of the EEA need adequacy, SCC with a transfer impact assessment, BCR or an Art. 49 derogation. Fines up to EUR 10M or 2%, or EUR 20M or 4%, of worldwide turnover, whichever is higher (Art. 83). A dynamic IP address is personal data where the operator has legal means to identify the person (C-582/14 Breyer). Inferred sensitive data is special-category data, regardless of intent or accuracy (C-184/20, C-252/21, C-21/23). Pseudonymised data may not be personal for a recipient who cannot re-identify anyone, while it stays personal for the sender (EDPS v SRB, C-413/23 P, 2025). Compensation for non-material damage has no seriousness threshold, but damage must be shown (C-300/21). Records of processing (Art. 30): the under-250 exemption holds only if processing is occasional, unlikely to result in risk and excludes special categories and criminal-offence data.

### Switzerland — nFADP (in depth)

- **Model**: private processing is lawful if the principles are respected; a justification (consent, overriding interest, law) is needed only where processing violates personality rights — for example against the person's express wish, or disclosing sensitive data to third parties (Art. 30(2)(c), 31). Shared or paired results that reveal one person's sensitive answers to another fall here.
- **Sensitive data** (Art. 5(c)): wider than GDPR — adds the intimate sphere, social assistance measures, administrative and criminal proceedings and sanctions.
- **Express consent** (Art. 6(7)) where consent is the basis for sensitive data or for **high-risk profiling** (profiling that assesses essential aspects of personality, Art. 5(g)). GDPR has no separate high-risk profiling concept.
- **Privacy by design and by default** (Art. 7).
- **Information duty** (Art. 19): controller identity and contact, purpose, recipients, destination countries and safeguards. Wilful breach of this duty is a criminal offence.
- **Automated individual decisions** (Art. 21): inform the person of decisions based solely on automated processing with legal or significant effect; on request, let them state their view and have a human review it.
- **DPIA** when high risk is likely (Art. 22); FDPIC consultation if residual risk stays high (Art. 23).
- **Breach** (Art. 24): FDPIC as soon as possible when high risk is likely; inform people when needed for their protection or when the FDPIC asks. No fixed hour count. Document every breach; the Ordinance (Art. 15) keeps records two years.
- **Access requests** (Art. 25): free, generally within 30 days under the Ordinance.
- **Records of processing** (Art. 12): companies under 250 staff exempt unless processing sensitive data on a large scale or doing high-risk profiling (Ordinance).
- **Sanctions**: criminal fines up to CHF 250,000 on the **responsible individual** for wilful violations of: information and access duties (Art. 60); duties of care — transfers abroad without safeguards, handing data to a processor without the required contract, ignoring the minimum data-security requirements (Art. 61); professional confidentiality (Art. 62) — these three on complaint; FDPIC orders (Art. 63), prosecuted ex officio; a company only up to CHF 50,000 where identifying the individual would be disproportionate (Art. 64).
- **Cookies and device storage**: no ePrivacy; Telecommunications Act Art. 45c requires informing users about the processing, its purpose and their right to refuse — an opt-out model, fines up to CHF 5,000. The FDPIC's cookie guidelines (2025) expect a usable way to refuse non-essential storage, and express consent where sensitive data or high-risk profiling is involved. EEA users of the same product still get the EU consent standard.
- **Transfers**: to countries on the Federal Council's adequacy list; to the US via companies certified under the Swiss-US DPF (since 2024-09-15); otherwise Swiss-adapted SCC.
- **EU adequacy**: the EU recognises Switzerland, so EEA → CH needs no extra mechanism.

### Operator is a natural person (no company)

- The household exemption covers purely personal or family activity only (GDPR Art. 2(2)(c); nFADP Art. 2(2)(a)). Offering an app to other people is not that, even unpaid: the person is the controller `[inference]`.
- nFADP criminal fines target the responsible individual anyway (Art. 60–64); here that is the operator personally.
- The privacy notice must name the controller and a contact (GDPR Art. 13(1)(a), nFADP Art. 19). Whether an email or contact form without a postal address is enough is `[verify]`; anyone offering goods, works or services online to people in Switzerland owes an Impressum with identity and contact address including email (UWG Art. 3(1)(s); in practice a postal address, not a P.O. box) `[source: kmu.admin.ch, 2026-11-17]`.
- An EU representative (Art. 27) is still needed when GDPR applies through Art. 3(2), and the "occasional, no large-scale special categories" exemption rarely fits an app built around sensitive answers `[inference, contested]`; commercial representative services cost roughly EUR 500–4,750 a year `[source: provider price pages, 2026-11-17]`.
- Duties start with the first real person's data: testers count, an unpublished pilot with no users has nothing to notify yet.

### United Kingdom — after the Data (Use and Access) Act

Same structure as GDPR, plus: "recognised legitimate interests" as a listed basis without the balancing test; rewritten automated decision rules (Art. 22A–22D) allowing more automated decisions with safeguards; a "stop the clock" for clarifying access requests; PECR (cookies, marketing) fines raised to UK GDPR level; storage used only for statistics or for appearance settings exempt from consent since 2026-02-05, under narrow conditions `[source: ICO, 2026-11-17]`. Consent age 13. EU adequacy for the UK renewed to 2031-12-27.

### Other laws — key deltas only, research details live

| Law | What differs from GDPR |
|---|---|
| US state laws | Opt-out rather than opt-in for most processing; "Do Not Sell or Share" link; honour Global Privacy Control; opt-in for sensitive data in several states; requests in 45 days (+45); California penalties per violation with no percentage cap; no federal comprehensive law. |
| Brazil LGPD | Ten legal bases; data protection officer (encarregado) expected; breach notice to the ANPD within 3 business days; fines up to 2% of Brazilian revenue, capped per infraction. |
| China PIPL | No legitimate interest; separate consent for sensitive data, disclosure and cross-border transfer; CAC assessment, standard contract or certification for exports; localisation for some operators; fines up to CNY 50M or 5% of revenue plus personal fines for managers. |
| India DPDP | Consent plus listed "legitimate uses", no legitimate interest; verifiable parental consent for everyone under 18; every breach reported to the Board and to affected people. |

## Step 3 — AI overlay (only where personal data is involved)

- **GDPR**: separate legal bases for training and for use; legitimate interest for training only after the three-step test (EDPB Opinion 28/2024), and unlawful training can taint later use; Art. 22 limits solely automated decisions with legal or similar effect; DPIA usually required.
- **nFADP**: Art. 21 duty to inform about automated individual decisions; high-risk profiling needs express consent where consent is the basis.
- **AI Act** dates per Regulation (EU) 2026/1744 `[baseline 2026-11-17]`: prohibited practices (including emotion recognition at work and in education) since 2025-02-02; general-purpose AI model duties since 2025-08-02; general application and Art. 50 transparency (tell people they are talking to an AI) since 2026-08-02; generative-content marking for systems placed on the market before that date from 2026-12-02; Annex III high-risk systems (hiring, education, credit, biometrics) from 2027-12-02; Annex I product-embedded high-risk from 2028-08-02.
- **Vendors**: whether the AI provider trains on submitted data, how long it keeps prompts, where it processes them — read the provider's current terms page and cite it with the date.

AI governance questions with no personal data in them (model documentation, conformity assessment) are outside this skill: answer directly or use an AI-governance skill if one is installed.

## Baseline of moving rules (checked 2026-11-17)

| Item | Baseline status | Re-check at |
|---|---|---|
| Digital Omnibus, GDPR/ePrivacy part (2025/0360(COD)) | Proposal 2025-11-19; EDPB-EDPS joint opinion Feb 2026; Council mandate 2026-10-21 (definition of personal data kept, rules on pseudonymised data added, 96-hour breach notice with a high-risk threshold, EU-wide DPIA list, cookies stay in ePrivacy with audience measurement exempt); Parliament position pending; **not law** | EUR-Lex procedure file; Council and Parliament press releases |
| EU-US Data Privacy Framework | In force; General Court upheld it 2025-09-03; appeal C-703/25 P pending | Commission adequacy page; curia.europa.eu |
| GDPR Procedural Regulation (EU) 2025/2518 | In force 2026-01-01; applies to cross-border cases opened from 2027-04-02 | EUR-Lex |
| AI Act dates | As in Step 3 | EUR-Lex; AI Office |
| UK Data (Use and Access) Act | Main data-protection changes commenced 2026-02-05 | gov.uk; ICO |
| EU adequacy list | Andorra, Argentina, Canada (commercial), Faroe Islands, Guernsey, Isle of Man, Israel, Japan, Jersey, New Zealand, Republic of Korea, Switzerland, UK, Uruguay, US (DPF-certified only) | Commission adequacy page |
| Pseudonymised data | EDPS v SRB, C-413/23 P (2025): may not be personal for a recipient who cannot re-identify; the Omnibus would codify a version of this | curia.europa.eu |
| US state privacy laws | About 20 in force, 24 enacted (mid-2026); new effective dates each January and July | IAPP state tracker |
| California CCPA amounts | Penalties USD 2,663 / 7,988 per violation; revenue threshold about USD 26.6M; ADMT, risk-assessment and audit rules phasing in from 2026 | cppa.ca.gov |
| India DPDP | Rules notified 2025-11-13; consent-manager provisions from 2026-11-13; most duties from 2027-05-13 | meity.gov.in |
| Swiss practice | FDPIC guidance and first criminal cases; adequacy list in the Ordinance annex | edoeb.admin.ch; fedlex.admin.ch |
| Ukraine bill 8153 | First reading 2024-11-20; preparing for second reading | rada.gov.ua bill card |
| Enforcement statistics | CMS Enforcement Tracker report 2026: 2,685 fines with complete data to 2026-03-01 | enforcementtracker.com |

## Output

Write it in the user's language: translate the labels below, keep the evidence tags as they are.

```
Applicable laws
| Law | Status | Deciding trigger | What is missing for an exact answer |

What changes against GDPR (applicable laws only)
| Law | Difference | What to do in the product | Tag |

Re-checked now: [what, source, date]
Taken from the baseline without re-checking: [what]
Update privacy-jurisdictions: [rows, if changes were found]
```
