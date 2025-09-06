"use client"

export function SplashScreen() {
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
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Forum
        </h1>
        <p className="text-muted-foreground text-lg">The world's first human-verified forum</p>
      </div>

      {/* Loading indicator */}
      <div className="mt-12">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}
