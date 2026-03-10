## 🗄️ Prisma Schema (PostgreSQL)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────

enum Role {
  ATTENDEE
  SPEAKER
  ADMIN
}

enum TShirtSize {
  XS
  S
  M
  L
  XL
  XXL
}

enum SpeakerStatus {
  PENDING
  APPROVED
  REJECTED
}

enum SpeakerTrack {
  CLOUD_FUNDAMENTALS
  DEVOPS
  AI_ML
  SECURITY
  OPEN_SOURCE
}

enum ExperienceLevel {
  ZERO_TO_ONE
  ONE_TO_THREE
  THREE_TO_FIVE
  FIVE_PLUS
}

enum CertificateStatus {
  NOT_GENERATED
  GENERATED
  SENT
  FAILED
}

enum EmailTarget {
  ATTENDEES
  SPEAKERS
  BOTH
  CUSTOM
}

enum EmailStatus {
  SENT
  FAILED
  PARTIAL
  DRAFT
}

enum SponsorTier {
  GOLD
  SILVER
  COMMUNITY
}

enum AgendaTrack {
  MAIN_STAGE
  WORKSHOP
  PANEL
  NETWORKING
  OPENING
  CLOSING
}

// ─────────────────────────────────────────
// USER (shared auth identity)
// ─────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String?
  role          Role      @default(ATTENDEE)
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  attendee      Attendee?
  speaker       Speaker?
  admin         Admin?
  sessions      Session[]

  @@map("users")
}

// ─────────────────────────────────────────
// SESSION (auth sessions)
// ─────────────────────────────────────────

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique @default(cuid())
  expiresAt DateTime
  createdAt DateTime @default(now())
  ipAddress String?
  userAgent String?

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
  @@map("sessions")
}

// ─────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────

model Admin {
  id        String   @id @default(cuid())
  userId    String   @unique
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("admins")
}

// ─────────────────────────────────────────
// ATTENDEE
// ─────────────────────────────────────────

model Attendee {
  id           String     @id @default(cuid())
  userId       String     @unique
  university   String
  phone        String?
  tshirtSize   TShirtSize
  checkedIn    Boolean    @default(false)
  checkedInAt  DateTime?
  registeredAt DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  swag         SwagRecord?
  certificate  Certificate?

  @@index([checkedIn])
  @@map("attendees")
}

// ─────────────────────────────────────────
// SWAG RECORD (per attendee)
// ─────────────────────────────────────────

model SwagRecord {
  id          String   @id @default(cuid())
  attendeeId  String   @unique
  tshirt      Boolean  @default(false)
  stickers    Boolean  @default(false)
  notebook    Boolean  @default(false)
  badge       Boolean  @default(false)
  pen         Boolean  @default(false)
  wristband   Boolean  @default(false)
  updatedAt   DateTime @updatedAt
  updatedBy   String?  // admin user id

  attendee    Attendee @relation(fields: [attendeeId], references: [id], onDelete: Cascade)

  @@map("swag_records")
}

// ─────────────────────────────────────────
// SPEAKER
// ─────────────────────────────────────────

model Speaker {
  id              String          @id @default(cuid())
  userId          String          @unique
  topic           String
  talkTitle       String
  talkAbstract    String?
  bio             String
  track           SpeakerTrack
  experienceLevel ExperienceLevel
  status          SpeakerStatus   @default(PENDING)
  linkedinUrl     String
  twitterHandle   String?
  githubUrl       String?
  photoUrl        String?
  photoKey        String?         // S3 / storage key
  reviewNote      String?         // Admin note on approval/rejection
  reviewedAt      DateTime?
  reviewedBy      String?         // Admin user id
  submittedAt     DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  featured        Boolean         @default(false)
  sortOrder       Int             @default(0)

  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([status])
  @@index([track])
  @@map("speakers")
}

// ─────────────────────────────────────────
// CERTIFICATE
// ─────────────────────────────────────────

model Certificate {
  id           String            @id @default(cuid())
  attendeeId   String            @unique
  status       CertificateStatus @default(NOT_GENERATED)
  fileUrl      String?
  fileKey      String?           // S3 / storage key
  generatedAt  DateTime?
  sentAt       DateTime?
  failedAt     DateTime?
  failReason   String?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  attendee     Attendee          @relation(fields: [attendeeId], references: [id], onDelete: Cascade)

  @@index([status])
  @@map("certificates")
}

// ─────────────────────────────────────────
// EMAIL LOG
// ─────────────────────────────────────────

