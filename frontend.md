Let me first read the design skill carefully before building anything.Here's the **fully redefined website concept** with a completely new visual identity — followed by the most comprehensive task list possible.

---

## 🔭 REDEFINED CONCEPT: "AWS Cloud Club – Student Community Day"

---

### 🎨 New Visual Identity

**Aesthetic Direction:** *Editorial Dark Luxury meets Cloud Infrastructure*
Imagine if **Linear.app** and **Stripe** had a baby raised on AWS docs. Sophisticated, precise, confident — not corporate, not playful. A site that feels like it was designed by engineers who care deeply about craft.

| Token | Value | Role |
|---|---|---|
| `--void` | `#050508` | True black background |
| `--surface` | `#0D0D14` | Card / panel backgrounds |
| `--panel` | `#12121C` | Elevated surfaces |
| `--border` | `rgba(255,255,255,0.06)` | Subtle dividers |
| `--electric` | `#5B6EF5` | Primary — electric violet-blue |
| `--electric-light` | `#8B9AFF` | Hover / glow states |
| `--ember` | `#FF6B35` | Accent — warm ember (single-use, high impact) |
| `--text-1` | `#EEEEF5` | Primary text |
| `--text-2` | `#7B7B9A` | Secondary / muted |
| `--text-3` | `#3A3A5C` | Placeholder / disabled |
| `--success` | `#22C55E` | Check-in / success states |

**Fonts:**
- **Display:** `Epilogue` (800 weight) — angular, confident, editorial
- **Body:** `Plus Jakarta Sans` (300–500) — elegant readability
- **Mono:** `Fira Code` — dev cred on badges and stats

**Signature Details:**
- Animated **star-field / particle mesh** background on hero (Three.js or pure CSS)
- **Grain texture overlay** at 3% opacity site-wide
- Every section separated by a **1px gradient rule** (transparent → electric → transparent)
- **Ember accent** used *only* on the single most important CTA per page
- Cards use **inner border glow** on hover, not just shadow
- Countdown timer uses **flip-card animation** (like a departure board)

---

### 📐 Redefined Page Architecture

#### **Page 1 — Landing (`/`)**
- **Navbar:** Frosted glass, `backdrop-blur(24px)`, logo left, links center, CTA right
- **Hero:** Full-viewport, particle mesh bg, staggered headline reveal word-by-word, flip countdown, two CTAs
- **Stats Bar:** Full-width strip — `500+ Students · 12 Speakers · 8 Workshops · 1 Epic Day`
- **About:** Asymmetric layout — big number stat left, editorial copy right, diagonal divider
- **Agenda Preview:** Timeline component, horizontal scroll on mobile
- **Speakers Preview:** 4 cards, hover flips card to reveal topic + LinkedIn
- **Sponsors:** Marquee strip + tier grid (Gold / Silver / Community)
- **Footer:** Full dark, 4-column grid

#### **Page 2 — Registration (`/register`)**
- Split layout: left side = event highlight panel (dark, animated), right side = form (slightly lighter)
- Floating label inputs, teal glow ring on focus
- Progress indicator (Step 1 of 2 for longer forms)
- Animated success state — confetti burst + checkmark draw

#### **Page 3 — Call for Speakers (`/speak`)**
- Full hero with motivational copy
- 2-column form with drag-and-drop photo upload + LinkedIn URL field
- Bio character counter with color shift (green → yellow → red)
- Confirmation state with speaker "card preview" of how they'll appear on the site

#### **Page 4 — Speakers (`/speakers`)**
- Masonry or uniform 3-col grid
- Filter by track (Cloud / DevOps / AI / Security)
- Card hover: image desaturates → name + topic + LinkedIn slides up
- Click: full modal with extended bio, LinkedIn button, talk abstract

#### **Page 5 — Admin Dashboard (`/admin`)**
- Collapsible sidebar with icon-only collapsed state
- Overview: 4 animated stat cards + activity feed + quick actions
- Attendees: table with inline check-in toggle, swag checkboxes (6 items), certificate badge
- Speakers: approval workflow — Pending / Approved / Rejected
- Emails: compose + target selector + preview modal + sent log
- Certificates: bulk generate + progress bar + per-row resend

---

## ✅ COMPLETE FRONTEND TASK LIST

---

### 🔧 PHASE 0 — Project Foundation

