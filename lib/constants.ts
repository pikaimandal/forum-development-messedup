export const APP_CONFIG = {
  name: "World Forum",
  description: "Human Verified Community",
  version: "1.0.0",
  splashDuration: 3000,
  maxMessageLength: 500,
} as const

export const COMMUNITY_CATEGORIES = {
  TECHNOLOGY: "Technology",
  NEWS: "News",
  GENERAL: "General",
  HELP_SUPPORT: "Help & Support",
  OFFICIAL: "Official",
} as const

export const USER_ROLES = {
  MEMBER: "member",
  MODERATOR: "moderator",
  ADMIN: "admin",
} as const

export const MESSAGE_TYPES = {
  TEXT: "text",
  SYSTEM: "system",
} as const

// Default communities for new users
export const DEFAULT_JOINED_COMMUNITIES = ["global-chat", "world-news", "qa", "announcements"] as const
