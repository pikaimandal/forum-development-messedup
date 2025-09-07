"use client"

import { useState, useEffect } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { SplashScreen } from "@/components/splash-screen"
import { LoginScreen } from "@/components/login-screen"
import { MainApp } from "@/components/main-app"
import { WorldAppWarning } from "@/components/world-app-warning"
import { useUser } from "@/contexts/user-context"
import type { Screen } from "@/types"
import { APP_CONFIG } from "@/lib/constants"

export default function ForumApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash")
  const [isWorldApp, setIsWorldApp] = useState<boolean | null>(null)
  const [miniKitInitialized, setMiniKitInitialized] = useState(false)
  const { user, setUser, fetchUserData } = useUser()

  // Use authentication state from user context
  const isAuthenticated = user !== null

  useEffect(() => {
    // Initialize MiniKit and check World App environment during splash screen
    const initializeMiniKit = async () => {
      try {
        // Wait a moment for MiniKit to be available
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Check if running in World App environment
        const isInWorldApp = typeof window !== "undefined" && MiniKit.isInstalled()
        setIsWorldApp(isInWorldApp)
        
        if (isInWorldApp) {
          // MiniKit is available and installed
          setMiniKitInitialized(true)
          console.log("MiniKit initialized successfully in World App")
          
          // Check for existing session
          try {
            const sessionResponse = await fetch('/api/session')
            if (sessionResponse.ok) {
              const { isAuthenticated, address } = await sessionResponse.json()
              if (isAuthenticated && address) {
                // Restore user session
                const userData = await fetchUserData(address)
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

    // Show splash screen for configured duration to complete initialization
    const timer = setTimeout(() => {
      // After splash duration, move to next screen based on environment
      if (isWorldApp !== null) {
        if (isWorldApp && miniKitInitialized) {
          // If user is already authenticated, go to main app
          if (isAuthenticated) {
            setCurrentScreen("main")
          } else {
            setCurrentScreen("login")
          }
        }
        // If not in World App, the component will show warning automatically
      }
    }, APP_CONFIG.splashDuration)

    return () => clearTimeout(timer)
  }, [isWorldApp, miniKitInitialized, isAuthenticated, setUser])
  const handleLogin = () => {
    // Authentication is handled in LoginScreen via user context
    setCurrentScreen("main")
  }

  const handleLogout = () => {
    setUser(null) // Clear user data
    setCurrentScreen("login")
  }

  // Show splash screen during initialization
  if (currentScreen === "splash") {
    return <SplashScreen />
  }

  // Block access if not in World App
  if (isWorldApp === false) {
    return <WorldAppWarning />
  }

  // Show loading if still checking World App environment
  if (isWorldApp === null) {
    return <SplashScreen />
  }

  if (currentScreen === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <MainApp onLogout={handleLogout} />
}
