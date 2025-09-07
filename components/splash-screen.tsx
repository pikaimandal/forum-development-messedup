"use client"

import { useState, useEffect } from "react"

interface SplashScreenProps {
  onInitializationComplete?: () => void
}

export function SplashScreen({ onInitializationComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simple smooth progress from 0 to 100% over 2.5 seconds
    const duration = 2500 // 2.5 seconds
    const steps = 50 // Number of updates
    const stepDuration = duration / steps
    const progressPerStep = 100 / steps

    let currentStep = 0
    
    const progressInterval = setInterval(() => {
      currentStep++
      const newProgress = Math.min(currentStep * progressPerStep, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(progressInterval)
        // Wait a moment to show 100% then complete
        setTimeout(() => {
          if (onInitializationComplete) {
            onInitializationComplete()
          }
        }, 300)
      }
    }, stepDuration)

    return () => clearInterval(progressInterval)
  }, [onInitializationComplete])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* App Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-black">
          <img 
            src="/world-forum-logo.png" 
            alt="Forum Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>
      </div>

      {/* App Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Forum
        </h1>
        <p className="text-muted-foreground text-lg">The world's first human-verified forum</p>
      </div>

      {/* Progress Bar Only */}
      <div className="w-full max-w-md">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
