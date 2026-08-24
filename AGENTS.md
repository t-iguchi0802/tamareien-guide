# AGENTS.md
# Implementation Rules for Codex / Coding Agents

## Mission

Build the local comparison media exactly from the specifications in `/docs`.

The product goal is not to make a generic directory.
The goal is to create a **search-first, locally specific comparison media site** that helps users find which local electrical shop can handle their problem.

---

## Read First

Before changing implementation, read:

1. `/docs/01_CONTENT.md`
2. `/docs/03_SITE_STRUCTURE.md`
3. `/docs/02_DESIGN.md`
4. `/docs/04_WIREFRAME.md`
5. `/docs/05_DATA.md`
6. `/docs/06_TECH.md`
7. `/docs/07_QA.md`

Do not infer product strategy from existing code when the docs say otherwise.

---

## Hard Rules

### Editorial independence

Never:
- rank sponsors higher
- change comparison results for sponsors
- style sponsor shops as editorial recommendations
- hide advertising labels

### Internal data

Never place operational/internal shop data in the public site repository or public shop YAML.

This includes:
- sales priority
- sponsorship negotiation notes
- complaint history
- correction/removal request handling notes
- private contact-person data
- any `notes_internal`

Internal operations data must live in a separate private system and must not be read by the Astro build.

### Data integrity

Never invent:
- shop services
- pricing
- opening hours
- addresses
- phone numbers
- landmarks
- reviews
- rankings

Unknown values must remain `unconfirmed`.

If a shop requests correction or removal:
- do not ignore the request
- do not tie correction/removal to sponsorship
- do not publish internal commentary about the request

### Google Business Profile

Do not create a Google Business Profile for the comparison media or for each region as part of this project.
Do not claim or modify listed shops' Business Profiles without explicit authorization.

### Service data

Do not hard-code the electrical-shop service IDs into engine TypeScript types.
Shop `services` is an ID-keyed map validated against the site's Service definitions.
This must allow another industry to define a completely different service set without rewriting the engine.

### SEO

Never:
- generate city-name swap pages at scale
- generate keyword variation pages with duplicate content
- create a separate page only for 電器屋 / 電気屋 / 電器店 spelling variants
- use 電機屋 as a primary target term
- stuff keywords
- create thin model-number pages
- hide content only for crawlers
- add FAQ solely to obtain FAQ rich results

### Maps

Do not embed Google Maps as the main location UI.

Use:
- local landmark text
- simple SVG/HTML access diagram
- Google Maps as external precision-navigation CTA

Do not copy map screenshots.

Access display mode must be explicitly chosen per shop: `simple_map` or `text_only`.
Do not implement automatic map-mode selection.
Default to `text_only`.
Use `simple_map` only when a human editor confirms the spatial relationships.
Never invent streets, landmarks, walking times, or spatial relationships to complete a map.

### Rendering

Core content must exist in initial HTML.

Do not make:
- shop details
- comparison data
- FAQ
- NAP
- Quick Answer

dependent on client JavaScript.

### Links

Important navigation must use real `<a href>` links.

### Analytics

Do not rename event identifiers casually.

Tracking must use stable data attributes and remain independent of CSS class names.

### Analytics scope

V1 core events:
- `service_select`
- `shop_card_click`
- `shop_page_view`
- `phone_click`
- `official_site_click`
- `map_open_click`
- `ad_impression`
- `ad_click`

Only add `comparison_filter_use` if the filter UI exists.
Do not add `comparison_open`, `access_section_view`, or `shop_list_view` in V1.

`ad_impression` must fire at most once per `ad_id × placement` per page view after the defined visibility threshold.

### Mobile

Do not hide important content on mobile.
Do not insert sponsor ads inside comparison rows/cards.

---

## Implementation Priority

When tradeoffs exist:

1. correctness
2. search intent
3. usability/accessibility
4. performance
5. editorial independence
6. analytics integrity
7. visual polish

---

## V1 Scope Discipline

Prefer the simplest static implementation that satisfies the docs.

Do not add:
- database
- authentication
- complex CMS
- nationwide region selector
- user reviews
- lead marketplace
- paid ranking
- unnecessary SPA state

unless explicitly added to the specs.

---

## File and component conventions

Use the structure described in `06_TECH.md`.

Conventions:
- Astro components: `PascalCase.astro`
- TypeScript modules: `camelCase.ts` or descriptive kebab-free module names consistent with the repo
- group components by responsibility where useful:
  - `components/shops/`
  - `components/services/`
  - `components/sponsors/`
  - `components/access/`
  - `components/common/`
- do not create duplicate components with slightly different names
- reuse shared status/CTA/source components
- do not introduce React/Vue/Svelte unless client-side state truly requires it

## Repository Commands

Do not invent commands.

Inspect:
- `package.json`
- existing README
- CI config

Use existing scripts where available.

Before declaring work complete:
- build
- typecheck if available
- tests if available
- run QA-relevant checks

---

## Completion

A task is not complete just because it renders.

Verify against `/docs/07_QA.md`.

If implementation cannot satisfy a spec, report the exact conflict instead of silently changing product behavior.
