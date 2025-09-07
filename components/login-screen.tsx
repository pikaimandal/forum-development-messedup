"use client"

import { useState } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"
import { checkOrbVerification, isUserAllowed } from "@/lib/verification"

interface LoginScreenProps {
  onLogin: () => void
}

type LoadingState = 'idle' | 'authenticating' | 'verifying'

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const { fetchUserData, setUser } = useUser()

  const handleWalletAuth = async () => {
    try {
      // Step 1: Start authentication
      console.log("🚀 Starting wallet authentication flow")
      setLoadingState('authenticating')

      // Get nonce from backend
      console.log("📡 Fetching nonce from backend...")
      const nonceResponse = await fetch('/api/nonce')
      if (!nonceResponse.ok) {
        throw new Error(`Failed to get nonce: ${nonceResponse.status} ${nonceResponse.statusText}`)
      }
      const { nonce } = await nonceResponse.json()
      console.log("✅ Nonce received:", nonce?.substring(0, 8) + "...")

      // Trigger wallet authentication using MiniKit
      console.log("🔐 Triggering MiniKit wallet authentication...")
      const walletAuthResult = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: `auth-${Date.now()}`,
        expirationTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        notBefore: new Date(),
        statement: "Sign in to Forum - Human Verified Community",
      })

      console.log("📋 Wallet auth result:", {
        hasCommandPayload: !!walletAuthResult.commandPayload,
        payloadKeys: walletAuthResult.commandPayload ? Object.keys(walletAuthResult.commandPayload) : []
      })

      // Check if the command was successful
      if (!walletAuthResult.commandPayload) {
        throw new Error('Authentication failed - no response from wallet')
      }

      // Verify the SIWE signature on backend (but without ORB verification check)
      console.log("🔍 Verifying SIWE signature on backend...")
      const verifyResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: walletAuthResult.commandPayload,
          nonce,
          skipOrbVerification: true // We'll do ORB verification separately in the frontend
        })
      })

      console.log("📡 Backend verification response:", {
        status: verifyResponse.status,
        statusText: verifyResponse.statusText,
        ok: verifyResponse.ok
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        console.log("❌ Backend verification failed:", errorData)
        throw new Error(errorData.error || 'Authentication verification failed')
      }

      const { address } = await verifyResponse.json()
      console.log("✅ SIWE verification successful for address:", address?.substring(0, 10) + "...")

      // Step 2: Now check ORB verification
      console.log("🔍 Starting ORB verification check...")
      setLoadingState('verifying')

      const isOrbVerified = await checkOrbVerification(address)
      console.log("🔍 ORB verification result:", isOrbVerified)
      
      // Check if user is allowed to use the app
      if (!isUserAllowed(address, isOrbVerified)) {
        throw new Error(`ORB Verification Required: This app requires World ID ORB verification. Please visit a World ID ORB location to verify your identity.\n\nFor testing: Only wallet address 0x948c3dc6a9ed728f010d1f163d45de4a3415b53a is allowed without ORB verification.`)
      }

      // Step 3: Fetch user data and complete login
      console.log("👤 Fetching user data from MiniKit...")
      const userData = await fetchUserData(address, isOrbVerified)
      setUser(userData)

      console.log("✅ Login completed successfully!")
      // Complete login
      onLogin()

    } catch (error) {
      console.error('💥 Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.'
      
      // Show detailed error information
      let detailedMessage = errorMessage
      if (error instanceof Error && error.message.includes('fetch')) {
        detailedMessage += '\n\nNetwork Error: Please check your internet connection and try again.'
      }
      
      console.log('🚨 Showing error to user:', detailedMessage)
      alert(`🔒 Authentication Error:\n\n${detailedMessage}`)
    } finally {
      setLoadingState('idle')
    }
  }

  const getButtonText = () => {
    switch (loadingState) {
      case 'authenticating':
        return 'Authenticating...'
      case 'verifying':
        return 'Verifying...'
      default:
        return 'Login with Wallet'
    }
  }

  const isLoading = loadingState !== 'idle'
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* App Logo */}
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-black">
          <img 
            src="/world-forum-logo.png" 
            alt="Forum Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Forum</CardTitle>
          <CardDescription>Join the world's first human-verified community platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Connect with verified humans from around the world</p>
          </div>

          <Button 
            onClick={handleWalletAuth} 
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold" 
            size="lg"
          >
            <img 
              src="/worldcoinlogo.png" 
              alt="Worldcoin Logo" 
              className="w-5 h-5 mr-2 object-contain"
            />
            {getButtonText()}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Human verification badge */}
      <div className="mt-8 flex items-center space-x-2 text-sm text-muted-foreground">
        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span>Human-verified community</span>
      </div>
    </div>
  )
}
