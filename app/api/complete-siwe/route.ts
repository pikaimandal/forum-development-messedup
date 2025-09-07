import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySiweMessage } from "@worldcoin/minikit-js"
import { checkOrbVerification, isUserAllowed } from "@/lib/verification"

interface IRequestPayload {
  payload: any
  nonce: string
  skipOrbVerification?: boolean
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce, skipOrbVerification }: IRequestPayload = await req.json()

    // Get stored nonce from cookie
    const storedNonce = cookies().get("siwe-nonce")?.value

    if (!storedNonce || storedNonce !== nonce) {
      return NextResponse.json(
        { error: "Invalid or missing nonce" },
        { status: 400 }
      )
    }

    // Verify the SIWE message
    const validMessage = await verifySiweMessage(payload, nonce)

    if (!validMessage.isValid) {
      return NextResponse.json(
        { error: "Invalid SIWE signature" },
        { status: 400 }
      )
    }

    // Extract user data from the verified message
    const { address } = validMessage.siweMessageData
    
    if (!address) {
      return NextResponse.json(
        { error: "No address found in SIWE message" },
        { status: 400 }
      )
    }
    
    let isOrbVerified = false
    
    // Only check ORB verification if not skipped (frontend will handle it)
    if (!skipOrbVerification) {
      // Check ORB verification status
      isOrbVerified = await checkOrbVerification(address)
      
      // Check if user is allowed to use the app
      if (!isUserAllowed(address, isOrbVerified)) {
        return NextResponse.json(
          { 
            error: "ORB verification required", 
            message: "Forum requires ORB verification. Please visit a World ID ORB location to verify your identity.",
            isOrbVerified: false
          },
          { status: 403 }
        )
      }
    }
    
    // Clear the nonce cookie after successful verification
    cookies().delete("siwe-nonce")

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

    return NextResponse.json({ 
      success: true,
      address,
      isOrbVerified,
      message: "Authentication successful"
    })

  } catch (error) {
    console.error("SIWE verification error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
