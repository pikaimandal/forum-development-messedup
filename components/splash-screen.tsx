"use client"

import { useState, useEffect } from "react"

interface SplashScreenProps {
  onInitializationComplete?: () => void
}

export function SplashScreen({ onInitializationComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("Initializing...")

  useEffect(() => {
    const phases = [
      { duration: 800, endProgress: 25, status: "Loading components..." },
      { duration: 600, endProgress: 50, status: "Checking environment..." },
      { duration: 700, endProgress: 75, status: "Connecting to World App..." },
      { duration: 500, endProgress: 100, status: "Ready!" }
    ]

    let currentProgress = 0
    let phaseIndex = 0

    const updateProgress = () => {
      if (phaseIndex >= phases.length) {
        // Initialization complete
        if (onInitializationComplete) {
          setTimeout(onInitializationComplete, 300) // Small delay to show 100%
        }
        return
      }

      const phase = phases[phaseIndex]
      const startProgress = currentProgress
      const targetProgress = phase.endProgress
      const duration = phase.duration
      const steps = 20 // Number of animation steps
      const stepDuration = duration / steps
      const progressPerStep = (targetProgress - startProgress) / steps

      setStatus(phase.status)

      let step = 0
      const progressInterval = setInterval(() => {
        step++
        const newProgress = Math.min(startProgress + (progressPerStep * step), targetProgress)
        setProgress(newProgress)

        if (step >= steps) {
          clearInterval(progressInterval)
          currentProgress = targetProgress
          phaseIndex++
          // Move to next phase
          setTimeout(updateProgress, 100)
        }
      }, stepDuration)
    }

    // Start the progress animation
    updateProgress()
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

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  )
}
