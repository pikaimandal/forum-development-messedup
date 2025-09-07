"use client"

import { useState } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { fetchUserData, setUser } = useUser()

  const handleWalletAuth = async () => {
    try {
      setIsLoading(true)

      // Step 1: Get nonce from backend
      const nonceResponse = await fetch('/api/nonce')
      if (!nonceResponse.ok) {
        throw new Error('Failed to get nonce')
      }
      const { nonce } = await nonceResponse.json()

      // Step 2: Trigger wallet authentication using MiniKit
      const walletAuthResult = await MiniKit.commandsAsync.walletAuth({
        nonce,
        requestId: `auth-${Date.now()}`,
        expirationTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        notBefore: new Date(),
        statement: "Sign in to Forum - Human Verified Community",
      })

      // Check if the command was successful
      if (!walletAuthResult.commandPayload) {
        throw new Error('Authentication failed - no response from wallet')
      }

      // Step 3: Verify the SIWE signature on backend
      const verifyResponse = await fetch('/api/complete-siwe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: walletAuthResult.commandPayload,
          nonce
        })
      })

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        throw new Error(errorData.error || 'Authentication verification failed')
      }

      const { address } = await verifyResponse.json()

      // Step 4: Fetch user data from MiniKit
      const userData = await fetchUserData(address)
      setUser(userData)

      // Step 5: Complete login
      onLogin()

    } catch (error) {
      console.error('Wallet authentication error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed. Please try again.'
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
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
            {isLoading ? 'Authenticating...' : 'Login with Wallet'}
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
