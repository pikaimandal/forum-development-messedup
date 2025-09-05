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
  stats: UserStats
}

// Demo user data
const currentUser: UserProfile = {
  username: "@worldcitizen",
  displayName: "World Citizen",
  avatar: "/user-profile-avatar.png",
  bio: "Passionate about human verification and decentralized identity. Building the future of digital trust.",
  isVerified: true,
  verificationDate: "January 2024",
  stats: {
    posts: 23,
    comments: 156,
    upvotes: 892,
    communities: 8,
    joinDate: "December 2023",
  },
}

export function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)
  const [currentView, setCurrentView] = useState<"main" | "edit" | "privacy" | "activity" | "help" | "terms">("main")

  const handleDarkModeToggle = (enabled: boolean) => {
    setDarkMode(enabled)
    document.documentElement.classList.toggle("dark", enabled)
  }

  const handleMenuItemClick = (view: "edit" | "privacy" | "activity" | "help" | "terms") => {
    setCurrentView(view)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "edit":
        return renderEditProfile()
      case "privacy":
        return renderPrivacySecurity()
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

  const renderEditProfile = () => (
    <div className="h-full bg-background flex flex-col">
      <div className="px-4 py-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("main")} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Edit Profile</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.displayName} />
                <AvatarFallback className="text-lg">{currentUser.displayName[0]}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground">Display Name</label>
                <Input defaultValue={currentUser.displayName} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Username</label>
                <Input defaultValue={currentUser.username} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Bio</label>
                <Textarea defaultValue={currentUser.bio} rows={3} className="mt-1" />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button className="flex-1">Save Changes</Button>
              <Button variant="outline" onClick={() => setCurrentView("main")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

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
              <h3 className="font-medium">How does human verification work?</h3>
              <p className="text-sm text-muted-foreground">
                World ID uses biometric verification to ensure each user is a unique human.
              </p>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-medium">Is my data secure?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, all biometric data is processed locally and never stored on servers.
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
              Email Support
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Live Chat
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
              By using World Forum, you agree to our terms of service. This includes maintaining respectful discourse
              and following community guidelines.
            </p>
            <Button variant="outline" size="sm">
              Read Full Terms
            </Button>
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
            <Button variant="outline" size="sm">
              Read Privacy Policy
            </Button>
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
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.displayName} />
                <AvatarFallback className="text-lg">{currentUser.displayName[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-lg font-bold text-foreground">{currentUser.displayName}</h2>
                </div>
                <p className="text-muted-foreground text-sm mb-2">{currentUser.username}</p>
                <Badge variant="secondary" className="text-xs">
                  ORB Verified • {currentUser.verificationDate}
                </Badge>
              </div>
            </div>

            <p className="text-foreground text-sm mb-3">{currentUser.bio}</p>

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
                      case "Edit Profile":
                        handleMenuItemClick("edit")
                        break
                      case "Privacy & Security":
                        handleMenuItemClick("privacy")
                        break
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
          <Button variant="destructive" onClick={onLogout} className="w-full">
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      title: "Edit Profile",
      subtitle: "Update your profile information",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Privacy & Security",
      subtitle: "Manage your privacy settings",
    },
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
