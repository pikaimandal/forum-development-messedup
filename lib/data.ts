import type { Community, Message, UserProfile } from "@/types"
import { COMMUNITY_CATEGORIES } from "./constants"

export const DEMO_USER: UserProfile = {
  id: "user_1",
  username: "@worldcitizen",
  displayName: "World Citizen",
  avatar: "/user-profile-avatar.png",
  bio: "Passionate about human verification and decentralized identity. Building the future of digital trust.",
  isVerified: true,
  verificationDate: "January 2024",
  createdAt: "2023-12-01T00:00:00Z",
  updatedAt: "2024-01-15T00:00:00Z",
  stats: {
    posts: 23,
    comments: 156,
    upvotes: 892,
    communities: 8,
    joinDate: "December 2023",
  },
}

export const DEMO_COMMUNITIES: Record<string, Community> = {
  "global-chat": {
    id: "global-chat",
    name: "Global Chat",
    description:
      "General discussion room for all topics and community introductions. This is the main hub where verified humans can connect, share ideas, and engage in meaningful conversations about any subject.",
    members: 18500,
    color: "bg-primary",
    category: COMMUNITY_CATEGORIES.GENERAL,
    rules: [
      "Be respectful and kind to all community members",
      "No spam, self-promotion, or off-topic content",
      "Keep discussions constructive and meaningful",
      "Report inappropriate behavior to moderators",
    ],
    moderators: ["CommunityMod", "GlobalAdmin"],
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  developer: {
    id: "developer",
    name: "Developer",
    description:
      "Technical discussions, code reviews, and development help. Share your projects, ask for advice, and collaborate with fellow developers on various programming languages and technologies.",
    members: 5600,
    color: "bg-emerald-500",
    category: COMMUNITY_CATEGORIES.TECHNOLOGY,
    rules: [
      "Share code snippets and technical resources",
      "Help others with programming questions",
      "No job postings without prior approval",
      "Keep discussions technical and relevant",
    ],
    moderators: ["DevLead", "TechModerator"],
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  "world-news": {
    id: "world-news",
    name: "World News",
    description:
      "Global news, current events, and world affairs discussion. Stay informed about what's happening around the world and engage in thoughtful discussions about current events.",
    members: 12300,
    color: "bg-blue-500",
    category: COMMUNITY_CATEGORIES.NEWS,
    rules: [
      "Share credible news sources only",
      "Maintain civil discourse on sensitive topics",
      "No misinformation or conspiracy theories",
      "Fact-check before sharing information",
    ],
    moderators: ["NewsEditor", "FactChecker"],
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  "ai-tech": {
    id: "ai-tech",
    name: "AI & Tech",
    description:
      "Artificial intelligence, technology innovations, and future trends. Explore the latest developments in AI, discuss emerging technologies, and share insights about the future of tech.",
    members: 8900,
    color: "bg-purple-500",
    category: COMMUNITY_CATEGORIES.TECHNOLOGY,
    rules: [
      "Share AI research and tech innovations",
      "Discuss ethical implications of technology",
      "No fear-mongering about AI",
      "Support claims with credible sources",
    ],
    moderators: ["AIResearcher", "TechExpert"],
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  qa: {
    id: "qa",
    name: "Q&A",
    description:
      "Questions, answers, and knowledge sharing from the community. Ask anything you're curious about and help others by sharing your knowledge and expertise.",
    members: 6700,
    color: "bg-amber-500",
    category: COMMUNITY_CATEGORIES.HELP_SUPPORT,
    rules: [
      "Ask clear and specific questions",
      "Provide helpful and accurate answers",
      "Search before asking duplicate questions",
      "Thank contributors for their help",
    ],
    moderators: ["KnowledgeKeeper", "HelpModerator"],
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  announcements: {
    id: "announcements",
    name: "Announcements",
    description:
      "Official updates, news, and important platform announcements. Stay up to date with the latest World Forum features, policy changes, and community updates.",
    members: 15200,
    color: "bg-orange-500",
    category: COMMUNITY_CATEGORIES.OFFICIAL,
    rules: [
      "Official announcements only",
      "Read announcements before asking questions",
      "Provide feedback constructively",
      "Follow new guidelines promptly",
    ],
    moderators: ["WorldForumTeam", "CommunityManager"],
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
}

export const DEMO_MESSAGES: Record<string, Message[]> = {
  "global-chat": [
    {
      id: "msg_1",
      communityId: "global-chat",
      authorId: "mod_1",
      author: "CommunityMod",
      authorAvatar: "/worldcoin-team.png",
      content:
        "Welcome to Global Chat! This is where verified humans connect and share ideas. Feel free to introduce yourself! 👋",
      timestamp: "2h",
      createdAt: "2024-01-15T10:00:00Z",
      isVerified: true,
    },
    {
      id: "msg_2",
      communityId: "global-chat",
      authorId: "user_2",
      author: "NewMember",
      authorAvatar: "/diverse-user-avatars.png",
      content: "Hi everyone! Just joined World Forum and excited to be part of this human-verified community! 🎉",
      timestamp: "1h",
      createdAt: "2024-01-15T11:00:00Z",
      isVerified: true,
    },
    {
      id: "msg_3",
      communityId: "global-chat",
      authorId: "user_3",
      author: "ActiveUser",
      authorAvatar: "/user-profile-avatar.png",
      content: "Great to have you here! The community is growing fast and the discussions are always interesting 😊",
      timestamp: "45m",
      createdAt: "2024-01-15T11:15:00Z",
      isVerified: true,
    },
  ],
  developer: [
    {
      id: "msg_4",
      communityId: "developer",
      authorId: "dev_1",
      author: "DevLead",
      authorAvatar: "/developer-coding.png",
      content: "Anyone working with the latest World ID SDK? I'm having some integration questions 🤔",
      timestamp: "3h",
      createdAt: "2024-01-15T09:00:00Z",
      isVerified: true,
    },
    {
      id: "msg_5",
      communityId: "developer",
      authorId: "dev_2",
      author: "FullStackDev",
      authorAvatar: "/developer-working.png",
      content:
        "Just implemented it last week! The new documentation is really helpful. What specific issues are you facing?",
      timestamp: "2h",
      createdAt: "2024-01-15T10:00:00Z",
      isVerified: true,
    },
  ],
  "world-news": [
    {
      id: "msg_6",
      communityId: "world-news",
      authorId: "news_1",
      author: "NewsEditor",
      authorAvatar: "/worldcoin-team.png",
      content:
        "Digital identity adoption is accelerating globally. Several countries are now exploring similar verification systems 🌍",
      timestamp: "4h",
      createdAt: "2024-01-15T08:00:00Z",
      isVerified: true,
    },
  ],
  "ai-tech": [
    {
      id: "msg_7",
      communityId: "ai-tech",
      authorId: "ai_1",
      author: "AIResearcher",
      authorAvatar: "/tech-enthusiast.png",
      content:
        "The intersection of AI and human verification is fascinating. Biometric tech is advancing so rapidly! 🤖",
      timestamp: "5h",
      createdAt: "2024-01-15T07:00:00Z",
      isVerified: true,
    },
  ],
  qa: [
    {
      id: "msg_8",
      communityId: "qa",
      authorId: "help_1",
      author: "HelpModerator",
      authorAvatar: "/diverse-user-avatars.png",
      content:
        "This is the Q&A community! Ask any questions about World Forum, World ID, or anything else. We're here to help! ❓",
      timestamp: "6h",
      createdAt: "2024-01-15T06:00:00Z",
      isVerified: true,
    },
  ],
  announcements: [
    {
      id: "msg_9",
      communityId: "announcements",
      authorId: "team_1",
      author: "WorldForumTeam",
      authorAvatar: "/announcement-team.png",
      content:
        "🎉 Welcome to World Forum Beta! We're excited to launch the world's first human-verified forum platform. More features coming soon!",
      timestamp: "1d",
      createdAt: "2024-01-14T12:00:00Z",
      isVerified: true,
    },
  ],
}
