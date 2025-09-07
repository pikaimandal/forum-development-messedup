"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface ProfileScreenProps {
  onLogout: () => void
}

interface UserStats {
  posts: number
  comments: number
  upvotes: number
  communities: number
  joinDate: string
}

interface UserProfile {
  username: string
  displayName: string
  avatar: string
  bio: string
  isVerified: boolean
  verificationDate: string
  walletAddress: string
  stats: UserStats
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [currentView, setCurrentView] = useState<"main" | "activity" | "help" | "terms">("main")
  
  const { user, setUser } = useUser()

  // Use real user data or fallback to demo data
  const currentUser = {
    username: user?.username || "@worldcitizen",
    displayName: user?.username || "World Citizen",
    avatar: user?.profilePicture || "/user-profile-avatar.png",
    bio: "Passionate about human verification and decentralized identity. Building the future of digital trust.",
    isVerified: user?.isVerified || true,
    verificationDate: "January 2024",
    walletAddress: user?.address || "0x1234...5678",
    stats: {
      posts: 23,
      comments: 156,
      upvotes: 892,
      communities: 8,
      joinDate: "December 2023",
    },
  }

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled)
    document.documentElement.classList.toggle("dark", enabled)
  }

  const handleLogout = () => {
    setUser(null) // Clear user data
    onLogout()
  }

  const handleMenuItemClick = (view: "activity" | "help" | "terms") => {
    setCurrentView(view)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "activity":
        return renderMyActivity()
      case "help":
        return renderHelpSupport()
      case "terms":
        return renderTermsPrivacy()
      default:
        return renderMainProfile()
    }
  }

  const renderPrivacySecurity = () => (
    <div className="h-full bg-background flex flex-col">
      <div className="px-4 py-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("main")} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Privacy & Security</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Public Profile</h3>
                <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
              </div>
              <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Show Activity Status</h3>
                <p className="text-sm text-muted-foreground">Let others see when you're active</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderMyActivity = () => (
    <div className="h-full bg-background flex flex-col">
      <div className="px-4 py-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("main")} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">My Activity</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{currentUser.stats.posts}</div>
              <div className="text-sm text-muted-foreground">Posts Created</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{currentUser.stats.comments}</div>
              <div className="text-sm text-muted-foreground">Comments Made</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Commented on "World ID Integration Guide"</span>
                <span className="text-xs text-muted-foreground ml-auto">2h</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Created post "Future of Human Verification"</span>
                <span className="text-xs text-muted-foreground ml-auto">1d</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Joined Developers community</span>
                <span className="text-xs text-muted-foreground ml-auto">3d</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderHelpSupport = () => (
    <div className="h-full bg-background flex flex-col">
      <div className="px-4 py-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("main")} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Help & Support</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-medium">How do I join communities on Forum?</h3>
              <p className="text-sm text-muted-foreground">
                Browse communities in the Discover tab and click on any community to join and start participating in discussions.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-medium">How does the voting system work?</h3>
              <p className="text-sm text-muted-foreground">
                You can upvote or downvote messages in communities. Your votes help surface quality content and build community engagement.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              help@worldforum.world
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c-5 0-9-4-9-9m9 9c5 0 9-4 9-9m-9 9V3m0 18c-5 0-9-4-9-9m9 9c5 0 9-4 9-9"
                />
              </svg>
              https://worldforum.world
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderTermsPrivacy = () => (
    <div className="h-full bg-background flex flex-col">
      <div className="px-4 py-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("main")} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Terms & Privacy</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              By using Forum, you agree to our terms of service. This includes maintaining respectful discourse
              and following community guidelines.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTerms(!showTerms)}
            >
              {showTerms ? "Hide ToS" : "Read ToS"}
            </Button>
            
            {showTerms && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
                  <p className="text-muted-foreground">
                    By accessing and using Forum, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. User Conduct</h3>
                  <p className="text-muted-foreground">
                    Users must maintain respectful discourse, avoid harassment, spam, or inappropriate content. 
                    All users must be verified humans through World ID verification.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Content Guidelines</h3>
                  <p className="text-muted-foreground">
                    Users are responsible for their content. We reserve the right to remove content that violates 
                    community standards or applicable laws.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">4. Account Security</h3>
                  <p className="text-muted-foreground">
                    Users are responsible for maintaining the security of their World ID credentials and account information.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">5. Limitation of Liability</h3>
                  <p className="text-muted-foreground">
                    Forum is provided "as is" without warranties. We are not liable for any damages arising from use of the service.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">6. Changes to Terms</h3>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these terms at any time. Continued use constitutes acceptance of new terms.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              We are committed to protecting your privacy. Your biometric data is processed locally and never stored on
              our servers.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPrivacy(!showPrivacy)}
            >
              {showPrivacy ? "Hide Privacy Policy" : "Read Privacy Policy"}
            </Button>
            
            {showPrivacy && (
              <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Data Collection</h3>
                  <p className="text-muted-foreground">
                    We collect minimal data necessary for service operation: World ID verification status, 
                    messages, votes, and basic profile information.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Biometric Data</h3>
                  <p className="text-muted-foreground">
                    All biometric verification is handled by World ID. We never receive, store, or process 
                    your biometric data. Only verification status is shared with us.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Data Usage</h3>
                  <p className="text-muted-foreground">
                    Your data is used solely to provide Forum services: displaying messages, enabling votes, 
                    and maintaining community features.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Data Sharing</h3>
                  <p className="text-muted-foreground">
                    We do not sell or share your personal data with third parties. Community messages and votes 
                    are visible to other verified users as part of the service.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Data Security</h3>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your data. All communications 
                    are encrypted in transit.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Your Rights</h3>
                  <p className="text-muted-foreground">
                    You can request data deletion by contacting support@worldforum.world. Note that some data may be 
                    retained for legal compliance.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Contact</h3>
                  <p className="text-muted-foreground">
                    For privacy questions or requests, contact us at support@worldforum.world or visit https://worldforum.world
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderMainProfile = () => (
    <div className="h-full bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto pt-4">
        {/* User Profile Card */}
        <Card className="mx-4 mb-4">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3 mb-3">
              <Avatar className="w-16 h-16">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt="User Avatar" />
                <AvatarFallback className="text-lg">U</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-black dark:text-white text-sm mb-1 font-medium">{currentUser.username}</p>
                <p className="text-black dark:text-white text-xs mb-2">Wallet: {currentUser.walletAddress}</p>
                <Badge variant="secondary" className="text-xs bg-green-700 text-white hover:bg-green-700 dark:bg-green-600 dark:text-white dark:hover:bg-green-600">
                  ORB Verified Human
                </Badge>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-foreground">{currentUser.stats.posts}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{currentUser.stats.comments}</div>
                <div className="text-xs text-muted-foreground">Comments</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{currentUser.stats.upvotes}</div>
                <div className="text-xs text-muted-foreground">Upvotes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{currentUser.stats.communities}</div>
                <div className="text-xs text-muted-foreground">Communities</div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="text-center">
              <p className="text-xs text-muted-foreground">Member since {currentUser.stats.joinDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mx-4 mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground text-sm">Dark Mode</h3>
                <p className="text-xs text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground text-sm">Push Notifications</h3>
                <p className="text-xs text-muted-foreground">Receive notifications for replies</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mx-4 mb-4">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button
                  className="w-full flex items-center space-x-3 p-4 hover:bg-muted/50 transition-colors active:bg-muted"
                  onClick={() => {
                    switch (item.title) {
                      case "My Activity":
                        handleMenuItemClick("activity")
                        break
                      case "Help & Support":
                        handleMenuItemClick("help")
                        break
                      case "Terms & Privacy":
                        handleMenuItemClick("terms")
                        break
                    }
                  }}
                >
                  <div className="text-muted-foreground">{item.icon}</div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <div className="px-4 pb-6">
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )

  const menuItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM4 19h10a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "My Activity",
      subtitle: "View your posts and comments",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Help & Support",
      subtitle: "Get help and contact support",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Terms & Privacy",
      subtitle: "Read our terms and privacy policy",
    },
  ]

  return renderCurrentView()
}
