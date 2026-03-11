import { Clock, Mic2, Coffee, Laptop } from "lucide-react";

export const INITIAL_AGENDA = [
    {
        id: "1",
        time: "XX:XX AM",
        title: "Opening Keynote: The Future of Cloud Architecture",
        speaker: "Julian Wood",
        track: "General",
        type: "talk",
        icon: Mic2,
    },
    {
        id: "2",
        time: "XX:XX AM",
        title: "Morning Break & Networking",
        speaker: "Community",
        track: "Networking",
        type: "break",
        icon: Coffee,
    },
    {
        id: "3",
        time: "XX:XX AM",
        title: "Serverless Masterclass: Zero to Scale",
        speaker: "Marcia Villalba",
        track: "Serverless",
        type: "workshop",
        icon: Laptop,
    },
    {
        id: "4",
        time: "XX:XX PM",
        title: "Networking Lunch",
        speaker: "Everyone",
        track: "Food",
        type: "break",
        icon: Coffee,
    },
    {
        id: "5",
        time: "XX:XX PM",
        title: "Securing Your Modern Infrastructure",
        speaker: "Daryl Robinson",
        track: "Security",
        type: "talk",
        icon: Mic2,
    },
    {
        id: "6",
        time: "XX:XX PM",
        title: "GenAI Workshop: LLMs in Production",
        speaker: "Sheenam Narang",
        track: "AI & ML",
        type: "workshop",
        icon: Laptop,
    },
];

export const INITIAL_SPONSORS = [
    {
        id: "s1",
        name: "AWS",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        tier: "Gold",
        url: "https://aws.amazon.com"
    },
    {
        id: "s2",
        name: "Intel",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg",
        tier: "Gold",
        url: "https://intel.com"
    },
    {
        id: "s3",
        name: "NVIDIA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
        tier: "Gold",
        url: "https://nvidia.com"
    },
    {
        id: "s4",
        name: "MongoDB",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg",
        tier: "Silver",
        url: "https://mongodb.com"
    },
    {
        id: "s5",
        name: "Datadog",
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Datadog_logo.svg",
        tier: "Silver",
        url: "https://datadog.com"
    },
    {
        id: "s6",
        name: "HashiCorp",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/HashiCorp_Logo_7.svg",
        tier: "Silver",
        url: "https://hashicorp.com"
    },
    {
        id: "s7",
        name: "Postman",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Postman-logo.svg",
        tier: "Silver",
        url: "https://postman.com"
    },
];

export const COMMUNITY_SPONSORS = [
    "GitHub", "Discord", "Vercel", "Slack", "Figma", "Notion", "Linear", "Stripe", "Docker", "Kubernetes"
];
