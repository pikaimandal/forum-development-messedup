"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function WorldAppWarning() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* App Logo */}
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-black">
          <img 
            src="/world-forum-logo.png" 
            alt="Forum Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Forum is a Worldcoin mini app designed to run exclusively within the World App ecosystem for verified humans.
            </p>
            <p className="text-sm font-medium text-foreground">
              Forum must be opened within WorldApp to continue.
            </p>
          </div>

          {/* World App Download Information */}
          <div className="text-center border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2">
              Don't have World App yet?
            </p>
            <p className="text-xs text-primary">
              Download World App to access verified human communities
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Human verification badge */}
      <div className="mt-8 flex items-center space-x-2 text-sm text-muted-foreground">
        <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span>World App Required</span>
      </div>
    </div>
  )
}
