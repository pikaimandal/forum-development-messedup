import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  console.log("🚪 Logout API called")
  
  try {
    // Clear the session cookie
    cookies().delete("session")
    console.log("🗑️ Session cookie cleared")

    return NextResponse.json({ 
      success: true,
      message: "Logged out successfully"
    })

  } catch (error) {
    console.error("💥 Logout error:", error)
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    )
  }
}
