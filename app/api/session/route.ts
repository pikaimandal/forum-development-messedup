import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { checkOrbVerification, isUserAllowed } from "@/lib/verification"

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = cookies().get("session")?.value

    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false })
    }

    const sessionData = JSON.parse(sessionCookie)
    
    // CRITICAL SECURITY: Re-validate ORB verification on every session check
    console.log("🔍 Re-validating ORB verification for session restoration")
    const currentOrbStatus = await checkOrbVerification(sessionData.address)
    console.log("🔍 Current ORB status:", currentOrbStatus, "for address:", sessionData.address)
    
    // Check if user is still allowed (current ORB status + test wallets)
    if (!isUserAllowed(sessionData.address, currentOrbStatus)) {
      console.log("❌ User no longer allowed - clearing session")
      // Clear invalid session
      cookies().delete("session")
      return NextResponse.json({ isAuthenticated: false })
    }
    
    return NextResponse.json({ 
      isAuthenticated: true,
      address: sessionData.address,
      isOrbVerified: currentOrbStatus // Use current status, not cached
    })

  } catch (error) {
    console.error("Session check error:", error)
    // Clear potentially corrupted session
    cookies().delete("session")
    return NextResponse.json({ isAuthenticated: false })
  }
}
