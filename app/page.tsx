"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { LoginScreen } from "@/components/login-screen"
import { MainApp } from "@/components/main-app"

export type Screen = "splash" | "login" | "main"

export default function WorldForumApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setCurrentScreen("login")
    }, 3000)

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
