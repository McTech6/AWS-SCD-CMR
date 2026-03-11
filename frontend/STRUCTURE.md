# AWS Student Community Day — Frontend Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, Toaster)
│   ├── page.tsx            # Landing (/)
│   ├── globals.css         # Design tokens, grain overlay
│   ├── register/           # /register
│   ├── speak/              # /speak (Call for Speakers)
│   ├── speakers/           # /speakers
│   └── admin/              # /admin (protected)
│
├── components/
│   ├── ui/                 # Base primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── divider.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   ├── spinner.tsx
│   │   ├── progress-bar.tsx
│   │   └── index.ts
│   │
│   └── layout/             # Page structure
│       ├── navbar.tsx
│       ├── footer.tsx
│       ├── section.tsx
│       ├── grid.tsx
│       ├── page-wrapper.tsx
│       └── index.ts
│
├── lib/
│   ├── utils.ts            # cn() helper
│   └── mock-data.ts        # Mock attendees, speakers, agenda
│
├── types/
│   └── index.ts            # Attendee, Speaker, etc.
│
└── hooks/
    └── index.ts            # Custom hooks
```

## Imports

- `@/components/ui` — Button, Card, Badge, Input, etc.
- `@/components/layout` — Navbar, Footer, Section, Grid
- `@/lib/utils` — cn()
- `@/lib/mock-data` — mockAttendees, mockSpeakers
- `@/types` — Attendee, Speaker, SwagItem, etc.
