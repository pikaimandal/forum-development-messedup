"use client"

import { useState } from "react"
import { CommunitiesScreen } from "@/components/communities-screen"
import { CommunityDetailScreen } from "@/components/community-detail-screen"
import { DiscoverScreen } from "@/components/discover-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export type MainScreen = "communities" | "community-detail" | "discover" | "profile"

interface MainAppProps {
  onLogout: () => void
}

export function MainApp({ onLogout }: MainAppProps) {
  const [currentScreen, setCurrentScreen] = useState<MainScreen>("communities")
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("")
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(
    new Set(["global-chat", "world-news", "qa", "announcements"]),
  )

  const handleNavigateToCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId)
    setCurrentScreen("community-detail")
  }

  const handleJoinCommunity = (communityId: string) => {
    setJoinedCommunities((prev) => new Set([...prev, communityId]))
  }

  const handleLeaveCommunity = (communityId: string) => {
    setJoinedCommunities((prev) => {
      const newSet = new Set(prev)
      newSet.delete(communityId)
      return newSet
    })
  }

  const handleEnterChat = (communityId: string) => {
    setSelectedCommunityId(communityId)
    setCurrentScreen("community-detail") // Navigate back to community detail, then to chat
    // In a real app, you might want to add a separate chat state
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "communities":
        return (
          <CommunitiesScreen onNavigateToCommunity={handleNavigateToCommunity} joinedCommunities={joinedCommunities} />
        )
      case "community-detail":
        return (
          <CommunityDetailScreen
            communityId={selectedCommunityId}
            onBack={() => setCurrentScreen("communities")}
            onJoinCommunity={handleJoinCommunity}
            onLeaveCommunity={handleLeaveCommunity}
            onEnterChat={(communityId) => {
              setSelectedCommunityId(communityId)
              // Chat is now accessed through community detail page
            }}
            isJoined={joinedCommunities.has(selectedCommunityId)}
          />
        )
      case "discover":
        return <DiscoverScreen onNavigateToCommunity={handleNavigateToCommunity} />
      case "profile":
        return <ProfileScreen onLogout={onLogout} />
      default:
        return (
          <CommunitiesScreen onNavigateToCommunity={handleNavigateToCommunity} joinedCommunities={joinedCommunities} />
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      <div className="flex-1 overflow-hidden min-h-0">{renderScreen()}</div>
      <BottomNavigation currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
    </div>
  )
}
