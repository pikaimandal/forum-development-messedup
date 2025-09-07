import { CommunityService } from '@/lib/firebase-services'

/**
 * Initialize Firebase database with default communities
 * This should be run once when setting up the database
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔥 Initializing Firebase database...')
    
    // Initialize default communities
    await CommunityService.initializeDefaultCommunities()
    console.log('✅ Default communities created successfully')
    
    console.log('🎉 Database initialization completed!')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  }
}

/**
 * Utility function to check if message can be edited
 * @param createdAt - Message creation timestamp
 * @param isEdited - Whether message was already edited
 * @returns boolean
 */
export function canEditMessage(createdAt: Date, isEdited: boolean): boolean {
  if (isEdited) return false
  
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  
  return createdAt > fiveMinutesAgo
}

/**
 * Utility function to format message timestamp
 * @param timestamp - Message timestamp
 * @returns formatted string
 */
export function formatMessageTime(timestamp: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  // For older messages, show date
  return timestamp.toLocaleDateString()
}

/**
 * Utility function to check if we need a date separator
 * @param currentMessage - Current message timestamp
 * @param previousMessage - Previous message timestamp (optional)
 * @returns boolean
 */
export function needsDateSeparator(currentMessage: Date, previousMessage?: Date): boolean {
  if (!previousMessage) return true
  
  const current = new Date(currentMessage)
  const previous = new Date(previousMessage)
  
  // Reset time to beginning of day for comparison
  current.setHours(0, 0, 0, 0)
  previous.setHours(0, 0, 0, 0)
  
  return current.getTime() !== previous.getTime()
}

/**
 * Utility function to format date separator
 * @param timestamp - Message timestamp
 * @returns formatted date string
 */
export function formatDateSeparator(timestamp: Date): string {
  const now = new Date()
  const messageDate = new Date(timestamp)
  
  // Reset time for comparison
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const messageDay = new Date(messageDate)
  messageDay.setHours(0, 0, 0, 0)
  
  if (messageDay.getTime() === today.getTime()) {
    return 'Today'
  } else if (messageDay.getTime() === yesterday.getTime()) {
    return 'Yesterday'
  } else {
    return messageDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
}

/**
 * Utility function to generate unique message ID
 * @returns string
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Utility function to truncate content for reply preview
 * @param content - Original content
 * @param maxLength - Maximum length (default 100)
 * @returns truncated string
 */
export function truncateContent(content: string, maxLength = 100): string {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength).trim() + '...'
}
