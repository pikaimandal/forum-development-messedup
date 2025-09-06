"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Smile, Send, ChevronUp, ChevronDown } from "lucide-react"
import { EmojiPicker } from "@/components/emoji-picker"

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
  upvotes: number
  downvotes: number
  userVote?: 'up' | 'down' | null
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
      author: "@CommunityMod",
      authorAvatar: "/worldcoin-team.png",
      content:
        "Welcome to Global Chat! This is where verified humans connect and share ideas. Feel free to introduce yourself! 👋",
      timestamp: "2h",
      upvotes: 15,
      downvotes: 2,
    },
    {
      id: "2",
      author: "@NewMember",
      authorAvatar: "/diverse-user-avatars.png",
      content: "Hi everyone! Just joined Forum and excited to be part of this human-verified community! 🎉",
      timestamp: "1h",
      upvotes: 8,
      downvotes: 0,
    },
    {
      id: "3",
      author: "@ActiveUser",
      authorAvatar: "/user-profile-avatar.png",
      content: "Great to have you here! The community is growing fast and the discussions are always interesting 😊",
      timestamp: "45m",
      upvotes: 12,
      downvotes: 1,
    },
  ],
  developer: [
    {
      id: "1",
      author: "@DevLead",
      authorAvatar: "/developer-coding.png",
      content: "Anyone working with the latest World ID SDK? I'm having some integration questions 🤔",
      timestamp: "3h",
      upvotes: 22,
      downvotes: 3,
    },
    {
      id: "2",
      author: "@FullStackDev",
      authorAvatar: "/developer-working.png",
      content:
        "Just implemented it last week! The new documentation is really helpful. What specific issues are you facing?",
      timestamp: "2h",
      upvotes: 18,
      downvotes: 1,
    },
  ],
  "world-news": [
    {
      id: "1",
      author: "@NewsEditor",
      authorAvatar: "/worldcoin-team.png",
      content:
        "Digital identity adoption is accelerating globally. Several countries are now exploring similar verification systems 🌍",
      timestamp: "4h",
      upvotes: 34,
      downvotes: 5,
    },
  ],
  "ai-tech": [
    {
      id: "1",
      author: "@AIResearcher",
      authorAvatar: "/tech-enthusiast.png",
      content:
        "The intersection of AI and human verification is fascinating. Biometric tech is advancing so rapidly! 🤖",
      timestamp: "5h",
      upvotes: 28,
      downvotes: 4,
    },
  ],
  qa: [
    {
      id: "1",
      author: "@HelpModerator",
      authorAvatar: "/diverse-user-avatars.png",
      content:
        "This is the Q&A community! Ask any questions about Forum, World ID, or anything else. We're here to help! ❓",
      timestamp: "6h",
      upvotes: 19,
      downvotes: 0,
    },
  ],
  announcements: [
    {
      id: "1",
      author: "@ForumTeam",
      authorAvatar: "/announcement-team.png",
      content:
        "🎉 Welcome to Forum Beta! We're excited to launch the world's first human-verified forum platform. More features coming soon!",
      timestamp: "1d",
      upvotes: 156,
      downvotes: 8,
    },
  ],
}

export function ChatScreen({ onBack, communityId = "global-chat" }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(demoMessages[communityId] || [])
  const [newMessage, setNewMessage] = useState("")
  const [showReportModal, setShowReportModal] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const community = communityData[communityId]
  const maxCharacters = 500

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

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
      author: "@You",
      authorAvatar: "/user-profile-avatar.png",
      content: newMessage,
      timestamp: "now",
      upvotes: 0,
      downvotes: 0,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleReportMessage = (messageId: string, reason: string) => {
    console.log(`Reported message ${messageId} for: ${reason}`)
    setShowReportModal(null)
    // Here you would typically send the report to your backend
  }

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleVote = (messageId: string, voteType: 'up' | 'down') => {
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId) {
          const currentVote = message.userVote
          let newUpvotes = message.upvotes
          let newDownvotes = message.downvotes
          let newUserVote: 'up' | 'down' | null = voteType

          // Remove previous vote if it exists
          if (currentVote === 'up') {
            newUpvotes--
          } else if (currentVote === 'down') {
            newDownvotes--
          }

          // If clicking the same vote type, remove the vote
          if (currentVote === voteType) {
            newUserVote = null
          } else {
            // Add the new vote
            if (voteType === 'up') {
              newUpvotes++
            } else {
              newDownvotes++
            }
          }

          return {
            ...message,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote
          }
        }
        return message
      })
    )
  }



  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-3 flex-1">
            <div className={`w-8 h-8 rounded-full ${community.color} flex items-center justify-center`}>
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">{community.name}</h1>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{formatNumber(community.members)} members</span>
                <span>•</span>
                <span>ORB Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-12 h-12 rounded-xl ${community.color} flex items-center justify-center mx-auto mb-3`}>
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Welcome to {community.name}!</h3>
            <p className="text-muted-foreground text-sm mb-4">Start the conversation by sending the first message.</p>
          </div>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="border-border bg-card">
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={message.authorAvatar || "/placeholder.svg"} alt={message.author} />
                    <AvatarFallback>{message.author[1] || message.author[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground text-sm">{message.author}</span>
                        <span className="text-xs text-muted-foreground">{formatTimestamp(message.timestamp)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-6 w-6 opacity-60 hover:opacity-100"
                        onClick={() => setShowReportModal(message.id)}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </Button>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Vote buttons */}
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(message.id, 'up')}
                          className={`p-1 h-7 w-7 focus:outline-none focus:ring-0 ${message.userVote === 'up' ? 'text-green-500 bg-green-50' : 'text-muted-foreground hover:text-green-500'}`}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground min-w-[20px] text-center">{message.upvotes}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(message.id, 'down')}
                          className={`p-1 h-7 w-7 focus:outline-none focus:ring-0 ${message.userVote === 'down' ? 'text-red-500 bg-red-50' : 'text-muted-foreground hover:text-red-500'}`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground min-w-[20px] text-center">{message.downvotes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="bg-card border-t border-border p-4 flex-shrink-0">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4 flex-shrink-0">
        <div className="space-y-2">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Textarea
                placeholder={`Message ${community.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value.slice(0, maxCharacters))}
                className="min-h-[50px] max-h-24 resize-none bg-input border-border text-sm pr-10"
                rows={2}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEmojiClick}
                className="absolute right-2 top-2 p-1 h-6 w-6"
              >
                <Smile className="w-4 h-4" />
              </Button>
              <div className="flex items-center justify-between mt-1">
                <span
                  className={`text-xs ${newMessage.length > maxCharacters * 0.9 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {newMessage.length}/{maxCharacters}
                </span>
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || newMessage.length > maxCharacters}
              size="sm"
              className="h-[50px] px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Report Message</h3>
              <p className="text-sm text-muted-foreground mb-4">Why are you reporting this message?</p>
              <div className="space-y-2">
                {["Spam", "Scam", "Harmful Content", "Harassment", "Misinformation", "Other"].map((reason) => (
                  <Button
                    key={reason}
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleReportMessage(showReportModal, reason)}
                  >
                    {reason}
                  </Button>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-3" onClick={() => setShowReportModal(null)}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
