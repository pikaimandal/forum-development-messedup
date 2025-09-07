import { NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/firebase-utils"

export async function POST(req: NextRequest) {
  try {
    console.log("🔥 Initializing Firebase database...")
    await initializeDatabase()
    
    return NextResponse.json({ 
      success: true,
      message: "Database initialized successfully" 
    })
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return NextResponse.json(
      { 
        error: "Database initialization failed", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

// Allow GET requests to check if database is initialized
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: "Database initialization endpoint",
    note: "Send a POST request to initialize the database with default communities" 
  })
}
