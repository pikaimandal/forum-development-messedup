# Firebase Database Setup Guide

## 🔥 Firebase Integration Summary

This document outlines the complete Firebase database setup for the Worldcoin Forum mini-app.

## 📊 Database Collections Structure

### 1. **users** Collection
Stores user profiles and authentication data.

```typescript
interface FirebaseUser {
  id: string                    // wallet address (document ID)
  username: string              // username from MiniKit
  displayName: string           // display name
  profilePicture?: string       // profile picture URL
  isVerified: boolean           // human verification status
  isOrbVerified: boolean        // ORB verification status
  lastActive: Timestamp         // last activity timestamp
  joinedCommunitiesCount: number // number of joined communities
  totalMessages: number         // total messages sent
  totalUpvotes: number          // total upvotes received
  totalDownvotes: number        // total downvotes received
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 2. **communities** Collection
Stores the 6 fixed communities (no create/delete operations).

```typescript
interface FirebaseCommunity {
  id: string                    // community ID (document ID)
  name: string                  // community name
  description: string           // community description
  color: string                 // UI color class
  category: string              // community category
  rules: string[]               // community rules
  moderators: string[]          // moderator usernames
  isActive: boolean             // if community is active
  memberCount: number           // total members
  messageCount: number          // total messages
  lastMessageAt?: Timestamp     // last message timestamp
  lastMessageBy?: string        // last message author
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 3. **community_members** Collection
Junction table for user-community relationships.

```typescript
interface FirebaseCommunityMember {
  id: string                    // "{communityId}_{userId}" (document ID)
  communityId: string           // reference to community
  userId: string                // reference to user (wallet address)
  joinedAt: Timestamp           // when user joined
  role: 'member' | 'moderator' | 'admin'
  isActive: boolean             // if membership is active
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 4. **messages** Collection
Stores all chat messages with full metadata.

```typescript
interface FirebaseMessage {
  id: string                    // message ID (document ID)
  communityId: string           // reference to community
  authorId: string              // author wallet address
  authorUsername: string        // author username
  authorProfilePicture?: string // author profile picture
  content: string               // message content
  isEdited: boolean             // if message was edited
  editedAt?: Timestamp          // when message was edited
  canEdit: boolean              // if message can still be edited
  upvotes: number               // upvote count
  downvotes: number             // downvote count
  views: number                 // view count
  replyCount: number            // reply count
  reportCount: number           // report count
  isDeleted: boolean            // soft delete flag
  deletedAt?: Timestamp         // deletion timestamp
  replyTo?: {                   // if replying to another message
    messageId: string
    authorUsername: string
    content: string             // first 100 chars
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 5. **message_votes** Collection
Tracks user votes on messages.

```typescript
interface FirebaseMessageVote {
  id: string                    // "{messageId}_{userId}" (document ID)
  messageId: string             // reference to message
  userId: string                // user wallet address
  communityId: string           // reference to community
  voteType: 'upvote' | 'downvote'
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 6. **message_views** Collection
Tracks message views per user.

```typescript
interface FirebaseMessageView {
  id: string                    // "{messageId}_{userId}" (document ID)
  messageId: string             // reference to message
  userId: string                // user wallet address
  communityId: string           // reference to community
  viewedAt: Timestamp           // when message was viewed
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 7. **message_reports** Collection
Stores user reports on messages.

```typescript
interface FirebaseMessageReport {
  id: string                    // "{messageId}_{userId}" (document ID)
  messageId: string             // reference to message
  userId: string                // reporter wallet address
  communityId: string           // reference to community
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other'
  description?: string          // optional description
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  reviewedBy?: string           // moderator who reviewed
  reviewedAt?: Timestamp        // review timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## 🔧 Setup Instructions

### 1. **Environment Variables**
Add these to your `.env.local` file:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=worldforum-production.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=worldforum-production
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=worldforum-production.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 2. **Initialize Database**
Run the initialization script to create default communities:

```bash
# Option 1: Via script
pnpm setup-db

# Option 2: Via API endpoint
POST /api/init-database
```

### 3. **Deploy Firestore Rules**
Deploy the security rules to Firebase:

```bash
firebase deploy --only firestore:rules
```

### 4. **Test Database Connection**
Verify everything is working by:
1. Starting the development server: `pnpm dev`
2. Login with a test wallet
3. Check if communities load correctly
4. Test joining/leaving communities

## 🔒 Security Features

### **Firestore Security Rules**
- Users can only modify their own data
- Community data is read-only (managed server-side)
- Message editing limited to 5 minutes and author only
- Vote/view/report data protected per user
- Moderator-only access to reports

### **Message Editing Rules**
- Messages can only be edited for 5 minutes after creation
- Messages can only be edited once
- Only the original author can edit
- Edit timestamp and flag are tracked

## 🚀 Key Features Implemented

### **User Management**
- ✅ Automatic user creation on first login
- ✅ Profile data from MiniKit integration
- ✅ Activity tracking
- ✅ Statistics tracking

### **Community System**
- ✅ 6 fixed communities (no CRUD operations)
- ✅ Dynamic member counting
- ✅ Join/leave functionality
- ✅ No default joined communities

### **Messaging System**
- ✅ Real-time message creation
- ✅ Message editing (5-minute window, once only)
- ✅ Upvote/downvote system
- ✅ View tracking
- ✅ Report system
- ✅ Date separators for chat

### **Real-time Features**
- ✅ Live message updates
- ✅ Community member count updates
- ✅ User activity tracking

## 📝 Usage Examples

### **Join a Community**
```typescript
await CommunityMemberService.joinCommunity(userId, communityId)
```

### **Send a Message**
```typescript
const messageId = await MessageService.createMessage({
  communityId: 'global-chat',
  authorId: userAddress,
  authorUsername: username,
  content: 'Hello world!',
})
```

### **Vote on a Message**
```typescript
await MessageService.voteMessage(messageId, userId, communityId, 'upvote')
```

### **Edit a Message**
```typescript
const success = await MessageService.editMessage(messageId, newContent, userId)
```

## ⚡ Performance Optimizations

### **Indexes** (created automatically)
- Messages: `communityId`, `createdAt`, `isDeleted`
- Community Members: `userId`, `communityId`, `isActive`
- Message Votes: `messageId`, `userId`
- Message Views: `messageId`, `userId`

### **Real-time Listeners**
- Messages are loaded with real-time updates
- Limited to 50 messages initially with pagination
- Automatic cleanup of listeners

## 🔮 Next Steps

The database is now ready for production! You can:

1. **Test the complete flow**: Login → Join communities → Send messages → Vote/View
2. **Monitor usage**: Check Firebase console for real-time data
3. **Scale as needed**: Add indexes for performance optimization
4. **Add moderation**: Implement admin tools for managing reports

The app now has a fully functional, scalable database backend with real-time capabilities! 🎉