model EmailLog {
  id             String      @id @default(cuid())
  subject        String
  body           String
  target         EmailTarget
  status         EmailStatus @default(DRAFT)
  recipientCount Int         @default(0)
  successCount   Int         @default(0)
  failCount      Int         @default(0)
  sentAt         DateTime?
  createdAt      DateTime    @default(now())
  sentBy         String      // admin user id

  recipients     EmailRecipient[]

  @@index([status])
  @@index([createdAt])
  @@map("email_logs")
}

// ─────────────────────────────────────────
// EMAIL RECIPIENT (per-email delivery record)
// ─────────────────────────────────────────

model EmailRecipient {
  id          String      @id @default(cuid())
  emailLogId  String
  recipientEmail String
  recipientName  String
  delivered   Boolean     @default(false)
  failReason  String?
  deliveredAt DateTime?

  emailLog    EmailLog    @relation(fields: [emailLogId], references: [id], onDelete: Cascade)

  @@index([emailLogId])
  @@map("email_recipients")
}

// ─────────────────────────────────────────
// SPONSOR
// ─────────────────────────────────────────

model Sponsor {
  id        String      @id @default(cuid())
  name      String
  logoUrl   String
  logoKey   String?
  website   String?
  tier      SponsorTier
  sortOrder Int         @default(0)
  visible   Boolean     @default(true)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  @@index([tier])
  @@map("sponsors")
}

// ─────────────────────────────────────────
// AGENDA ITEM
// ─────────────────────────────────────────

model AgendaItem {
  id          String      @id @default(cuid())
  title       String
  description String?
  startTime   DateTime
  endTime     DateTime
  track       AgendaTrack
  location    String?
  speakerId   String?
  sortOrder   Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([startTime])
  @@map("agenda_items")
}

// ─────────────────────────────────────────
// EVENT CONFIG (single-row settings table)
// ─────────────────────────────────────────

