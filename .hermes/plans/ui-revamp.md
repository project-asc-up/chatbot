# UI Revamp Plan — Project ASC Admin Portal

> Status: planning. No code changes yet — awaiting your sign-off on the
> direction before I start touching files.

## Audit summary — what looks bad right now

Walking through what I found in the repo:

**Layout & shell**
- `src/components/admin-shell.tsx` — fixed `w-72` sidebar (288px) with a
  giant `h-14` UP logo, plain white background, blocked on `lg` only.
  Looks like an internal tool from 2019.
- Header is two lines of dead weight — "Make today matter" eyebrow plus
  "Admin Management System" h2 on every single page, taking up valuable
  vertical space.
- The whole shell lives at `max-w-[1600px]` which is wider than most
  laptops — content stretches awkwardly on a 14"' screen.

**Design tokens / CSS** (`src/app/globals.css`)
- `font-display: Georgia` + `font-body: Arial` — the most dated combo on
  the internet. Hard no in 2026.
- Brand colour `#003b7a` (navy) on `#ffffff` is OK, but there is no
  surface palette (`bg-light`, `border`) and everything is hairline grey
  borders — the page reads as flat, not elevated.
- Heavy reliance on `border-[color:var(--color-border)]` everywhere:
  cards, fields, tables, sidebar, header, modals. Visually noisy.
- `--font-body` is exposed in `@theme` as `--font-sans` but Tailwind has
  no actual font loaded — fallback is Arial. No typography scale.
- Shadows are one-size-fits-all `0 12px 40px rgba(0,32,80,0.05)` —
  indistinct, doesn't read as depth.
- Animation keyframes are duplicated (fadeIn, slideUp both appear
  twice). Tech debt.

**Constants & components**
- `Section` / `Field` / `ActionButton` / `CreateButton` / etc. all define
  their own little class blobs and re-inline `transition`, `rounded-full`
  — there are at least 3 ways to make a "primary button" (`ActionButton`,
  raw `<button>` in `create-coach-modal`, `CreateButton`, the header
  `CreateCoachModal` button). No single source of truth.
- Tables (`faculty-table`, `coach-table`, etc.) re-implement the same
  bordered, sep-spaced `<table>` from scratch — there's
  `src/components/searchable-table.tsx` that the new `CoachTable` is
  *not* using. Inconsistent.
- Modal in `src/components/modal.tsx` uses native `<dialog>` with hand
  crafted close icon (SVG path), no footer slot, no sub-header — pages
  have to roll their own footer (see `create-coach-modal.tsx:141`).
- Search input in `coach-table` has no connection to the global
  `SearchBar` in the header — two search patterns, no shared logic.

**Per-page feel**
- Dashboard `src/app/admin/page.tsx` — 5 stat tiles all look the same
  (label uppercase grey, big number). Quick-access is just text links in
  cards. No icon, no CTA button, no data viz — feels like a wireframe.
- Tables — single-row hover bg, no zebra striping, no row index, no
  skeleton/empty state polish. The "View / edit" link is a bordered
  pill instead of an icon button or text link.
- Forms in modals — 12 fields with default `<input>`. No inline help, no
  validation feedback styling, no success toast after submit.

### Top problems (ranked)

1. No visual hierarchy. Everything is one weight, one colour, one
   border. The eye doesn't know where to land.
2. Dated typography. Georgia+Arial screams "government PDF".
3. Inconsistent component primitives. 3 buttons, 2 tables, 2 modals, 2
   searches, all named differently.
4. Wasted chrome. Header tagline + h2 repeats everywhere; sidebar logo
   block takes more space than the nav below it.
5. Token system is half-done. Colours are CSS vars, fonts are
   fallbacks, shadows are inline, spacing is hardcoded per component
   instead of Tailwind tokens.
6. No dark mode. No prefers-color-scheme. No theme switch.

---

## Proposed direction

### 1. Design tokens — finish the job

Rewrite `globals.css` properly:

