import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  // Generate a cryptographically secure nonce (at least 8 alphanumeric characters)
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16) // 16 character hex string

  // Store nonce in secure cookie
  cookies().set("siwe-nonce", nonce, { 
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 10 // 10 minutes
  })

  return NextResponse.json({ nonce })
}
