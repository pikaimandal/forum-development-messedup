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
    let debugLog = "🚀 Starting wallet authentication flow\n"
    
    try {
      // Step 0: Check if MiniKit is installed and running in World App
      debugLog += "🔍 Checking MiniKit installation status...\n"
      console.log("🔍 Checking MiniKit installation status...")
      
      if (!MiniKit.isInstalled()) {
        debugLog += "❌ MiniKit is not installed or not running in World App\n"
        alert(`🔍 DEBUG LOG:\n\n${debugLog}\n\n❌ ERROR: This app must be opened within World App. Please open this app through World App.`)
        throw new Error('MiniKit is not installed. Please open this app in World App.')
      }
      
      debugLog += "✅ MiniKit is installed and running in World App\n"
      console.log("✅ MiniKit is installed and running in World App")

      // Step 1: Start authentication
      console.log("🚀 Starting wallet authentication flow")
      setLoadingState('authenticating')

      // Get nonce from backend
      debugLog += "📡 Fetching nonce from backend...\n"
      console.log("📡 Fetching nonce from backend...")
      const nonceResponse = await fetch('/api/nonce')
      
      debugLog += `📡 Nonce response status: ${nonceResponse.status} ${nonceResponse.statusText}\n`
      
      if (!nonceResponse.ok) {
        throw new Error(`Failed to get nonce: ${nonceResponse.status} ${nonceResponse.statusText}`)
      }
      const { nonce } = await nonceResponse.json()
      debugLog += `✅ Nonce received: ${nonce?.substring(0, 8)}...\n`
      console.log("✅ Nonce received:", nonce?.substring(0, 8) + "...")

      // Trigger wallet authentication using MiniKit
      debugLog += "🔐 Triggering MiniKit wallet authentication...\n"
      console.log("🔐 Triggering MiniKit wallet authentication...")
      const walletAuthResult = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: `auth-${Date.now()}`,
        expirationTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        notBefore: new Date(),
        statement: "Sign in to Forum - Human Verified Community",
      })

      debugLog += `📋 Wallet auth result:\n`
      debugLog += `  - hasCommandPayload: ${!!walletAuthResult.commandPayload}\n`
      debugLog += `  - hasFinalPayload: ${!!walletAuthResult.finalPayload}\n`
      debugLog += `  - commandPayload keys: ${walletAuthResult.commandPayload ? Object.keys(walletAuthResult.commandPayload).join(', ') : 'none'}\n`
      debugLog += `  - finalPayload keys: ${walletAuthResult.finalPayload ? Object.keys(walletAuthResult.finalPayload).join(', ') : 'none'}\n`
      
      console.log("📋 Wallet auth result:", {
        hasCommandPayload: !!walletAuthResult.commandPayload,
        hasFinalPayload: !!walletAuthResult.finalPayload,
        commandPayloadKeys: walletAuthResult.commandPayload ? Object.keys(walletAuthResult.commandPayload) : [],
        finalPayloadKeys: walletAuthResult.finalPayload ? Object.keys(walletAuthResult.finalPayload) : []
      })

      // According to docs, we should use finalPayload for SIWE verification
      if (!walletAuthResult.finalPayload) {
        debugLog += "❌ No finalPayload received from wallet auth\n"
        throw new Error('Authentication failed - no finalPayload from wallet')
      }

      // Check if finalPayload indicates an error
      if (walletAuthResult.finalPayload.status === 'error') {
        debugLog += `❌ Wallet auth error status\n`
        throw new Error(`Wallet authentication failed`)
      }

      // Verify the SIWE signature on backend (but without ORB verification check)
      debugLog += "🔍 Verifying SIWE signature on backend...\n"
      console.log("🔍 Verifying SIWE signature on backend...")
      
      const requestBody = {
        payload: walletAuthResult.finalPayload, // Use finalPayload as per docs
        nonce,
        skipOrbVerification: true // We'll do ORB verification separately in the frontend
      }
      debugLog += `📤 Request body: ${JSON.stringify(requestBody, null, 2).substring(0, 200)}...\n`
      
      const verifyResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      debugLog += `📡 Backend verification response: ${verifyResponse.status} ${verifyResponse.statusText}\n`
      console.log("📡 Backend verification response:", {
        status: verifyResponse.status,
        statusText: verifyResponse.statusText,
        ok: verifyResponse.ok
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        debugLog += `❌ Backend verification failed: ${JSON.stringify(errorData)}\n`
        console.log("❌ Backend verification failed:", errorData)
        
        // Show debug log before throwing error
        alert(`🔍 DEBUG LOG:\n\n${debugLog}\n\n❌ ERROR: ${errorData.error || 'Authentication verification failed'}`)
        throw new Error(errorData.error || 'Authentication verification failed')
      }

      const { address } = await verifyResponse.json()
      debugLog += `✅ SIWE verification successful for address: ${address?.substring(0, 10)}...\n`
      console.log("✅ SIWE verification successful for address:", address?.substring(0, 10) + "...")

      // Step 2: Now check ORB verification
      debugLog += "🔍 Starting ORB verification check...\n"
      console.log("🔍 Starting ORB verification check...")
      setLoadingState('verifying')

      const isOrbVerified = await checkOrbVerification(address)
      debugLog += `🔍 ORB verification result: ${isOrbVerified}\n`
      console.log("🔍 ORB verification result:", isOrbVerified)
      
      // Check if user is allowed to use the app
      if (!isUserAllowed(address, isOrbVerified)) {
        debugLog += "❌ User not allowed - ORB verification required\n"
        alert(`🔍 DEBUG LOG:\n\n${debugLog}\n\n❌ ORB Verification Required: This app requires World ID ORB verification. Please visit a World ID ORB location to verify your identity.\n\nFor testing: Only wallet address 0x948c3dc6a9ed728f010d1f163d45de4a3415b53a is allowed without ORB verification.`)
        throw new Error(`ORB Verification Required: This app requires World ID ORB verification. Please visit a World ID ORB location to verify your identity.\n\nFor testing: Only wallet address 0x948c3dc6a9ed728f010d1f163d45de4a3415b53a is allowed without ORB verification.`)
      }

      // Step 3: Fetch user data and complete login
      debugLog += "👤 Fetching user data from MiniKit...\n"
      console.log("👤 Fetching user data from MiniKit...")
      const userData = await fetchUserData(address, isOrbVerified)
      setUser(userData)

      debugLog += "✅ Login completed successfully!\n"
      console.log("✅ Login completed successfully!")
      
      // Show success debug log
      alert(`🎉 SUCCESS!\n\n${debugLog}`)
      
      // Complete login
      onLogin()

    } catch (error) {
      console.error('💥 Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.'
      
      debugLog += `💥 Error caught: ${errorMessage}\n`
      
      // Show detailed error information with full debug log
      let detailedMessage = `🔍 FULL DEBUG LOG:\n\n${debugLog}\n\n💥 FINAL ERROR:\n${errorMessage}`
      
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
