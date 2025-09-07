"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { MiniKit } from "@worldcoin/minikit-js"
import { formatUsername } from "@/lib/utils"

export interface User {
  address: string
  username: string
  profilePicture?: string
  isVerified: boolean
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: boolean
  fetchUserData: (address: string, isOrbVerified?: boolean) => Promise<User>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = user !== null

  // Helper function to get user data from MiniKit
  const fetchUserData = async (address: string, isOrbVerified?: boolean) => {
    try {
      // Get user data by address from MiniKit
      const userData = await MiniKit.getUserByAddress(address)
      return {
        address,
        username: userData.username || `user_${address.slice(-4)}`, // Remove @ here, will be added by formatUsername
        profilePicture: userData.profilePictureUrl,
        isVerified: isOrbVerified ?? true // Use provided verification status or default to true
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Fallback user data
      return {
        address,
        username: `user_${address.slice(-4)}`, // Remove @ here, will be added by formatUsername
        profilePicture: undefined,
        isVerified: isOrbVerified ?? true // Use provided verification status or default to true
      }
    }
  }

  const value = {
    user,
    setUser: (userData: User | null) => {
      setUser(userData)
    },
    isAuthenticated,
    fetchUserData
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
