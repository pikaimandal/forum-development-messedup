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
  console.log("🔐 SIWE verification started")
  
  try {
    const requestBody = await req.json()
    console.log("📝 Request body received:", {
      hasPayload: !!requestBody.payload,
      hasNonce: !!requestBody.nonce,
      skipOrbVerification: requestBody.skipOrbVerification,
      payloadKeys: requestBody.payload ? Object.keys(requestBody.payload) : []
    })

    const { payload, nonce, skipOrbVerification }: IRequestPayload = requestBody

    // Get stored nonce from cookie
    const storedNonce = cookies().get("siwe-nonce")?.value
    console.log("🍪 Nonce comparison:", {
      receivedNonce: nonce?.substring(0, 8) + "...",
      storedNonce: storedNonce?.substring(0, 8) + "...",
      nonceMatch: storedNonce === nonce
    })

    if (!storedNonce || storedNonce !== nonce) {
      console.log("❌ Nonce validation failed")
      return NextResponse.json(
        { error: "Invalid or missing nonce" },
        { status: 400 }
      )
    }

    console.log("✅ Nonce validation passed, verifying SIWE message...")

    // Verify the SIWE message
    const validMessage = await verifySiweMessage(payload, nonce)
    console.log("🔍 SIWE verification result:", {
      isValid: validMessage.isValid,
      hasMessageData: !!validMessage.siweMessageData,
      address: validMessage.siweMessageData?.address?.substring(0, 10) + "...",
    })

    if (!validMessage.isValid) {
      console.log("❌ SIWE signature verification failed")
      return NextResponse.json(
        { error: "Invalid SIWE signature" },
        { status: 400 }
      )
    }

    // Extract user data from the verified message
    const { address } = validMessage.siweMessageData
    console.log("📍 Extracted address:", address)
    
    if (!address) {
      console.log("❌ No address found in SIWE message")
      return NextResponse.json(
        { error: "No address found in SIWE message" },
        { status: 400 }
      )
    }
    
    let isOrbVerified = false
    
    // Only check ORB verification if not skipped (frontend will handle it)
    if (!skipOrbVerification) {
      console.log("🔍 Starting ORB verification check...")
      // Check ORB verification status
      isOrbVerified = await checkOrbVerification(address)
      console.log("🔍 ORB verification result:", isOrbVerified)
      
      // Check if user is allowed to use the app
      if (!isUserAllowed(address, isOrbVerified)) {
        console.log("❌ User not allowed - ORB verification required")
        return NextResponse.json(
          { 
            error: "ORB verification required", 
            message: "Forum requires ORB verification. Please visit a World ID ORB location to verify your identity.",
            isOrbVerified: false
          },
          { status: 403 }
        )
      }
    } else {
      console.log("⏭️ Skipping ORB verification (will be handled in frontend)")
    }
    
    // Clear the nonce cookie after successful verification
    cookies().delete("siwe-nonce")
    console.log("🗑️ Nonce cookie cleared")

    // Only create session if ORB verification was completed here
    // If ORB verification is skipped, frontend must handle session creation after verification
    if (!skipOrbVerification) {
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
      console.log("🍪 Session cookie set successfully")
    } else {
      console.log("⏭️ Skipping session creation - frontend will handle after ORB verification")
    }

    console.log("✅ SIWE verification completed successfully")
    return NextResponse.json({ 
      success: true,
      address,
      isOrbVerified,
      message: "Authentication successful"
    })

  } catch (error) {
    console.error("💥 SIWE verification error:", error)
    console.error("💥 Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: "Authentication failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
