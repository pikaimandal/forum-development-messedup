export const APP_CONFIG = {
  name: "Forum",
  description: "Human Verified Community",
  version: "1.0.0",
  splashDuration: 3000, // 3 seconds to complete MiniKit initialization
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

// Message editing time limit (5 minutes in milliseconds)
export const MESSAGE_EDIT_TIME_LIMIT = 5 * 60 * 1000