```
/* Brand */
  --color-brand: oklch(48% 0.16 252)          /* modernised UP navy */
  --color-brand-foreground: oklch(98% 0.01 252)
/* Surface */
  --color-surface:               oklch(99% 0 0)   /* page bg */
  --color-surface-raised:        oklch(100% 0 0)  /* cards */
  --color-surface-sunken:        oklch(97% 0.005 250)
/* Text */
  --color-text:        oklch(20% 0.02 250)
  --color-text-muted:  oklch(45% 0.01 250)
  --color-text-subtle: oklch(60% 0.01 250)
/* Borders — single token, not seven */
  --color-border: oklch(92% 0.005 250)
/* Accent (single accent, drop the red/ochre split) */
  --color-accent: oklch(70% 0.15 65)            /* warm ochre, brighter */
/* Semantic */
  --color-success / --color-warning / --color-danger / --color-info
/* Shadow scale */
  --shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
  --shadow-card, --shadow-popover
/* Radius scale */
  --radius-sm 6px, --radius-md 10px, --radius-lg 14px, --radius-xl 20px
/* Type scale (tailwind tokens) */
  --font-display: "Inter" (loaded via next/font), tight tracking
  --font-sans:   "Inter"
  --font-mono:   "JetBrains Mono"
  --text-xs..7xl as per Tailwind default
```

`oklch` gives consistent perceived contrast across tints — better than
hex for a token system. Switching to Inter (loaded with
`next/font/google`) removes the Georgia/Arial feel without losing
academic neutrality. Load Manrope or Geist if you want a slightly more
modern sans; I'd default to **Inter** for safety.

### 2. Component primitives — collapse duplication

Delete these:
- `dialog.tsx`
- `modal.tsx` (replaced)
- `admin-form.tsx` (replaced)
- `Create*Modal.tsx` (replaced with `<EntityForm>`)
- `*Table.tsx` (replaced with one `<DataTable>`)

Replace with:
```
src/components/ui/
   Button.tsx          (variant: primary|secondary|ghost|danger)
   IconButton.tsx
   Card.tsx            (Card, CardHeader, CardBody, CardFooter)
   Field.tsx           (label + hint + error + children)
   Input.tsx, Textarea, Select, Checkbox, Radio, Switch
   Badge.tsx           (semantic: success/warn/danger/info/neutral)
   Dialog.tsx          (Radix-free, native <dialog>, header+body+footer slots)
   DropdownMenu.tsx
   Tabs.tsx
   Toast.tsx + ToastProvider
   DataTable.tsx       (column def, sort, filter, pagination, empty state)
   EmptyState.tsx
   Skeleton.tsx
   PageHeader.tsx      (eyebrow, title, description, breadcrumbs, actions)
   Stat.tsx            (label, value, trend, icon)
   Avatar.tsx
```

Use `class-variance-authority` (cva) for variant props. Keeps the
className blob out of every page.

### 3. Layout — shrink sidebar, elevate content

New `admin-shell.tsx`:
- Sidebar: `w-64` (256px), no big logo block. Logo + project name in a
  compact 56px row at top. Nav is the rest.
- Sticky header: just breadcrumbs + page title (auto-generated from
  route) + global search. Drop the eyebrow tagline.
- Main content area: `max-w-7xl` (1280px) — not 1600. Padding
  `px-6 lg:px-10 py-8`.
- Mobile: slide-out sheet for sidebar (use `<dialog>` as drawer).

### 4. Dashboard — make it a dashboard

`/admin` should not be a wireframe. Build:
- 4 KPI Stat cards (Faculties, Coaches, Programmes, FAQs) with icon,
  delta vs last week, and a sparkline (7-day count from Prisma).
