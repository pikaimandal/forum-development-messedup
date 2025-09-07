"use client"

import { useState, useEffect } from "react"
import { CommunitiesScreen } from "@/components/communities-screen"
import { CommunityDetailScreen } from "@/components/community-detail-screen"
import { ChatScreen } from "@/components/chat-screen"
import { DiscoverScreen } from "@/components/discover-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { BottomNavigation } from "@/components/bottom-navigation"
import type { MainScreen } from "@/types"
import { useUser } from "@/contexts/user-context"
import { CommunityMemberService } from "@/lib/firebase-services"

interface MainAppProps {
  onLogout: () => void
}

export function MainApp({ onLogout }: MainAppProps) {
  const [currentScreen, setCurrentScreen] = useState<MainScreen>("communities")
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>("")
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set())
  const { user, refreshUserCommunities } = useUser()

  // Initialize joined communities from user data
  useEffect(() => {
    if (user?.joinedCommunities) {
      setJoinedCommunities(new Set(user.joinedCommunities))
    }
  }, [user])

  const handleNavigateToCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId)
    setCurrentScreen("community-detail")
  }

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) return
    
    try {
      await CommunityMemberService.joinCommunity(user.address, communityId)
      setJoinedCommunities((prev) => new Set([...prev, communityId]))
      // Refresh user communities in context
      await refreshUserCommunities()
    } catch (error) {
      console.error("Error joining community:", error)
    }
  }

  const handleLeaveCommunity = async (communityId: string) => {
    if (!user) return
    
    try {
      await CommunityMemberService.leaveCommunity(user.address, communityId)
      setJoinedCommunities((prev) => {
        const newSet = new Set(prev)
        newSet.delete(communityId)
        return newSet
      })
      // Refresh user communities in context
      await refreshUserCommunities()
    } catch (error) {
      console.error("Error leaving community:", error)
    }
  }

  const handleEnterChat = (communityId: string) => {
    setSelectedCommunityId(communityId)
    setCurrentScreen("chat")
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
            onEnterChat={handleEnterChat}
            isJoined={joinedCommunities.has(selectedCommunityId)}
          />
        )
      case "chat":
        return <ChatScreen communityId={selectedCommunityId} onBack={() => setCurrentScreen("community-detail")} />
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
