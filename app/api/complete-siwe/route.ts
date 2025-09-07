import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySiweMessage } from "@worldcoin/minikit-js"

interface IRequestPayload {
  payload: any
  nonce: string
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce }: IRequestPayload = await req.json()

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
    
    // Clear the nonce cookie after successful verification
    cookies().delete("siwe-nonce")

    // Create session data
    const sessionData = {
      address,
      isAuthenticated: true,
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
