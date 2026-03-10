-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ATTENDEE', 'SPEAKER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TShirtSize" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "SpeakerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('NOT_GENERATED', 'GENERATED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('DRAFT', 'SENT', 'FAILED', 'PARTIAL');

-- CreateEnum
CREATE TYPE "EmailTarget" AS ENUM ('ATTENDEES', 'SPEAKERS', 'BOTH', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SponsorTier" AS ENUM ('GOLD', 'SILVER', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "AgendaTrack" AS ENUM ('MAIN_STAGE', 'WORKSHOP', 'PANEL', 'NETWORKING', 'OPENING', 'CLOSING');

-- CreateEnum
CREATE TYPE "SpeakerTrack" AS ENUM ('CLOUD_FUNDAMENTALS', 'DEVOPS', 'AI_ML', 'SECURITY', 'OPEN_SOURCE');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('ZERO_TO_ONE', 'ONE_TO_THREE', 'THREE_TO_FIVE', 'FIVE_PLUS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ATTENDEE',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendees" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "phone" TEXT,
    "tshirtSize" "TShirtSize" NOT NULL,
    "checkedIn" BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt" TIMESTAMP(3),
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swag_records" (
    "id" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "tshirt" BOOLEAN NOT NULL DEFAULT false,
    "stickers" BOOLEAN NOT NULL DEFAULT false,
    "notebook" BOOLEAN NOT NULL DEFAULT false,
    "badge" BOOLEAN NOT NULL DEFAULT false,
    "pen" BOOLEAN NOT NULL DEFAULT false,
    "wristband" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "swag_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speakers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "talkTitle" TEXT NOT NULL,
    "talkAbstract" TEXT,
    "bio" TEXT NOT NULL,
    "track" "SpeakerTrack",
    "experienceLevel" "ExperienceLevel",
    "status" "SpeakerStatus" NOT NULL DEFAULT 'PENDING',
    "linkedinUrl" TEXT NOT NULL,
    "twitterHandle" TEXT,
    "githubUrl" TEXT,
    "photoUrl" TEXT,
    "photoKey" TEXT,
    "role" TEXT NOT NULL DEFAULT 'SPEAKER',
    "company" TEXT NOT NULL,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "status" "CertificateStatus" NOT NULL DEFAULT 'NOT_GENERATED',
    "fileUrl" TEXT,
    "fileKey" TEXT,
    "generatedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "target" "EmailTarget" NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'DRAFT',
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failCount" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentBy" TEXT NOT NULL,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_recipients" (
    "id" TEXT NOT NULL,
    "emailLogId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "delivered" BOOLEAN NOT NULL DEFAULT false,
    "failReason" TEXT,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "email_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "logoKey" TEXT,
    "website" TEXT,
    "tier" "SponsorTier",
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "track" "AgendaTrack",
    "speakerId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agenda_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_config" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL DEFAULT 'AWS Cloud Club Student Community Day',
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventEndDate" TIMESTAMP(3),
    "venue" TEXT NOT NULL,
    "venueAddress" TEXT,
    "tagline" TEXT,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "speakerAppsOpen" BOOLEAN NOT NULL DEFAULT true,
    "maxAttendees" INTEGER NOT NULL DEFAULT 500,
    "contactEmail" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_userId_key" ON "attendees"("userId");

-- CreateIndex
CREATE INDEX "attendees_checkedIn_idx" ON "attendees"("checkedIn");

-- CreateIndex
CREATE UNIQUE INDEX "swag_records_attendeeId_key" ON "swag_records"("attendeeId");

-- CreateIndex
CREATE UNIQUE INDEX "speakers_userId_key" ON "speakers"("userId");

-- CreateIndex
CREATE INDEX "speakers_status_idx" ON "speakers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "certificates_attendeeId_key" ON "certificates"("attendeeId");

-- CreateIndex
CREATE INDEX "certificates_status_idx" ON "certificates"("status");

-- CreateIndex
CREATE INDEX "email_logs_status_idx" ON "email_logs"("status");

-- CreateIndex
CREATE INDEX "email_logs_createdAt_idx" ON "email_logs"("createdAt");

-- CreateIndex
CREATE INDEX "email_recipients_emailLogId_idx" ON "email_recipients"("emailLogId");

-- CreateIndex
CREATE INDEX "sponsors_tier_idx" ON "sponsors"("tier");

-- CreateIndex
CREATE INDEX "agenda_items_startTime_idx" ON "agenda_items"("startTime");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swag_records" ADD CONSTRAINT "swag_records_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "attendees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_recipients" ADD CONSTRAINT "email_recipients_emailLogId_fkey" FOREIGN KEY ("emailLogId") REFERENCES "email_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
