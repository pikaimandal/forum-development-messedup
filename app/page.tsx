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
    // Initialize MiniKit and check World App environment immediately
    const initializeMiniKit = async () => {
      try {
        // Check if running in World App environment (immediate check)
        const isInWorldApp = typeof window !== "undefined" && MiniKit.isInstalled()
        console.log("World App detection:", isInWorldApp)
        setIsWorldApp(isInWorldApp)
        
        if (isInWorldApp) {
          // MiniKit is available and installed
          setMiniKitInitialized(true)
          console.log("MiniKit initialized successfully in World App")
          
          // Check for existing session quickly
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
    
    // Move to appropriate screen based on current environment detection
    if (isWorldApp === false) {
      // Definitely not in World App - show warning
      setCurrentScreen("world-app-warning")
    } else if (isWorldApp === true && miniKitInitialized) {
      // Definitely in World App and initialized
      if (isAuthenticated) {
        setCurrentScreen("main")
      } else {
        setCurrentScreen("login")
      }
    } else {
      // If still uncertain about environment after 3 seconds, assume not in World App
      console.log("Environment detection uncertain after timeout, assuming not in World App")
      setIsWorldApp(false)
      setCurrentScreen("world-app-warning")
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