model EventConfig {
  id                String   @id @default(cuid())
  eventName         String   @default("AWS Cloud Club Student Community Day")
  eventDate         DateTime
  eventEndDate      DateTime?
  venue             String
  venueAddress      String?
  tagline           String?
  registrationOpen  Boolean  @default(true)
  speakerAppsOpen   Boolean  @default(true)
  maxAttendees      Int      @default(500)
  contactEmail      String
  updatedAt         DateTime @updatedAt

  @@map("event_config")
}
```

---

## ✅ Backend Task List

---

### 🔧 PHASE 0 — Project Setup

- [ ] Initialize **Node.js** project with TypeScript (`tsconfig.json` strict mode)
- [ ] Choose and scaffold framework: **Next.js API Routes** (if monorepo) or standalone **Express / Fastify / Hono**
- [x] Install **Prisma** + `@prisma/client`
- [x] Run `prisma init` and set `provider = "postgresql"`
- [x] Set `DATABASE_URL` in `.env` (local Postgres via Docker or Neon/Supabase)
- [x] Paste full schema above into `prisma/schema.prisma`
- [x] Run `prisma migrate dev --name init` — verify all tables created
- [x] Run `prisma generate` — generate typed client
- [x] Create `lib/prisma.ts` singleton client (prevent hot-reload connection flooding)
- [x] Install **Zod** for all request validation
- [x] Install **bcryptjs** for password hashing
- [x] Install **jsonwebtoken** or **jose** for JWT auth
- [ ] Install **nodemailer** or **Resend SDK** for emails
- [ ] Install **AWS SDK v3** (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) for file uploads
- [ ] Install **PDFKit** or **Puppeteer** for certificate generation
- [ ] Set up centralized error handler middleware
- [ ] Set up centralized request logger (Pino or Winston)
- [ ] Set up `lib/response.ts` — standardized API response helpers (`success()`, `error()`, `paginated()`)
- [x] Configure **CORS** for frontend origin
- [x] Configure **Helmet** for security headers
- [ ] Configure **rate limiter** (`express-rate-limit` or equivalent)
- [ ] Set up **Docker Compose** for local Postgres + Redis (optional queue)
- [x] Create `prisma/seed.ts` with full seed data (event config, mock attendees, speakers, sponsors)
- [x] Run `prisma db seed` and verify

---

### 🔐 PHASE 1 — Authentication

- [x] `POST /api/auth/register`
  - [x] Validate body with Zod (name, email, password)
  - [x] Check email not already registered
  - [x] Hash password with bcrypt (12 rounds)
  - [x] Create `User` + `Attendee` record in transaction
  - [x] Return JWT access token + user object
- [x] `POST /api/auth/login`
  - [x] Validate body (email, password)
  - [x] Lookup user by email
  - [x] Compare password hash
  - [x] Create `Session` record
  - [x] Return JWT + session token
- [x] `POST /api/auth/logout`
  - [x] Invalidate session token in DB
  - [x] Clear cookie
- [x] `GET /api/auth/me`
  - [x] Verify JWT from Authorization header or cookie
  - [x] Return current user object with role
- [x] `POST /api/auth/refresh`
  - [x] Validate session token
  - [x] Issue new JWT
- [x] Build `requireAuth` middleware — attach `req.user` or reject 401
- [x] Build `requireAdmin` middleware — check `user.role === ADMIN`
- [x] Build `requireRole(role)` middleware factory — flexible role guard
- [x] Admin seeding: create initial admin user in seed script

---

### 👤 PHASE 2 — Attendees API

- [x] `POST /api/attendees/register`
  - [x] Zod schema: name, email, university, phone, tshirtSize
  - [x] Check max attendee capacity from `EventConfig`
  - [x] Check `registrationOpen` flag
  - [x] Check duplicate email
  - [x] Create `User` + `Attendee` + `SwagRecord` in single transaction
  - [ ] Send welcome confirmation email (queue or direct)
  - [x] Return attendee object
- [x] `GET /api/attendees` *(admin only)*
  - [x] Query params: `page`, `limit`, `search`, `university`, `checkedIn`, `swagComplete`
  - [x] Prisma query with `where`, `skip`, `take`, `orderBy`
  - [x] Return paginated response with total count
- [x] `GET /api/attendees/:id` *(admin only)*
  - [x] Include related `swag`, `certificate`, `user`
- [x] `PATCH /api/attendees/:id/checkin` *(admin only)*
  - [x] Toggle `checkedIn` boolean
  - [x] Set `checkedInAt` timestamp on check-in
  - [x] Return updated attendee
- [x] `PATCH /api/attendees/:id/swag` *(admin only)*
  - [x] Zod schema: partial `SwagRecord` fields
  - [x] Update swag record, set `updatedBy` to current admin
  - [x] Return updated swag record
- [x] `DELETE /api/attendees/:id` *(admin only)*
  - [x] Soft delete or hard delete with cascade
- [x] `GET /api/attendees/export` *(admin only)*
  - [x] Stream CSV response with all attendee data
  - [x] Include: name, email, university, phone, tshirt size, checkin status, swag fields, certificate status
  - [x] Set `Content-Disposition: attachment; filename="attendees.csv"`
- [x] `GET /api/attendees/stats` *(admin only)*
  - [x] Return: totalRegistered, checkedIn, swagDistributed (all 6 items), certificates sent

---

### 🎤 PHASE 3 — Speakers API
- [x] `POST /api/speakers/apply`
  - [x] Zod schema: all speaker fields including linkedinUrl (URL validation), photoUrl
  - [x] Check `speakerAppsOpen` from `EventConfig`
  - [x] Check duplicate email submission
  - [x] Create `User` (if not exists) + `Speaker` record in transaction
  - [x] Status defaults to `PENDING`
  - [ ] Send acknowledgement email to applicant
  - [ ] Notify admin of new application (email)
  - [x] Return speaker object
- [x] `GET /api/speakers` *(public)*
  - [x] Return only `APPROVED` speakers
  - [x] Query params: `track`, `search`, `featured`
  - [x] Include: name, title, topic, bio, photoUrl, linkedinUrl, twitterHandle, githubUrl, track
- [x] `GET /api/speakers/all` *(admin only)*
  - [x] Return all speakers regardless of status
  - [x] Query params: `status`, `track`, `search`, `page`, `limit`
- [x] `GET /api/speakers/:id` *(public — approved only / admin — any)*
  - [x] Full speaker detail including all social links
- [x] `PATCH /api/speakers/:id/approve` *(admin only)*
  - [x] Set status to `APPROVED`, set `reviewedAt`, `reviewedBy`
  - [ ] Send approval email to speaker with event details
- [x] `PATCH /api/speakers/:id/reject` *(admin only)*
  - [x] Zod body: `reviewNote` (required)
  - [x] Set status to `REJECTED`
  - [ ] Send rejection email with optional note
- [x] `PATCH /api/speakers/:id` *(admin only)*
  - [x] Update editable fields: topic, talkTitle, bio, track, sortOrder, featured
- [x] `PATCH /api/speakers/:id/feature` *(admin only)*
  - [x] Toggle `featured` flag
- [x] `DELETE /api/speakers/:id` *(admin only)*
  - [x] Delete speaker + cascade cleanup

---

### 📁 PHASE 4 — File Upload API

- [x] `POST /api/upload/presigned-url` *(authenticated)*
  - [x] Zod body: `fileName`, `fileType`, `folder` (speaker-photos / certificates / sponsors)
  - [x] Validate file type (jpg, png, webp, pdf only)
  - [x] Validate file size limit (5MB)
  - [x] Generate S3 pre-signed PUT URL (15 min expiry)
  - [x] Return: `{ uploadUrl, fileKey, publicUrl }`
- [x] `DELETE /api/upload/:key` *(admin only)*
  - [x] Delete file from S3 by key
- [x] `POST /api/upload/confirm` *(authenticated)*
  - [x] Verify file exists in S3 after upload
  - [x] Update relevant DB record with `fileUrl` and `fileKey`
- [ ] Configure S3 bucket:
  - ARN: arn:aws:s3:::aws-scd-2026-images-ramsey
  - [ ] Public read for speaker photos + sponsor logos
  - [ ] Private for certificates (served via signed URLs)
  - [ ] CORS policy for browser uploads
  - [ ] Lifecycle policy for temp files

---
### 📧 PHASE 5 — Email API


- [x] Set up email provider (Resend recommended — simple API, good deliverability)
- [x] Build `lib/email/templates/` directory with all HTML email templates:
  - [x] `welcome.html` — registration confirmation
  - [x] `speaker-received.html` — application acknowledgement
  - [x] `speaker-approved.html` — approval with event details
  - [x] `speaker-rejected.html` — rejection with optional note
  - [x] `reminder.html` — event reminder (customizable body)
  - [x] `certificate.html` — certificate delivery with attachment/link
- [x] Build `lib/email/send.js` — Nodemailer wrapper
- [x] `POST /api/emails/send` *(admin only)*
  - [x] Zod body: `subject`, `template`, `target` (ATTENDEES / SPEAKERS / BOTH / CUSTOM)
  - [x] Resolve recipient list based on target
  - [x] Create `EmailLog` record with status `DRAFT`
  - [x] Send emails with template rendering
  - [x] Create `EmailRecipient` records per send
  - [x] Update `EmailLog` status to `SENT` / `PARTIAL` / `FAILED`
  - [x] Return log summary
- [x] `GET /api/emails` *(admin only)*
  - [x] Return all email logs, paginated, sorted by `createdAt` desc
- [x] `GET /api/emails/:id` *(admin only)*
  - [x] Return full log with recipient list and delivery statuses
- [x] `POST /api/emails/preview` *(admin only)*
  - [x] Render email HTML from template + variables
  - [x] Return rendered HTML string for preview modal

---

### 🏆 PHASE 6 — Certificates API

- [x] Build `lib/certificates/generate.js`
  - [x] Accept attendee name + event details
  - [x] Use PDFKit to render certificate template
  - [x] Upload generated PDF to S3 (private bucket)
  - [x] Return file key
- [x] `POST /api/certificates/generate` *(admin only)*
  - [x] Body: `attendeeIds` (array) or `all: true`
  - [x] For each attendee: generate PDF, upload to S3, update `Certificate` record
  - [x] Return progress summary `{ total, generated, failed }`
- [x] `POST /api/certificates/generate/:attendeeId` *(admin only)*
  - [x] Generate single certificate
- [x] `POST /api/certificates/send` *(admin only)*
  - [x] Body: `attendeeIds` or `all: true`
  - [x] For each: generate signed S3 URL, send certificate email
  - [x] Update `Certificate.status` to `SENT` / `FAILED`
- [x] `POST /api/certificates/send/:attendeeId` *(admin only)*
  - [x] Send single certificate
- [x] `GET /api/certificates/:attendeeId` *(admin only)*
  - [x] Return certificate record + presigned download URL
- [x] `GET /api/certificates/stats` *(admin only)*
  - [x] Return: notGenerated, generated, sent, failed counts

---

### 🎪 PHASE 7 — Public Content APIs

- [x] `GET /api/event`
  - [x] Return `EventConfig` public fields (name, date, venue, tagline, registrationOpen, speakerAppsOpen, maxAttendees)
- [x] `PATCH /api/event` *(admin only)*
  - [x] Update any `EventConfig` field
- [x] `GET /api/agenda`
  - [x] Return all `AgendaItem` records sorted by `startTime`
  - [x] Optional `?track=` filter
- [x] `POST /api/agenda` *(admin only)*
  - [x] Create agenda item
- [x] `PATCH /api/agenda/:id` *(admin only)*
  - [x] Update agenda item
- [x] `DELETE /api/agenda/:id` *(admin only)*
  - [x] Delete agenda item
- [x] `GET /api/sponsors`
  - [x] Return visible sponsors, grouped by tier, sorted by `sortOrder`
- [x] `POST /api/sponsors` *(admin only)*
  - [x] Create sponsor
- [x] `PATCH /api/sponsors/:id` *(admin only)*
  - [x] Update sponsor
- [x] `DELETE /api/sponsors/:id` *(admin only)*
  - [x] Delete sponsor

---

### 📊 PHASE 8 — Dashboard Stats API

 [x] Set up SMTP email provider integration (nodemailer)
 [x] Build `lib/email/templates/` directory with HTML templates
  - [x] `welcome.html` — registration confirmation
  - [x] `speaker-received.html` — application acknowledgement
  - [x] `speaker-approved.html` — approval with event details
  - [x] `speaker-rejected.html` — rejection with optional note
  - [x] `reminder.html` — event reminder (customizable body)
  - [x] `certificate.html` — certificate delivery with attachment/link
 [x] Build `lib/email/send.js` — Nodemailer wrapper
 [x] `POST /api/emails/send` *(admin only)*
  - [x] Zod body: `subject`, `template`, `target` (ATTENDEES / SPEAKERS / BOTH / CUSTOM)
  - [x] Resolve recipient list based on target
  - [x] Create `EmailLog` record with status `DRAFT`
  - [x] Send emails (simple sequential implementation)
  - [x] Create `EmailRecipient` records per send
  - [x] Update `EmailLog` status to `SENT` / `PARTIAL` / `FAILED`
  - [x] Return log summary
 [x] `GET /api/emails` *(admin only)*
  - [x] Return all email logs, paginated, sorted by `createdAt` desc
 [x] `GET /api/emails/:id` *(admin only)*
  - [x] Return full log with recipient list and delivery statuses
 [x] `POST /api/emails/preview` *(admin only)*
  - [x] Render email HTML from template + body
  - [x] Return rendered HTML string for preview modal
### 🧪 PHASE 9 — Testing

 [x] Build `lib/certificates/generate.js`
  - [x] Accept attendee name + event details
  - [x] Use PDFKit to render certificate template
  - [x] Upload generated PDF to S3 (private bucket)
  - [x] Return file key
 [x] `POST /api/certificates/generate` *(admin only)*
  - [x] Zod body: `attendeeIds` (array) or `all: true`
  - [x] For each attendee: generate PDF, upload to S3, update `Certificate` record
  - [x] Return progress summary `{ total, generated, failed }`
 [x] `POST /api/certificates/generate/:attendeeId` *(admin only)*
  - [x] Generate single certificate
 [x] `POST /api/certificates/send` *(admin only)*
  - [x] Zod body: `attendeeIds` or `all: true`
  - [x] For each: generate signed S3 URL, send certificate email
  - [x] Update `Certificate.status` to `SENT` / `FAILED`
 [x] `POST /api/certificates/send/:attendeeId` *(admin only)*
  - [x] Send single certificate
 [x] `GET /api/certificates/:attendeeId` *(admin only)*
  - [x] Return certificate record + presigned download URL
 [x] `GET /api/certificates/stats` *(admin only)*
  - [x] Return: notGenerated, generated, sent, failed counts

---

### 🚀 PHASE 10 — DevOps & Deployment

- [ ] Set up **Neon** or **Supabase** as hosted PostgreSQL
- [ ] Run `prisma migrate deploy` against production DB
- [ ] Set up **AWS S3** bucket with correct policies
- [ ] Set up **Resend** account + verify sending domain
- [ ] Configure all environment variables in deployment platform:
  - `DATABASE_URL`, `JWT_SECRET`, `SESSION_SECRET`
  - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `AWS_REGION`
  - `RESEND_API_KEY`, `EMAIL_FROM`
  - `NEXT_PUBLIC_APP_URL`
- [ ] Deploy backend to **Vercel** (API routes) or **Railway / Render** (standalone)
- [ ] Set up **GitHub Actions** CI/CD pipeline:
  - [ ] Lint + typecheck on PR
  - [ ] Run tests on PR
  - [ ] Deploy to preview on PR merge
  - [ ] Deploy to production on main branch push
- [ ] Set up **database backups** (daily automated snapshots)
- [ ] Configure **Sentry** for error monitoring (backend + frontend)
- [ ] Set up **Uptime monitoring** (Better Uptime or similar)
- [ ] Document all API endpoints in **Postman collection** or OpenAPI/Swagger spec

---

That's the **complete backend blueprint** — 120+ tasks across 10 phases, fully aligned with the Prisma schema above. Want the **API response types in TypeScript**, the **Zod validation schemas**, or the **folder structure** next?