import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { checkOrbVerification, isUserAllowed } from "@/lib/verification"

interface ICreateSessionRequest {
  address: string
}

export async function POST(req: NextRequest) {
  console.log("🔐 Creating session after ORB verification")
  
  try {
    const { address }: ICreateSessionRequest = await req.json()
    
    if (!address) {
      console.log("❌ No address provided")
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      )
    }

    console.log("📍 Creating session for address:", address)
    
    // Verify ORB status again (security check)
    const isOrbVerified = await checkOrbVerification(address)
    console.log("🔍 ORB verification result:", isOrbVerified)
    
    // Double-check if user is allowed
    if (!isUserAllowed(address, isOrbVerified)) {
      console.log("❌ User not allowed - ORB verification required")
      return NextResponse.json(
        { error: "ORB verification required" },
        { status: 403 }
      )
    }

    // Create session data
    const sessionData = {
      address,
      isAuthenticated: true,
      isOrbVerified,
      authenticatedAt: new Date().toISOString()
    }

    // Set session cookie
    cookies().set("session", JSON.stringify(sessionData), {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    console.log("✅ Session created successfully")
    return NextResponse.json({ 
      success: true,
      address,
      isOrbVerified,
      message: "Session created successfully"
    })

  } catch (error) {
    console.error("💥 Session creation error:", error)
    return NextResponse.json(
      { error: "Session creation failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
