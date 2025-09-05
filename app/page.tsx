"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { LoginScreen } from "@/components/login-screen"
import { MainApp } from "@/components/main-app"
import type { Screen } from "@/types"
import { APP_CONFIG } from "@/lib/constants"

export default function WorldForumApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Show splash screen for configured duration
    const timer = setTimeout(() => {
      setCurrentScreen("login")
    }, APP_CONFIG.splashDuration)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentScreen("main")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentScreen("login")
  }

  if (currentScreen === "splash") {
    return <SplashScreen />
  }

  if (currentScreen === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  return <MainApp onLogout={handleLogout} />
}
