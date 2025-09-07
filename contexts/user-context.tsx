"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { MiniKit } from "@worldcoin/minikit-js"

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
  fetchUserData: (address: string) => Promise<User>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = user !== null

  // Helper function to get user data from MiniKit
  const fetchUserData = async (address: string) => {
    try {
      // Get user data by address from MiniKit
      const userData = await MiniKit.getUserByAddress(address)
      return {
        address,
        username: userData.username || `@user_${address.slice(-4)}`,
        profilePicture: userData.profilePictureUrl,
        isVerified: true // World App users are verified
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Fallback user data
      return {
        address,
        username: `@user_${address.slice(-4)}`,
        profilePicture: undefined,
        isVerified: true // World App users are verified
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
