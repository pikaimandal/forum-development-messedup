"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmojiPicker } from "@/components/emoji-picker"
import { ArrowLeft, Users, Smile, Send } from "lucide-react"

interface ChatScreenProps {
  onBack: () => void
  communityId?: string
}

interface Message {
  id: string
  author: string
  authorAvatar: string
  content: string
  timestamp: string
  isVerified: boolean
}

interface Community {
  id: string
  name: string
  color: string
  members: number
}

// Community data
const communityData: Record<string, Community> = {
  "global-chat": {
    id: "global-chat",
    name: "Global Chat",
    color: "bg-primary",
    members: 18500,
  },
  developer: {
    id: "developer",
    name: "Developer",
    color: "bg-emerald-500",
    members: 5600,
  },
  "world-news": {
    id: "world-news",
    name: "World News",
    color: "bg-blue-500",
    members: 12300,
  },
  "ai-tech": {
    id: "ai-tech",
    name: "AI & Tech",
    color: "bg-purple-500",
    members: 8900,
  },
  qa: {
    id: "qa",
    name: "Q&A",
    color: "bg-amber-500",
    members: 6700,
  },
  announcements: {
    id: "announcements",
    name: "Announcements",
    color: "bg-orange-500",
    members: 15200,
  },
}

// Demo messages for different communities
const demoMessages: Record<string, Message[]> = {
  "global-chat": [
    {
      id: "1",
      author: "CommunityMod",
      authorAvatar: "/worldcoin-team.png",
      content:
        "Welcome to Global Chat! This is where verified humans connect and share ideas. Feel free to introduce yourself! 👋",
      timestamp: "2h",
      isVerified: true,
    },
    {
      id: "2",
      author: "NewMember",
      authorAvatar: "/diverse-user-avatars.png",
      content: "Hi everyone! Just joined World Forum and excited to be part of this human-verified community! 🎉",
      timestamp: "1h",
      isVerified: true,
    },
    {
      id: "3",
      author: "ActiveUser",
      authorAvatar: "/user-profile-avatar.png",
      content: "Great to have you here! The community is growing fast and the discussions are always interesting 😊",
      timestamp: "45m",
      isVerified: true,
    },
  ],
  developer: [
    {
      id: "1",
      author: "DevLead",
      authorAvatar: "/developer-coding.png",
      content: "Anyone working with the latest World ID SDK? I'm having some integration questions 🤔",
      timestamp: "3h",
      isVerified: true,
    },
    {
      id: "2",
      author: "FullStackDev",
      authorAvatar: "/developer-working.png",
      content:
        "Just implemented it last week! The new documentation is really helpful. What specific issues are you facing?",
      timestamp: "2h",
      isVerified: true,
    },
  ],
  "world-news": [
    {
      id: "1",
      author: "NewsEditor",
      authorAvatar: "/worldcoin-team.png",
      content:
        "Digital identity adoption is accelerating globally. Several countries are now exploring similar verification systems 🌍",
      timestamp: "4h",
      isVerified: true,
    },
  ],
  "ai-tech": [
    {
      id: "1",
      author: "AIResearcher",
      authorAvatar: "/tech-enthusiast.png",
      content:
        "The intersection of AI and human verification is fascinating. Biometric tech is advancing so rapidly! 🤖",
      timestamp: "5h",
      isVerified: true,
    },
  ],
  qa: [
    {
      id: "1",
      author: "HelpModerator",
      authorAvatar: "/diverse-user-avatars.png",
      content:
        "This is the Q&A community! Ask any questions about World Forum, World ID, or anything else. We're here to help! ❓",
      timestamp: "6h",
      isVerified: true,
    },
  ],
  announcements: [
    {
      id: "1",
      author: "WorldForumTeam",
      authorAvatar: "/announcement-team.png",
      content:
        "🎉 Welcome to World Forum Beta! We're excited to launch the world's first human-verified forum platform. More features coming soon!",
      timestamp: "1d",
      isVerified: true,
    },
  ],
}

export function ChatScreen({ onBack, communityId = "global-chat" }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(demoMessages[communityId] || [])
  const [newMessage, setNewMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const community = communityData[communityId]
  const maxCharacters = 500

  if (!community) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Community not found</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  const formatTimestamp = (timestamp: string) => {
    // Convert relative time to more readable format
    const now = new Date()
    if (timestamp.includes("m")) {
      return timestamp
    } else if (timestamp.includes("h")) {
      return timestamp
    } else if (timestamp.includes("d")) {
      return timestamp.replace("d", " day ago")
    }
    return timestamp
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || newMessage.length > maxCharacters) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      author: "You",
      authorAvatar: "/user-profile-avatar.png",
      content: newMessage,
      timestamp: "now",
      isVerified: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setShowEmojiPicker(false)
  }

  const handleEmojiSelect = (emoji: string) => {
    if (newMessage.length + emoji.length <= maxCharacters) {
      setNewMessage((prev) => prev + emoji)
    }
    setShowEmojiPicker(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-3 flex-1">
            <div className={`w-10 h-10 rounded-xl ${community.color} flex items-center justify-center`}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{community.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{formatNumber(community.members)} members</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Human Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 rounded-2xl ${community.color} flex items-center justify-center mx-auto mb-4`}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Welcome to {community.name}!</h3>
            <p className="text-muted-foreground mb-4">Start the conversation by sending the first message.</p>
          </div>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="border-border bg-card">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={message.authorAvatar || "/placeholder.svg"} alt={message.author} />
                    <AvatarFallback>{message.author[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-foreground">{message.author}</span>
                      {message.isVerified && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                    </div>
                    <p className="text-foreground leading-relaxed break-words">{message.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-6 flex-shrink-0">
        <div className="space-y-3">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                placeholder={`Message ${community.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value.slice(0, maxCharacters))}
                onKeyPress={handleKeyPress}
                className="min-h-[60px] max-h-32 resize-none bg-input border-border"
                rows={2}
              />
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs ${newMessage.length > maxCharacters * 0.9 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {newMessage.length}/{maxCharacters}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2">
                <Smile className="w-5 h-5" />
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || newMessage.length > maxCharacters}
                size="sm"
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="border border-border rounded-lg bg-card p-2">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