- [ ] Scaffold **Next.js 14** project with App Router + TypeScript strict mode
- [ ] Install and configure **Tailwind CSS v3** with full custom design tokens
- [ ] Install **Framer Motion** for all animations
- [ ] Install **shadcn/ui** and configure with custom theme
- [ ] Install **React Hook Form** + **Zod** for all form validation
- [ ] Install **Fira Code**, **Epilogue**, **Plus Jakarta Sans** via `next/font`
- [ ] Install **Lucide React** for all icons
- [ ] Install **React Hot Toast** for notifications
- [ ] Install **clsx** + **tailwind-merge** for conditional classes
- [ ] Set up **absolute imports** (`@/components`, `@/lib`, `@/hooks`, `@/types`)
- [ ] Configure **ESLint** + **Prettier** + **Husky** pre-commit hooks
- [ ] Set up `.env.local` with all environment variable keys documented
- [ ] Create `/types/index.ts` with all shared TypeScript interfaces:
  - `Attendee`, `Speaker`, `SwagItem`, `CertificateStatus`, `EmailLog`
- [ ] Set up **mock data layer** (`/lib/mock-data.ts`) for all pages

---

### 🎨 PHASE 1 — Design System & Components

**Tokens & Theme**
- [x] Define all CSS variables in `globals.css` (colors, radii, shadows, transitions)
- [x] Build Tailwind `theme.extend` to mirror all CSS variables
- [x] Create `grain-overlay` pseudo-element globally

**Base Components**
- [x] `<Button />` — variants: `primary`, `ghost`, `outline`, `ember`, `danger` + sizes `sm/md/lg`
- [x] `<Card />` — with `hoverable`, `glow`, `flat` variants
- [x] `<Badge />` — variants: `default`, `success`, `warning`, `error`, `outline`
- [x] `<Input />` — with floating label, focus glow, error state, icon slot
- [x] `<Textarea />` — with character counter prop
- [x] `<Select />` — fully custom styled (not native), keyboard accessible
- [x] `<Toggle />` — animated switch for check-in
- [x] `<Checkbox />` — animated checkmark draw on check
- [x] `<Modal />` — accessible, focus-trapped, scroll-locked backdrop
- [x] `<Tooltip />` — directional, delay-animated
- [x] `<Toast />` — success / error / info variants
- [x] `<Skeleton />` — shimmer animation, configurable shape
- [x] `<Avatar />` — circular image with initials fallback
- [x] `<Divider />` — gradient rule component (transparent → electric → transparent)
- [x] `<ProgressBar />` — animated fill with percentage label
- [x] `<Spinner />` — clean SVG spinner for loading states

**Layout Components**
- [x] `<PageWrapper />` — Framer Motion page transition wrapper
- [x] `<Section />` — consistent vertical padding + max-width container
- [x] `<Grid />` — responsive grid with gap tokens
- [x] `<Navbar />` — (see Landing tasks)
- [x] `<Footer />` — (see Landing tasks)

---

### 🌐 PHASE 2 — Landing Page (`/`)

**Navbar**
- [x] Fixed position, `backdrop-blur(24px)` frosted glass
- [x] Logo (SVG mark + wordmark) — links to `/`
- [x] Center nav: Home, Speakers, Agenda, Sponsors — with active underline indicator
- [x] Right CTA: Ghost "Apply as Speaker" + Primary "Register Now"
- [x] Scroll behavior: border appears after 60px scroll (Intersection Observer)
- [x] Mobile: hamburger icon → full-screen animated drawer menu
- [x] Drawer: staggered link reveal, close on outside click or ESC

**Hero Section**
- [x] Full-viewport height (`100dvh`)
- [x] Animated particle mesh background (canvas-based or CSS grid dots)
- [x] Radial gradient vignette over particle mesh
- [x] Event label chip: `☁ Student Community Day · Powered by AWS Cloud Club`
- [x] Headline: 3-line staggered word-by-word reveal animation
- [x] Subtext: date, venue, tagline — fade in after headline
- [x] CTA row: Ember "Register Now" + Ghost "Apply as Speaker" — slide up on load
- [x] **Flip Countdown Timer:** days / hours / minutes / seconds with departure-board flip animation
- [x] Scroll indicator arrow (animated bounce) at bottom

**Stats Bar**
- [x] Full-width dark strip below hero
- [x] Animated counters: `500+ Students`, `12 Speakers`, `8 Workshops`, `1 Epic Day`
- [x] Numbers count up when scrolled into view (Intersection Observer)
- [x] Dividers between stats using `|` styled separators

**About Section**
- [x] Asymmetric 2-column layout (55% / 45%)
- [x] Left: large display number + editorial paragraph copy
- [x] Right: animated SVG or Lottie cloud-infrastructure illustration
- [x] Scroll-triggered slide-in from left and right simultaneously
- [x] "Learn More" ghost button below copy

