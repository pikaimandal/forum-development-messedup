import { initializeDatabase } from '@/lib/firebase-utils'

/**
 * Database setup script
 * Run this once to initialize the Firebase database with default communities
 */
async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...')
    await initializeDatabase()
    console.log('✅ Database setup completed successfully!')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
}

export { setupDatabase }
