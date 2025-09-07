"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { formatUsername, generateAvatarUrl } from "@/lib/utils"
import { UserService, CommunityMemberService } from "@/lib/firebase-services"
import { FirebaseUser } from "@/types/firebase"

export interface User {
  address: string
  username: string
  profilePicture?: string
  isVerified: boolean
  isOrbVerified: boolean
  joinedCommunities: string[]
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  fetchUserData: (address: string, isOrbVerified?: boolean) => Promise<User>
  refreshUserCommunities: () => Promise<void>
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isAuthenticated = user !== null

  // Helper function to get user data from MiniKit and Firebase
  const fetchUserData = async (address: string, isOrbVerified?: boolean): Promise<User> => {
    setIsLoading(true)
    try {
      // Get user data from MiniKit
      const userData = await MiniKit.getUserByAddress(address)
      
      // Prepare user data for Firebase
      const userForFirebase = {
        id: address,
        username: userData.username || `user_${address.slice(-4)}`,
        displayName: userData.username || `user_${address.slice(-4)}`,
        profilePicture: generateAvatarUrl(address, userData.profilePictureUrl),
        isVerified: true,
        isOrbVerified: isOrbVerified ?? true
      }

      // Save/update user in Firebase
      await UserService.createUser(userForFirebase)

      // Get user's joined communities
      const joinedCommunities = await CommunityMemberService.getUserCommunities(address)

      // Update user activity
      await UserService.updateUserActivity(address)

      // Return user data for context
      return {
        address,
        username: userForFirebase.username,
        profilePicture: userForFirebase.profilePicture,
        isVerified: userForFirebase.isVerified,
        isOrbVerified: userForFirebase.isOrbVerified,
        joinedCommunities
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Fallback user data
      const joinedCommunities = await CommunityMemberService.getUserCommunities(address).catch(() => [])
      
      return {
        address,
        username: `user_${address.slice(-4)}`,
        profilePicture: generateAvatarUrl(address),
        isVerified: true,
        isOrbVerified: isOrbVerified ?? true,
        joinedCommunities
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh user's joined communities
  const refreshUserCommunities = async (): Promise<void> => {
    if (!user) return
    
    try {
      const joinedCommunities = await CommunityMemberService.getUserCommunities(user.address)
      setUser(prevUser => prevUser ? { ...prevUser, joinedCommunities } : null)
    } catch (error) {
      console.error("Error refreshing user communities:", error)
    }
  }

  const value = {
    user,
    setUser: (userData: User | null) => {
      setUser(userData)
    },
    isAuthenticated,
    fetchUserData,
    refreshUserCommunities,
    isLoading
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
