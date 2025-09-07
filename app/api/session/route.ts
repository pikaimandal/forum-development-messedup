import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = cookies().get("session")?.value

    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false })
    }

    const sessionData = JSON.parse(sessionCookie)
    
    return NextResponse.json({ 
      isAuthenticated: true,
      address: sessionData.address,
      isOrbVerified: sessionData.isOrbVerified || false
    })

  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({ isAuthenticated: false })
  }
}
