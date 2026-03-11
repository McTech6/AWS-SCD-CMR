import type { Attendee, Speaker } from "@/types";

export const mockAttendees: Attendee[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.j@university.edu",
    university: "State University",
    phone: "+1234567890",
    tShirtSize: "M",
    registeredAt: "2025-02-15T10:00:00Z",
    checkedIn: true,
    swagItems: ["t_shirt", "stickers", "notebook"],
    certificateStatus: "sent",
    certificateSentAt: "2025-03-01T14:00:00Z",
  },
  {
    id: "2",
    name: "Sam Chen",
    email: "sam.chen@tech.edu",
    university: "Tech Institute",
    tShirtSize: "L",
    registeredAt: "2025-02-16T09:30:00Z",
    checkedIn: false,
    swagItems: ["t_shirt"],
    certificateStatus: "not_sent",
  },
];

export const mockSpeakers: Speaker[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    email: "sarah@cloud.io",
    title: "Principal Cloud Architect",
    company: "CloudCorp",
    topic: "Building Scalable Serverless Applications",
    track: "cloud",
    bio: "10+ years building cloud-native applications. AWS Community Builder.",
    abstract: "Deep dive into serverless patterns and best practices.",
    linkedinUrl: "https://linkedin.com/in/sarahmitchell",
    twitterHandle: "sarahcloud",
    photoUrl: "/speakers/sarah.jpg",
    yearsOfExperience: "5+",
    status: "approved",
    submittedAt: "2025-02-01T12:00:00Z",
  },
  {
    id: "2",
    name: "James Okonkwo",
    email: "james@devops.co",
    title: "DevOps Lead",
    company: "ScaleUp",
    topic: "CI/CD at Scale with GitHub Actions",
    track: "devops",
    bio: "DevOps enthusiast. Helping teams ship faster.",
    linkedinUrl: "https://linkedin.com/in/jamesokonkwo",
    status: "approved",
    submittedAt: "2025-02-05T14:00:00Z",
  },
];

export const mockAgenda = [
  {
    time: "09:00",
    title: "Registration & Coffee",
    speaker: null,
    track: null,
  },
  {
    time: "10:00",
    title: "Keynote: The Future of Cloud",
    speaker: "Dr. Sarah Mitchell",
    track: "cloud",
  },
  {
    time: "11:00",
    title: "Hands-on Workshop: Serverless 101",
    speaker: "James Okonkwo",
    track: "devops",
  },
];

export const mockSponsors = {
  gold: ["AWS", "Vercel"],
  silver: ["GitHub", "MongoDB"],
  community: ["Cloud Club", "Dev Community", "Student Devs"],
};