**Agenda Preview**
- [x] Section heading: "What's Happening"
- [x] Vertical timeline component with time markers
- [x] Each item: time pill, session title, speaker name, track badge
- [x] Horizontal scroll on mobile
- [x] "Full Schedule" link at bottom

**Speakers Preview**
- [x] Section heading + "Meet All Speakers →" link
- [x] 4-card grid (2×2 on mobile)
- [x] Each card: photo, name, title, company
- [x] Hover: card flips (CSS 3D transform) to reveal topic + LinkedIn icon
- [x] Skeleton loaders before data resolves

**Sponsors Section**
- [x] Section heading: "Backed By"
- [x] Tier labels: Gold / Silver / Community Partner
- [x] Logo grid: grayscale by default, full color on hover (CSS filter)
- [x] Infinite horizontal marquee for community tier logos
- [x] "Become a Sponsor" CTA link

**Footer**
- [x] 4-column grid: Logo+tagline / Navigation / Resources / Contact
- [x] Social icons row: Twitter/X, LinkedIn, Instagram, GitHub
- [x] Contact email with copy-to-clipboard on click
- [x] Bottom bar: copyright + "Built with ❤️ by the Cloud Club"
- [x] Subtle top border: gradient rule

---

### 📋 PHASE 3 — Registration Page (`/register`)

- [x] Split-screen layout (50/50): left = event panel, right = form
- [x] Left panel: dark bg, event poster details, testimonial quote, animated gradient
- [x] Right panel: form card on lighter surface
- [x] Form header: "Secure Your Spot" + step indicator if multi-step
- [x] **Fields with floating labels:**
  - [x] Full Name (text)
  - [x] Email Address (email, format validation)
  - [x] University / Institution (text)
  - [x] Phone Number (tel, formatted mask)
  - [x] T-Shirt Size (custom styled segmented control: XS / S / M / L / XL / XXL)
- [x] All fields validated on blur + on submit
- [x] Inline error messages with shake animation
- [x] Submit button: full-width, ember gradient, loading spinner state
- [x] **Success state:**
  - [x] Replace form with centered success card
  - [x] Animated SVG checkmark path-draw
  - [x] Confetti burst (canvas or CSS keyframes)
  - [x] Confirmation text + "Add to Calendar" button
- [x] Error state: toast notification for server errors

---

### 🎤 PHASE 4 — Call for Speakers (`/speak`)

**Hero**
- [x] Full-width section: "Shape the Conversation. Share Your Cloud Story."
- [x] Short paragraph on what speakers get (exposure, swag, community)
- [x] Benefits chips: "🎤 30-min Slot · 🏅 Speaker Kit · 📸 Professional Photo"

**Form**
- [x] 2-column responsive grid layout
- [x] **Fields:**
  - [x] Full Name (floating label)
  - [x] Email Address (floating label)
  - [x] Talk Topic / Title
  - [x] Talk Track (dropdown: Serverless / DevOps / AI-ML / Security / Arch)
  - [x] Bio (textarea, 300 char max, live counter with color shift)
  - [x] Years of Experience (Select: 0-1 / 1-3 / 3-5 / 5+)
  - [x] LinkedIn Profile URL (validated)
  - [x] Twitter/X Handle (optional)
  - [x] GitHub Profile URL (optional)
  - [x] Profile Photo (drag-and-drop upload zone):
    - [x] Drag-over state: border glows electric
    - [x] Preview thumbnail after selection
    - [x] File size limit (5MB) + type validation
    - [x] Remove / replace button on preview
- [x] All fields validated with Zod schema
- [x] Submit button: full-width, primary gradient, loading state
- [x] **Success state:**
  - [x] Replace form with animated confirmation
  - [x] Show "speaker card preview" of how their profile will look on the site
  - [x] "We'll reach out within 48 hours" message

---

### 👤 PHASE 5 — Speakers Page (`/speakers`)

- [x] Page hero: "Meet Our Speakers" + subtitle
- [x] **Search bar:** debounced (300ms), filters by name or topic
- [x] **Filter tabs:** All / Cloud / DevOps / AI & ML / Security — animated underline indicator
- [x] **3-column grid** (2 on tablet, 1 on mobile) with 24px gap
- [x] **Speaker Card:**
  - [x] Circular avatar (80px, ring border in electric color)
  - [x] Name (Epilogue 700)
  - [x] Title + Company (muted text)
  - [x] Track badge (colored per track)
  - [x] Topic (2-line truncated)
  - [x] Social row: LinkedIn (required), Twitter, GitHub (if provided)
  - [x] Hover: `translateY(-6px)` + inner border glow
