"use client"

import { ReactNode, useEffect, useState } from "react"
import { MiniKit } from "@worldcoin/minikit-js"

interface MiniKitProviderProps {
  children: ReactNode
}

export function MiniKitProvider({ children }: MiniKitProviderProps) {
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Install MiniKit SDK
      MiniKit.install()
      setIsInstalled(true)
    }
  }, [])

  if (!isInstalled) {
    return null
  }

  return <>{children}</>
}
