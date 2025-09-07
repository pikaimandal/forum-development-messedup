import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"
  }
  return num.toString()
}

export function formatUsername(username: string): string {
  // Add '@' prefix if not already present
  if (username.startsWith('@')) {
    return username
  }
  return `@${username}`
}

export function formatWalletAddress(address: string): string {
  // Format wallet address as 0x123...abc (first 5 chars + ... + last 5 chars)
  if (!address || address.length < 10) {
    return address
  }
  
  const prefix = address.substring(0, 5) // 0x123
  const suffix = address.substring(address.length - 5) // abc12
  return `${prefix}...${suffix}`
}

export function generateAvatarUrl(address: string, profilePictureUrl?: string): string {
  // First try to use the MiniKit profile picture if available
  if (profilePictureUrl) {
    return profilePictureUrl
  }
  
  // Fallback to DiceBear API using wallet address as seed with fun-emoji style
  return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${address}`
}

export function formatTimestamp(timestamp: string): string {
  // Convert relative time to more readable format
  if (timestamp === "now") return "now"
  if (timestamp.includes("m")) return timestamp
  if (timestamp.includes("h")) return timestamp
  if (timestamp.includes("d")) return timestamp.replace("d", " day ago")
  return timestamp
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
  return formatDate(dateString)
}

export function generateId(prefix = ""): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`
}

export function validateMessage(
  content: string,
  maxLength = 500,
): {
  isValid: boolean
  error?: string
} {
  if (!content.trim()) {
    return { isValid: false, error: "Message cannot be empty" }
  }
  if (content.length > maxLength) {
    return { isValid: false, error: `Message too long (${content.length}/${maxLength})` }
  }
  return { isValid: true }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/\s+/g, " ")
}

export function getCommunityCategory(communityId: string): string {
  const categoryMap: Record<string, string> = {
    "global-chat": "General",
    developer: "Technology",
    "world-news": "News",
    "ai-tech": "Technology",
    qa: "Help & Support",
    announcements: "Official",
  }
  return categoryMap[communityId] || "General"
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUsername(username: string): boolean {
  // Username should be 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