- Recent activity (last 10 admin actions from an audit log table — if
  we don't have audit, stub for now).
- "Quick actions" with 3 icon-led Cards linking to common tasks.
- Coverage cards: "X faculties synced", "X coaches missing
  verification".
- Replace the dead uniform stat tiles with real hierarchy: large
  number top-left, small label bottom-right, subtle gradient on the
  card.

### 5. Tables — one component to rule them all

`DataTable<T>` that takes:
- `columns: ColumnDef<T>[]`
- `data: T[]`
- `searchKeys?: (keyof T)[]`
- `pageSize?: number`
- `emptyState?: ReactNode`
- `toolbar?: ReactNode` (so each page can drop its "Create" button in)

Replaces 7 hand-rolled tables. Renders sticky header, pagination,
search, zebra rows, hover row, keyboard nav, semantic badges for
status enums, action column with icon buttons (eye, pencil, trash).

### 6. Forms & modals — fewer fields per page, better feedback

- All create/edit forms go through one `Dialog` with a typed schema.
  Convert the existing `create-coach-modal.tsx` (which has 14 fields
  in one modal) into a **stepped** form: Identity → Contact → Role →
  Review. Saves the user from the wall of inputs.
- Add inline validation with `--color-danger`, helper text, success
  toast after submit.
- Required fields marked with `aria-required`, not asterisks.

### 7. Motion & accessibility

- Keep the existing keyframes but consolidate to one set.
- Add `prefers-reduced-motion` handler globally (already done in file,
  just consolidate).
- Real focus ring: `ring-2 ring-[var(--color-accent)] ring-offset-2`.
  Current ring is `outline` 3px yellow which clashes with content.
- All buttons get `aria-label` when icon-only. Dialogs get
  `aria-labelledby` and trap focus.

### 8. Dark mode

Add `.dark` class via a toggle in the header (sun/moon icon, persisted
in `localStorage`). Override the colour tokens under `.dark`:
- `--color-surface`: oklch(15% 0.01 250)
- `--color-text`: oklch(94% 0.005 250)
- `--color-border`: oklch(28% 0.01 250)
- Brand stays the same, accent brightens slightly.

Charts / tables need explicit dark variants (or just use colour-mix'd
muted vars).

### 9. Charts & data viz

Add **Recharts** as a dep (lightweight, no shadcn needed):
- Dashboard: 30-day content add/remove line chart per entity type.
- Health page (`/admin/health`): bar chart of stale records by
  faculty.

---

## Execution plan (proposed phases)

### Phase 1 — Foundations (no visual change yet)
1. Rewrite `src/app/globals.css` tokens (colour, font, shadow, radius,
   spacing scale). Add Inter via `next/font/google` in `layout.tsx`.
2. Add dependencies: `clsx`, `tailwind-merge`, `class-variance-authority`.
3. Build `src/components/ui/` primitives: Button, Card, Field, Input,
   Textarea, Select, Checkbox, Badge, Dialog.
4. Add `src/lib/cn.ts` (Tailwind class merger).
5. Verify lint, typecheck, build still pass.

### Phase 2 — Replace shell + dashboard
6. Rewrite `admin-shell.tsx` with the smaller sidebar + slim header.
7. Rebuild `/admin/page.tsx` as a real dashboard with KPI Stat cards +
   recent activity + quick actions.
8. Add dark mode toggle + provider.

### Phase 3 — Tables & forms standardisation
9. Build `DataTable<T>` primitive.
10. Migrate `faculty-table`, `coach-table`, `programme-table`,
    `resource-table`, `faq-table`, `course-module-table` to it. Drop
    the dead `searchable-table.tsx` if unused.
11. Rebuild `Dialog` with footer slot + stepped form pattern. Migrate
    the 6 `create-*-modal.tsx` files.
12. Toast on submit success.

### Phase 4 — Polish & motion
13. Consolidate keyframes; remove duplicates.
14. Add Skeleton to tables/cards on load.
15. Empty states per page ("No coaches yet — Create your first one").
16. Final pass: focus rings, keyboard nav, contrast WCAG AA check.

### Phase 5 — Charts (optional)
17. Add Recharts to `/admin` and `/admin/health`.

I'd suggest **Phase 1 → 2 → 3 → 4** as the must-haves. Phase 5 is a nice
to-have — say the word and I'll do it.

---

## Out of scope (intentionally)

- Backend refactor — UI revamp only. No DB changes except optional
  audit-log table (Phase 2 dashboard).
- Auth flow — Clerk (per your stack preference) not in this task.
- Chatbot-facing experience — this is the admin portal only.
- Internationalisation — single locale (en-ZA) content stays the same.

---

## Risks

1. **DataTable migration** touches every list page. Risk: breaking a
   server component by making it need `'use client'`. Mitigation: keep
   the page server-rendered, hand `data` into a client `<DataTable>`.
2. **Dark mode** introduces a flash on first paint if the class is set
   via useEffect. Mitigation: inline script in `<head>` reads
   `localStorage` before hydration.
3. **Token migration** = every other file will have broken Tailwind
   classes. Phase 1 must include a global sed sweep from old CSS-vars
   to Tailwind utilities.
4. **Custom fonts via next/font** can cause CLS if not preloaded. We
   preload with `display: 'swap'`.

---

## Recommendation

Sign off on the **direction** (tokens, primitives, phased plan, dark
mode yes/no, charts yes/no) and I'll start with Phase 1.

Two clarifications I need from you:

1. **Dark mode — yes or no?** It's quick to add but adds testing surface.
2. **Charts — yes or no?** If yes I add Recharts now; if no we keep the
   dashboard text-only.

Once you answer, I start Phase 1: tokens + primitives + Inter font.
