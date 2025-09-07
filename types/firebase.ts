import { Timestamp } from 'firebase/firestore'

// Base types for Firestore documents
export interface FirebaseTimestamp {
  createdAt: Timestamp
  updatedAt: Timestamp
}

// User document in Firestore
export interface FirebaseUser extends FirebaseTimestamp {
  id: string // wallet address
  username: string
  displayName: string
  profilePicture?: string
  isVerified: boolean
  isOrbVerified: boolean
  lastActive: Timestamp
  joinedCommunitiesCount: number
  totalMessages: number
  totalUpvotes: number
  totalDownvotes: number
}

// Community document in Firestore
export interface FirebaseCommunity extends FirebaseTimestamp {
  id: string
  name: string
  description: string
  color: string
  category: string
  rules: string[]
  moderators: string[]
  isActive: boolean
  memberCount: number
  messageCount: number
  lastMessageAt?: Timestamp
  lastMessageBy?: string
}

// Community membership junction document
export interface FirebaseCommunityMember extends FirebaseTimestamp {
  id: string // communityId_userId
  communityId: string
  userId: string
  joinedAt: Timestamp
  role: 'member' | 'moderator' | 'admin'
  isActive: boolean
}

// Message document in Firestore
export interface FirebaseMessage extends FirebaseTimestamp {
  id: string
  communityId: string
  authorId: string
  authorUsername: string
  authorProfilePicture?: string
  content: string
  isEdited: boolean
  editedAt?: Timestamp
  canEdit: boolean // computed field based on createdAt
  upvotes: number
  downvotes: number
  views: number
  replyCount: number
  reportCount: number
  isDeleted: boolean
  deletedAt?: Timestamp
  replyTo?: {
    messageId: string
    authorUsername: string
    content: string // first 100 chars
  }
}

// Message vote document
export interface FirebaseMessageVote extends FirebaseTimestamp {
  id: string // messageId_userId
  messageId: string
  userId: string
  communityId: string
  voteType: 'upvote' | 'downvote'
}

// Message view document
export interface FirebaseMessageView extends FirebaseTimestamp {
  id: string // messageId_userId
  messageId: string
  userId: string
  communityId: string
  viewedAt: Timestamp
}

// Message report document
export interface FirebaseMessageReport extends FirebaseTimestamp {
  id: string // messageId_userId
  messageId: string
  userId: string
  communityId: string
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other'
  description?: string
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  reviewedBy?: string
  reviewedAt?: Timestamp
}

// Message reply document (if we want separate collection for replies)
export interface FirebaseMessageReply extends FirebaseTimestamp {
  id: string
  parentMessageId: string
  communityId: string
  authorId: string
  authorUsername: string
  authorProfilePicture?: string
  content: string
  isEdited: boolean
  editedAt?: Timestamp
  canEdit: boolean
  upvotes: number
  downvotes: number
  reportCount: number
  isDeleted: boolean
  deletedAt?: Timestamp
}

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  COMMUNITIES: 'communities',
  COMMUNITY_MEMBERS: 'community_members',
  MESSAGES: 'messages',
  MESSAGE_VOTES: 'message_votes',
  MESSAGE_VIEWS: 'message_views',
  MESSAGE_REPORTS: 'message_reports',
  MESSAGE_REPLIES: 'message_replies', // optional - for separate replies collection
} as const

// Default communities data for initialization
export const DEFAULT_COMMUNITIES: Omit<FirebaseCommunity, 'createdAt' | 'updatedAt' | 'memberCount' | 'messageCount' | 'lastMessageAt' | 'lastMessageBy'>[] = [
  {
    id: 'global-chat',
    name: 'Global Chat',
    description: 'General discussion room for all topics and community introductions. This is the main hub where verified humans can connect, share ideas, and engage in meaningful conversations about any subject.',
    color: 'bg-primary',
    category: 'General',
    rules: [
      'Be respectful and kind to all community members',
      'No spam, self-promotion, or off-topic content',
      'Keep discussions constructive and meaningful',
      'Report inappropriate behavior to moderators',
    ],
    moderators: ['CommunityMod', 'GlobalAdmin'],
    isActive: true,
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Technical discussions, code reviews, and development help. Share your projects, ask for advice, and collaborate with fellow developers on various programming languages and technologies.',
    color: 'bg-emerald-500',
    category: 'Technology',
    rules: [
      'Share code snippets and technical resources',
      'Help others with programming questions',
      'No job postings without prior approval',
      'Keep discussions technical and relevant',
    ],
    moderators: ['DevLead', 'TechModerator'],
    isActive: true,
  },
  {
    id: 'world-news',
    name: 'World News',
    description: 'Global news, current events, and world affairs discussion. Stay informed about what\'s happening around the world and engage in thoughtful discussions about current events.',
    color: 'bg-blue-500',
    category: 'News',
    rules: [
      'Share credible news sources only',
      'Maintain civil discourse on sensitive topics',
      'No misinformation or conspiracy theories',
      'Fact-check before sharing information',
    ],
    moderators: ['NewsEditor', 'FactChecker'],
    isActive: true,
  },
  {
    id: 'ai-tech',
    name: 'AI & Tech',
    description: 'Artificial intelligence, technology innovations, and future trends. Explore the latest developments in AI, discuss emerging technologies, and share insights about the future of tech.',
    color: 'bg-purple-500',
    category: 'Technology',
    rules: [
      'Share AI research and tech innovations',
      'Discuss ethical implications of technology',
      'No fear-mongering about AI',
      'Support claims with credible sources',
    ],
    moderators: ['AIResearcher', 'TechExpert'],
    isActive: true,
  },
  {
    id: 'qa',
    name: 'Q&A',
    description: 'Questions, answers, and knowledge sharing from the community. Ask anything you\'re curious about and help others by sharing your knowledge and expertise.',
    color: 'bg-amber-500',
    category: 'Help & Support',
    rules: [
      'Ask clear and specific questions',
      'Provide helpful and accurate answers',
      'Use search before asking duplicate questions',
      'Thank those who help you',
    ],
    moderators: ['HelpModerator', 'KnowledgeExpert'],
    isActive: true,
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Official updates, news, and important platform announcements. Stay informed about new features, policy changes, and community events.',
    color: 'bg-orange-500',
    category: 'Official',
    rules: [
      'Official announcements only',
      'No spam or promotional content',
      'Keep discussions relevant to announcements',
      'Respect official communications',
    ],
    moderators: ['ForumTeam', 'AnnouncementMod'],
    isActive: true,
  },
]
