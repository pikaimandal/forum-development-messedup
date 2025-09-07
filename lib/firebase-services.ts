import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  increment,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  Query,
  DocumentReference,
} from 'firebase/firestore'
import { db } from './firebase'
import { 
  FirebaseUser, 
  FirebaseCommunity, 
  FirebaseCommunityMember, 
  FirebaseMessage, 
  FirebaseMessageVote, 
  FirebaseMessageView, 
  FirebaseMessageReport,
  COLLECTIONS,
  DEFAULT_COMMUNITIES 
} from '@/types/firebase'

// User Operations
export class UserService {
  static async createUser(userData: {
    id: string // wallet address
    username: string
    displayName: string
    profilePicture?: string
    isVerified: boolean
    isOrbVerified: boolean
  }): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userData.id)
    const now = serverTimestamp()
    
    await updateDoc(userRef, {
      ...userData,
      lastActive: now,
      joinedCommunitiesCount: 0,
      totalMessages: 0,
      totalUpvotes: 0,
      totalDownvotes: 0,
      createdAt: now,
      updatedAt: now,
    }).catch(async () => {
      // Document doesn't exist, create it
      await addDoc(collection(db, COLLECTIONS.USERS), {
        ...userData,
        lastActive: now,
        joinedCommunitiesCount: 0,
        totalMessages: 0,
        totalUpvotes: 0,
        totalDownvotes: 0,
        createdAt: now,
        updatedAt: now,
      })
    })
  }

  static async getUser(userId: string): Promise<FirebaseUser | null> {
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as FirebaseUser
    }
    return null
  }

  static async updateUserActivity(userId: string): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    await updateDoc(userRef, {
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  static async updateUserStats(userId: string, stats: {
    joinedCommunitiesCount?: number
    totalMessages?: number
    totalUpvotes?: number
    totalDownvotes?: number
  }): Promise<void> {
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    const updateData: any = { updatedAt: serverTimestamp() }
    
    if (stats.joinedCommunitiesCount !== undefined) {
      updateData.joinedCommunitiesCount = increment(stats.joinedCommunitiesCount)
    }
    if (stats.totalMessages !== undefined) {
      updateData.totalMessages = increment(stats.totalMessages)
    }
    if (stats.totalUpvotes !== undefined) {
      updateData.totalUpvotes = increment(stats.totalUpvotes)
    }
    if (stats.totalDownvotes !== undefined) {
      updateData.totalDownvotes = increment(stats.totalDownvotes)
    }
    
    await updateDoc(userRef, updateData)
  }
}

// Community Operations
export class CommunityService {
  static async initializeDefaultCommunities(): Promise<void> {
    const batch = writeBatch(db)
    const now = serverTimestamp()
    
    for (const community of DEFAULT_COMMUNITIES) {
      const communityRef = doc(db, COLLECTIONS.COMMUNITIES, community.id)
      batch.set(communityRef, {
        ...community,
        memberCount: 0,
        messageCount: 0,
        createdAt: now,
        updatedAt: now,
      })
    }
    
    await batch.commit()
  }

  static async getAllCommunities(): Promise<FirebaseCommunity[]> {
    const communitiesQuery = query(
      collection(db, COLLECTIONS.COMMUNITIES),
      where('isActive', '==', true),
      orderBy('name')
    )
    
    const querySnapshot = await getDocs(communitiesQuery)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseCommunity[]
  }

  static async getCommunity(communityId: string): Promise<FirebaseCommunity | null> {
    const communityRef = doc(db, COLLECTIONS.COMMUNITIES, communityId)
    const communitySnap = await getDoc(communityRef)
    
    if (communitySnap.exists()) {
      return { id: communitySnap.id, ...communitySnap.data() } as FirebaseCommunity
    }
    return null
  }

  static async updateCommunityStats(communityId: string, stats: {
    memberCount?: number
    messageCount?: number
    lastMessageAt?: Timestamp
    lastMessageBy?: string
  }): Promise<void> {
    const communityRef = doc(db, COLLECTIONS.COMMUNITIES, communityId)
    const updateData: any = { updatedAt: serverTimestamp() }
    
    if (stats.memberCount !== undefined) {
      updateData.memberCount = increment(stats.memberCount)
    }
    if (stats.messageCount !== undefined) {
      updateData.messageCount = increment(stats.messageCount)
    }
    if (stats.lastMessageAt) {
      updateData.lastMessageAt = stats.lastMessageAt
    }
    if (stats.lastMessageBy) {
      updateData.lastMessageBy = stats.lastMessageBy
    }
    
    await updateDoc(communityRef, updateData)
  }
}

// Community Membership Operations
export class CommunityMemberService {
  static async joinCommunity(userId: string, communityId: string): Promise<void> {
    const batch = writeBatch(db)
    const now = serverTimestamp()
    const membershipId = `${communityId}_${userId}`
    
    // Create membership record
    const memberRef = doc(db, COLLECTIONS.COMMUNITY_MEMBERS, membershipId)
    batch.set(memberRef, {
      id: membershipId,
      communityId,
      userId,
      joinedAt: now,
      role: 'member',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    })
    
    // Update community member count
    const communityRef = doc(db, COLLECTIONS.COMMUNITIES, communityId)
    batch.update(communityRef, {
      memberCount: increment(1),
      updatedAt: now,
    })
    
    // Update user joined communities count
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    batch.update(userRef, {
      joinedCommunitiesCount: increment(1),
      updatedAt: now,
    })
    
    await batch.commit()
  }

  static async leaveCommunity(userId: string, communityId: string): Promise<void> {
    const batch = writeBatch(db)
    const now = serverTimestamp()
    const membershipId = `${communityId}_${userId}`
    
    // Delete membership record
    const memberRef = doc(db, COLLECTIONS.COMMUNITY_MEMBERS, membershipId)
    batch.delete(memberRef)
    
    // Update community member count
    const communityRef = doc(db, COLLECTIONS.COMMUNITIES, communityId)
    batch.update(communityRef, {
      memberCount: increment(-1),
      updatedAt: now,
    })
    
    // Update user joined communities count
    const userRef = doc(db, COLLECTIONS.USERS, userId)
    batch.update(userRef, {
      joinedCommunitiesCount: increment(-1),
      updatedAt: now,
    })
    
    await batch.commit()
  }

  static async getUserCommunities(userId: string): Promise<string[]> {
    const membersQuery = query(
      collection(db, COLLECTIONS.COMMUNITY_MEMBERS),
      where('userId', '==', userId),
      where('isActive', '==', true)
    )
    
    const querySnapshot = await getDocs(membersQuery)
    return querySnapshot.docs.map(doc => doc.data().communityId)
  }

  static async isMember(userId: string, communityId: string): Promise<boolean> {
    const membershipId = `${communityId}_${userId}`
    const memberRef = doc(db, COLLECTIONS.COMMUNITY_MEMBERS, membershipId)
    const memberSnap = await getDoc(memberRef)
    
    return memberSnap.exists() && memberSnap.data()?.isActive === true
  }

  static async getCommunityMembers(communityId: string, limitCount = 50): Promise<FirebaseCommunityMember[]> {
    const membersQuery = query(
      collection(db, COLLECTIONS.COMMUNITY_MEMBERS),
      where('communityId', '==', communityId),
      where('isActive', '==', true),
      orderBy('joinedAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(membersQuery)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseCommunityMember[]
  }
}

// Message Operations
export class MessageService {
  static async createMessage(messageData: {
    communityId: string
    authorId: string
    authorUsername: string
    authorProfilePicture?: string
    content: string
    replyTo?: {
      messageId: string
      authorUsername: string
      content: string
    }
  }): Promise<string> {
    const batch = writeBatch(db)
    const now = serverTimestamp()
    
    // Create message
    const messageRef = doc(collection(db, COLLECTIONS.MESSAGES))
    const messageId = messageRef.id
    
    batch.set(messageRef, {
      id: messageId,
      ...messageData,
      isEdited: false,
      canEdit: true,
      upvotes: 0,
      downvotes: 0,
      views: 0,
      replyCount: 0,
      reportCount: 0,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    })
    
    // Update community stats
    const communityRef = doc(db, COLLECTIONS.COMMUNITIES, messageData.communityId)
    batch.update(communityRef, {
      messageCount: increment(1),
      lastMessageAt: now,
      lastMessageBy: messageData.authorUsername,
      updatedAt: now,
    })
    
    // Update user stats
    const userRef = doc(db, COLLECTIONS.USERS, messageData.authorId)
    batch.update(userRef, {
      totalMessages: increment(1),
      updatedAt: now,
    })
    
    await batch.commit()
    return messageId
  }

  static async getCommunityMessages(
    communityId: string, 
    limitCount = 50, 
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ messages: FirebaseMessage[], lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    let messagesQuery: Query<DocumentData> = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('communityId', '==', communityId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    if (lastDoc) {
      messagesQuery = query(messagesQuery, startAfter(lastDoc))
    }
    
    const querySnapshot = await getDocs(messagesQuery)
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirebaseMessage[]
    
    const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1]
    
    return { messages, lastDoc: lastDocument }
  }

  static async editMessage(messageId: string, newContent: string, userId: string): Promise<boolean> {
    const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId)
    const messageSnap = await getDoc(messageRef)
    
    if (!messageSnap.exists()) return false
    
    const messageData = messageSnap.data() as FirebaseMessage
    
    // Check if user is the author
    if (messageData.authorId !== userId) return false
    
    // Check if message can still be edited (within 5 minutes and not already edited)
    const now = new Date()
    const createdAt = messageData.createdAt.toDate()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
    
    if (createdAt < fiveMinutesAgo || messageData.isEdited) return false
    
    // Update message
    await updateDoc(messageRef, {
      content: newContent,
      isEdited: true,
      editedAt: serverTimestamp(),
      canEdit: false,
      updatedAt: serverTimestamp(),
    })
    
    return true
  }

  static async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId)
    const messageSnap = await getDoc(messageRef)
    
    if (!messageSnap.exists()) return false
    
    const messageData = messageSnap.data() as FirebaseMessage
    
    // Check if user is the author (or add admin/moderator check)
    if (messageData.authorId !== userId) return false
    
    // Soft delete message
    await updateDoc(messageRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    return true
  }

  static async recordMessageView(messageId: string, userId: string, communityId: string): Promise<void> {
    const viewId = `${messageId}_${userId}`
    const viewRef = doc(db, COLLECTIONS.MESSAGE_VIEWS, viewId)
    const now = serverTimestamp()
    
    // Check if view already exists
    const viewSnap = await getDoc(viewRef)
    if (viewSnap.exists()) return
    
    const batch = writeBatch(db)
    
    // Create view record
    batch.set(viewRef, {
      id: viewId,
      messageId,
      userId,
      communityId,
      viewedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    
    // Update message view count
    const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId)
    batch.update(messageRef, {
      views: increment(1),
      updatedAt: now,
    })
    
    await batch.commit()
  }

  static async voteMessage(
    messageId: string, 
    userId: string, 
    communityId: string, 
    voteType: 'upvote' | 'downvote'
  ): Promise<void> {
    const voteId = `${messageId}_${userId}`
    const voteRef = doc(db, COLLECTIONS.MESSAGE_VOTES, voteId)
    const voteSnap = await getDoc(voteRef)
    const now = serverTimestamp()
    const batch = writeBatch(db)
    
    if (voteSnap.exists()) {
      const existingVote = voteSnap.data() as FirebaseMessageVote
      
      if (existingVote.voteType === voteType) {
        // Remove vote if same type
        batch.delete(voteRef)
        
        // Update message vote count
        const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId)
        batch.update(messageRef, {
          [voteType === 'upvote' ? 'upvotes' : 'downvotes']: increment(-1),
          updatedAt: now,
        })
      } else {
        // Change vote type
        batch.update(voteRef, {
          voteType,
          updatedAt: now,
        })
        
        // Update message vote counts
        const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId)
        batch.update(messageRef, {
          [existingVote.voteType === 'upvote' ? 'upvotes' : 'downvotes']: increment(-1),
          [voteType === 'upvote' ? 'upvotes' : 'downvotes']: increment(1),
          updatedAt: now,
        })
      }
    } else {
      // Create new vote
      batch.set(voteRef, {
        id: voteId,
        messageId,
        userId,
        communityId,
        voteType,
        createdAt: now,
        updatedAt: now,
      })
      
      // Update message vote count
      const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId)
      batch.update(messageRef, {
        [voteType === 'upvote' ? 'upvotes' : 'downvotes']: increment(1),
        updatedAt: now,
      })
    }
    
    await batch.commit()
  }

  static async reportMessage(
    messageId: string, 
    userId: string, 
    communityId: string, 
    reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other',
    description?: string
  ): Promise<void> {
    const reportId = `${messageId}_${userId}`
    const reportRef = doc(db, COLLECTIONS.MESSAGE_REPORTS, reportId)
    const now = serverTimestamp()
    
    // Check if report already exists
    const reportSnap = await getDoc(reportRef)
    if (reportSnap.exists()) return
    
    const batch = writeBatch(db)
    
    // Create report record
    batch.set(reportRef, {
      id: reportId,
      messageId,
      userId,
      communityId,
      reason,
      description,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })
    
    // Update message report count
    const messageRef = doc(db, COLLECTIONS.MESSAGES, messageId)
    batch.update(messageRef, {
      reportCount: increment(1),
      updatedAt: now,
    })
    
    await batch.commit()
  }

  // Real-time message listener
  static subscribeToMessages(
    communityId: string, 
    callback: (messages: FirebaseMessage[]) => void,
    limitCount = 50
  ): () => void {
    const messagesQuery = query(
      collection(db, COLLECTIONS.MESSAGES),
      where('communityId', '==', communityId),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirebaseMessage[]
      
      callback(messages.reverse()) // Reverse to show oldest first
    })
  }
}
