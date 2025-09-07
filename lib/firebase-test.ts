import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

/**
 * Test Firebase connection
 */
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    console.log('🔥 Testing Firebase connection...')
    
    // Try to read from a collection (this will work even if collection is empty)
    const testCollection = collection(db, 'test')
    await getDocs(testCollection)
    
    console.log('✅ Firebase connection successful!')
    return true
  } catch (error) {
    console.error('❌ Firebase connection failed:', error)
    return false
  }
}

// Test specific database operations
export async function testDatabaseOperations() {
  try {
    console.log('🧪 Testing database operations...')
    
    // Test reading communities (should work after initialization)
    const communitiesRef = collection(db, 'communities')
    const communitiesSnap = await getDocs(communitiesRef)
    
    console.log(`📊 Found ${communitiesSnap.size} communities in database`)
    
    if (communitiesSnap.size === 0) {
      console.log('⚠️  No communities found - run database initialization first')
      console.log('💡 Run: pnpm setup-db or POST /api/init-database')
    }
    
    return true
  } catch (error) {
    console.error('❌ Database operations test failed:', error)
    return false
  }
}
