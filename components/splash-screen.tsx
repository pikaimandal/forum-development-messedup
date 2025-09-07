"use client"

import { useState, useEffect, useRef } from "react"

interface SplashScreenProps {
  onInitializationComplete?: () => void
}

export function SplashScreen({ onInitializationComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const hasStarted = useRef(false)
  const callbackRef = useRef(onInitializationComplete)

  // Update callback ref when prop changes
  useEffect(() => {
    callbackRef.current = onInitializationComplete
  }, [onInitializationComplete])

  useEffect(() => {
    // Prevent multiple progress animations
    if (hasStarted.current) return
    hasStarted.current = true

    // Simple smooth progress from 0 to 100% over exactly 3 seconds
    const duration = 3000 // 3 seconds
    const steps = 60 // Number of updates (50ms intervals)
    const stepDuration = duration / steps
    const progressPerStep = 100 / steps

    let currentStep = 0
    
    const progressInterval = setInterval(() => {
      currentStep++
      const newProgress = Math.min(currentStep * progressPerStep, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(progressInterval)
        // Complete immediately when 100% is reached
        if (callbackRef.current) {
          callbackRef.current()
        }
      }
    }, stepDuration)

    // Failsafe: Force completion after exactly 3 seconds
    const failsafeTimeout = setTimeout(() => {
      clearInterval(progressInterval)
      setProgress(100)
      if (callbackRef.current) {
        callbackRef.current()
      }
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(failsafeTimeout)
    }
  }, []) // No dependencies - runs only once

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

      {/* Progress Bar with Percentage */}
      <div className="w-full max-w-md">
        <div className="w-full bg-muted rounded-full h-2 relative">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {/* Percentage Display */}
        <div className="text-center mt-3">
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  )
}