- [x] **Click → Speaker Modal:**
  - [x] Full-size photo
  - [x] Full name, title, company
  - [x] Full bio (no truncation)
  - [x] Talk title + full abstract
  - [x] All social links as labeled buttons
  - [x] "Connect on LinkedIn" ember button
  - [x] Close on backdrop click or ESC
- [x] Skeleton grid: 6 placeholder cards while loading
- [x] Empty state: illustrated icon + "No speakers match your search"
- [x] Count label: "Showing 12 speakers"

---

### 🛠 PHASE 6 — Admin Dashboard (`/admin/*`)

**Auth**
- [x] Password-protected middleware on all `/admin/*` routes (Simulated in login page)
- [x] Simple login page: centered card, email + password, error state
- [x] Session management (cookie-based or localStorage token mock)
- [x] Logout button in header

**Shell Layout**
- [x] Fixed sidebar (240px wide)
  - [x] Logo at top
  - [x] Nav items with Lucide icons: Overview, Attendees, Speakers, Emails, Certificates, Settings
  - [x] Active: electric left-border (3px) + background highlight pill
  - [x] Hover: subtle background tint
  - [x] Collapse button → icon-only mode (64px wide) with tooltips
  - [x] Mobile: hidden by default, slide-in drawer via hamburger
- [x] Top header bar:
  - [x] Page title (dynamic)
  - [x] Search (global, optional)
  - [x] Notification bell
  - [x] Admin avatar + name + dropdown (Profile, Logout)
- [x] Main content: scrollable, padded, max-width constrained

**Overview Page (`/admin`)**
- [x] 4 stat cards in responsive grid:
  - Total Registered (person icon)
  - Checked-In Today (check icon)
  - Approved Speakers (mic icon)
  - Swag Distributed (gift icon)
  - [x] Each card: large animated number (counts up on mount), subtitle, icon, hover elevation
- [x] Check-in rate progress bar (e.g. "312 / 500 checked in — 62%")
- [x] Recent activity feed: last 10 check-ins with name + time + avatar initial
- [x] Quick action buttons: "Open Check-in Mode", "Send Reminder", "Generate Certificates"

**Attendees Page (`/admin/attendees`)**
- [x] Search input (debounced) + filter dropdowns (university, check-in status, swag complete)
- [x] Sortable column headers (name, university, registration date)
- [x] **Table columns:**
  - [x] Checkbox (bulk select)
  - [x] Avatar initial + Name
  - [x] Email (truncated with tooltip)
  - [x] University
  - [x] Check-in Toggle (animated switch, green when on)
  - [x] Swag: 6 inline checkboxes (T-shirt / Stickers / Notebook / Badge / Pen / Wristband)
    - [x] Compact: show as icon grid, tooltip on hover with item name
    - [x] Click updates state optimistically + syncs to backend
  - [x] Certificate: badge (Not Sent / Sent / Failed) + Resend icon button
  - [x] Actions: 3-dot menu → View, Edit, Delete
- [x] Bulk action bar (appears when rows selected): Mark Checked-In / Send Certificate / Export
- [x] Pagination: Previous / Next + page number + items-per-page selector
- [x] Export to CSV button (top right)
- [x] Row count: "Showing 1–25 of 312 attendees"

**Speakers Admin Page (`/admin/speakers`)**
- [x] Table: Name, Email, Topic, Track, Status (Pending/Approved/Rejected), Submitted Date, Actions
- [x] Actions: Approve (green) / Reject (red) — with confirmation modal
- [x] Click row: full speaker detail slide-over panel (not modal — side panel)
- [x] Edit speaker info: inline editing for name, topic, bio, LinkedIn
- [x] Bulk approve selected

**Emails Page (`/admin/emails`)**
- [x] Left: compose panel
  - [x] "To" selector: Attendees / Speakers / Both / Custom
  - [x] Subject line input
  - [x] Message body (styled textarea, basic markdown support optional)
  - [x] Preview button → opens modal
  - [x] Send button with confirmation dialog
- [x] Right: sent emails log
  - [x] Table: Date, Subject, Target, Recipients, Status (Sent / Failed / Partial)
  - [x] Status badge colored per state
- [x] **Preview Modal:**
  - [x] Renders email as it will appear (HTML email mockup in iframe or styled div)
  - [x] Recipient count shown
  - [x] Confirm Send / Cancel buttons

