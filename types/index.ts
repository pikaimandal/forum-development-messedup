export interface User {
  id: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  isVerified: boolean
  verificationDate: string
  createdAt: string
  updatedAt: string
}

export interface Community {
  id: string
  name: string
  description: string
  members: number
  color: string
  rules: string[]
  moderators: string[]
  category: string
  createdAt: string
  isActive: boolean
}

export interface Message {
  id: string
  communityId: string
  authorId: string
  author: string
  authorAvatar: string
  content: string
  timestamp: string
  createdAt: string
  isVerified: boolean
  isEdited?: boolean
  views: number
}

export interface UserStats {
  posts: number
  comments: number
  upvotes: number
  communities: number
  joinDate: string
}

export interface UserProfile extends User {
  stats: UserStats
}

// Screen and navigation types
export type Screen = "splash" | "login" | "main" | "world-app-warning"
export type MainScreen = "communities" | "community-detail" | "chat" | "discover" | "profile"

// Component prop types
export interface AuthProps {
  onLogin: () => void
  onLogout: () => void
}

export interface NavigationProps {
  onNavigateToCommunity: (communityId: string) => void
  joinedCommunities: Set<string>
}

export interface CommunityProps {
  communityId: string
  onBack: () => void
  onJoinCommunity: (communityId: string) => void
  onLeaveCommunity: (communityId: string) => void
  onEnterChat: (communityId: string) => void
  isJoined: boolean
}

export interface ChatProps {
  communityId: string
  onBack: () => void
}

// Firebase-ready data structures
export interface FirebaseUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  emailVerified: boolean
  createdAt: any // Firebase Timestamp
}

export interface FirebaseCommunity extends Omit<Community, "createdAt"> {
  createdAt: any // Firebase Timestamp
  updatedAt: any // Firebase Timestamp
}

export interface FirebaseMessage extends Omit<Message, "createdAt" | "timestamp"> {
  createdAt: any // Firebase Timestamp
  updatedAt?: any // Firebase Timestamp
}
