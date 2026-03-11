/**
 * Shared TypeScript interfaces for AWS Student Community Day
 */

export type SwagItem =
  | "t_shirt"
  | "stickers"
  | "notebook"
  | "badge"
  | "pen"
  | "wristband";

export type CertificateStatus = "not_sent" | "sent" | "failed";

export type SpeakerTrack =
  | "cloud"
  | "devops"
  | "ai_ml"
  | "security"
  | "open_source";

export type SpeakerStatus = "pending" | "approved" | "rejected";

export interface Attendee {
  id: string;
  name: string;
  email: string;
  university: string;
  phone?: string;
  tShirtSize?: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  registeredAt: string;
  checkedIn: boolean;
  swagItems: SwagItem[];
  certificateStatus: CertificateStatus;
  certificateSentAt?: string;
}

export interface Speaker {
  id: string;
  name: string;
  email: string;
  title: string;
  company: string;
  topic: string;
  track: SpeakerTrack;
  bio: string;
  abstract?: string;
  linkedinUrl: string;
  twitterHandle?: string;
  githubUrl?: string;
  photoUrl?: string;
  yearsOfExperience?: "0-1" | "1-3" | "3-5" | "5+";
  status: SpeakerStatus;
  submittedAt: string;
}

export interface EmailLog {
  id: string;
  subject: string;
  target: "attendees" | "speakers" | "both" | "custom";
  recipientCount: number;
  status: "sent" | "failed" | "partial";
  sentAt: string;
}
