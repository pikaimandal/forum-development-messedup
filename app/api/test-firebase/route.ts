import { NextRequest, NextResponse } from "next/server"
import { testFirebaseConnection, testDatabaseOperations } from "@/lib/firebase-test"

export async function GET(req: NextRequest) {
  try {
    console.log("🧪 Running Firebase tests...")
    
    // Test basic connection
    const connectionTest = await testFirebaseConnection()
    if (!connectionTest) {
      return NextResponse.json(
        { 
          error: "Firebase connection failed",
          suggestion: "Check your Firebase configuration in .env.local" 
        },
        { status: 500 }
      )
    }
    
    // Test database operations
    const operationsTest = await testDatabaseOperations()
    
    return NextResponse.json({ 
      success: true,
      message: "Firebase tests completed",
      tests: {
        connection: connectionTest,
        operations: operationsTest
      }
    })
  } catch (error) {
    console.error("❌ Firebase test failed:", error)
    return NextResponse.json(
      { 
        error: "Firebase test failed", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}
