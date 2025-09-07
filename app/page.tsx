"use client"

import { useState, useEffect } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { SplashScreen } from "@/components/splash-screen"
import { LoginScreen } from "@/components/login-screen"
import { MainApp } from "@/components/main-app"
import { WorldAppWarning } from "@/components/world-app-warning"
import { useUser } from "@/contexts/user-context"
import type { Screen } from "@/types"

export default function ForumApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash")
  const [isWorldApp, setIsWorldApp] = useState<boolean | null>(null)
  const [miniKitInitialized, setMiniKitInitialized] = useState(false)
  const [initializationComplete, setInitializationComplete] = useState(false)
  const { user, setUser, fetchUserData } = useUser()

  // Use authentication state from user context
  const isAuthenticated = user !== null

  useEffect(() => {
    // Initialize MiniKit and check World App environment
    const initializeMiniKit = async () => {
      try {
        // Wait a moment for MiniKit to be available
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Check if running in World App environment
        const isInWorldApp = typeof window !== "undefined" && MiniKit.isInstalled()
        console.log("World App detection:", isInWorldApp)
        setIsWorldApp(isInWorldApp)
        
        if (isInWorldApp) {
          // MiniKit is available and installed
          setMiniKitInitialized(true)
          console.log("MiniKit initialized successfully in World App")
          
          // Check for existing session
          try {
            const sessionResponse = await fetch('/api/session')
            if (sessionResponse.ok) {
              const { isAuthenticated, address, isOrbVerified } = await sessionResponse.json()
              if (isAuthenticated && address) {
                // Restore user session
                const userData = await fetchUserData(address, isOrbVerified)
                setUser(userData)
              }
            }
          } catch (error) {
            console.log("Session check failed:", error)
          }
        } else {
          console.log("App is not running in World App environment")
        }
      } catch (error) {
        console.error("MiniKit initialization error:", error)
        setIsWorldApp(false)
      }
    }

    // Start initialization immediately
    initializeMiniKit()
  }, [setUser])

  // Handle splash screen completion
  const handleSplashComplete = () => {
    console.log("Splash complete - isWorldApp:", isWorldApp, "miniKitInitialized:", miniKitInitialized, "isAuthenticated:", isAuthenticated)
    setInitializationComplete(true)
    
    // Move to appropriate screen based on environment
    if (isWorldApp === false) {
      // Not in World App - will show warning via render logic
      setCurrentScreen("world-app-warning")
      return
    }
    
    if (isWorldApp === true && miniKitInitialized) {
      if (isAuthenticated) {
        setCurrentScreen("main")
      } else {
        setCurrentScreen("login")
      }
    } else {
      // Still not sure about environment, keep showing splash
      setCurrentScreen("splash")
    }
  }
  const handleLogin = () => {
    // Authentication is handled in LoginScreen via user context
    setCurrentScreen("main")
  }

  const handleLogout = () => {
    setUser(null) // Clear user data
    setCurrentScreen("login")
  }

  // Show splash screen during initialization
  if (currentScreen === "splash" || !initializationComplete) {
    return <SplashScreen onInitializationComplete={handleSplashComplete} />
  }

  // Block access if not in World App (explicit screen state or environment check)
  if (currentScreen === "world-app-warning" || isWorldApp === false) {
    return <WorldAppWarning />
  }

  // Show loading if still checking World App environment
  if (isWorldApp === null) {
    return <SplashScreen onInitializationComplete={handleSplashComplete} />
  }

  if (currentScreen === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <MainApp onLogout={handleLogout} />
}
