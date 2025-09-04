"use client"

import { useState } from "react"
import { CommunitiesScreen } from "@/components/communities-screen"
import { ChatScreen } from "@/components/chat-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export type MainScreen = "communities" | "chat" | "profile"

interface MainAppProps {
  onLogout: () => void
}

export function MainApp({ onLogout }: MainAppProps) {
  const [currentScreen, setCurrentScreen] = useState<MainScreen>("communities")

  const renderScreen = () => {
    switch (currentScreen) {
      case "communities":
        return <CommunitiesScreen onNavigateToChat={() => setCurrentScreen("chat")} />
      case "chat":
        return <ChatScreen onBack={() => setCurrentScreen("communities")} />
      case "profile":
        return <ProfileScreen onLogout={onLogout} />
      default:
        return <CommunitiesScreen onNavigateToChat={() => setCurrentScreen("chat")} />
    }
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      <div className="flex-1 overflow-hidden min-h-0">{renderScreen()}</div>
      <BottomNavigation currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
    </div>
  )
}