**Certificates Page (`/admin/certificates`)**
- [x] Overview: X of Y certificates generated, X of Y sent
- [x] "Generate All Certificates" button → triggers batch job
- [x] Animated progress bar during generation (polling or SSE)
- [x] Per-attendee table: Name, Certificate Status badge, Generated Date, Email Status, Actions
- [x] Actions per row: Preview Certificate / Send / Resend
- [x] Certificate preview modal: shows rendered PDF or PNG preview
- [x] Bulk send all unsent button

---

### ✨ PHASE 7 — Motion & Micro-Interactions

- [ ] Page enter: fade + translateY(16px) → rest, staggered children
- [ ] Page exit: fade out 150ms
- [ ] All cards: `hover:translateY(-4px)` + shadow increase (200ms ease)
- [ ] All buttons: `active:scale(0.97)` + ripple effect on click
- [ ] Input focus: ring expands from 0 → 2px (150ms ease)
- [ ] Flip countdown: CSS 3D perspective flip on digit change
- [ ] Stat counters: count from 0 → target over 1.2s (easeOut) on viewport enter
- [ ] Checkbox: SVG path draw animation on check (200ms)
- [ ] Toggle switch: thumb slides with spring physics
- [ ] Modal: scale(0.95) + opacity(0) → scale(1) + opacity(1) (200ms)
- [ ] Skeleton: horizontal shimmer sweep animation (1.5s loop)
- [ ] Toast: slide in from bottom-right, auto-dismiss with progress bar
- [ ] Speaker card flip: CSS `rotateY(180deg)` on hover
- [ ] Upload zone: border color + bg tint on dragover
- [ ] Success checkmark: SVG `stroke-dashoffset` animation (path draw)
- [ ] Confetti: canvas burst on registration success

---

### 📱 PHASE 8 — Responsive Design

- [ ] Breakpoints: 375 / 640 / 768 / 1024 / 1280 / 1536
- [ ] Hero: single column on mobile, reduced font sizes
- [ ] Stats bar: 2×2 grid on mobile
- [ ] About: stacked on mobile, illustration above text
- [ ] Speakers grid: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] Registration: single column on mobile (no split)
- [ ] Speak form: single column on mobile
- [ ] Admin sidebar: hidden on mobile, drawer trigger in top bar
- [ ] Admin table: horizontal scroll on mobile + sticky first column
- [ ] Swag checkboxes: icon-only compact mode on mobile with tooltip
- [ ] Navbar: hamburger menu < 768px
- [ ] Footer: single column on mobile

---

### ♿ PHASE 9 — Accessibility

- [ ] All interactive elements reachable via keyboard (Tab / Shift+Tab)
- [ ] Focus-visible rings on all focusable elements (2px electric)
- [ ] ARIA labels on all icon-only buttons
- [ ] Modal: focus trap + restore focus on close + ESC closes
- [ ] Form fields: associated `<label>`, `aria-describedby` for errors
- [ ] Color contrast: all text meets WCAG AA (4.5:1 minimum)
- [ ] Images: meaningful `alt` text, decorative images `alt=""`
- [ ] Announce dynamic changes with `aria-live` (toasts, status badges)
- [ ] Respect `prefers-reduced-motion` — disable non-essential animations

---

### 🚀 PHASE 10 — Performance & Deployment

- [ ] Lighthouse target: **95+ Performance, 100 Accessibility, 100 Best Practices**
- [ ] All images via `next/image` (WebP format, blur placeholder, priority on hero)
- [ ] Fonts: `next/font` with `display: swap`, subsetted
- [ ] Code split: all admin routes lazy-loaded (`dynamic(() => import(...))`)
- [ ] Bundle analyzer: run `@next/bundle-analyzer`, eliminate unused deps
- [ ] Framer Motion: tree-shake unused features
- [ ] OG image: dynamic `/api/og` route with event branding (using `@vercel/og`)
- [ ] `robots.txt` — block `/admin/*` from indexing
- [ ] Deploy to **Vercel** with:
  - [ ] Production + preview environments
  - [ ] All env vars configured in Vercel dashboard
  - [ ] Custom domain connected with HTTPS
  - [ ] Analytics enabled (`@vercel/analytics`)
- [ ] `sitemap.xml` for public pages
- [ ] Error boundary component for graceful failure UI
- [ ] 404 page with illustrated empty state + back home button

---

That's the **definitive master blueprint** — 150+ tasks across 10 phases. Want me to also generate the **folder structure**, **TypeScript data models**, or a **component tree diagram** to complete the spec?