"use client"

import type React from "react"
import type { Message } from "@/types"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Smile, Send, ChevronUp, ChevronDown, MessageCircle, Eye, Globe, Code, Newspaper, Brain, HelpCircle, Megaphone, MoreVertical, Edit, Trash2 } from "lucide-react"
import { EmojiPicker } from "@/components/emoji-picker"

interface ChatScreenProps {
  onBack: () => void
  communityId?: string
}

interface ChatMessage extends Message {
  upvotes: number
  downvotes: number
  userVote?: 'up' | 'down' | null
  replyTo?: {
    id: string
    author: string
    content: string
  }
}

interface Community {
  id: string
  name: string
  color: string
  humans: number
  icon: React.ReactNode
}

// Community data
const communityData: Record<string, Community> = {
  "global-chat": {
    id: "global-chat",
    name: "Global Chat",
    color: "bg-primary",
    humans: 18500,
    icon: <Globe className="w-4 h-4 text-primary-foreground" />,
  },
  developer: {
    id: "developer",
    name: "Developer",
    color: "bg-emerald-500",
    humans: 5600,
    icon: <Code className="w-4 h-4 text-white" />,
  },
  "world-news": {
    id: "world-news",
    name: "World News",
    color: "bg-blue-500",
    humans: 12300,
    icon: <Newspaper className="w-4 h-4 text-white" />,
  },
  "ai-tech": {
    id: "ai-tech",
    name: "AI & Tech",
    color: "bg-purple-500",
    humans: 8900,
    icon: <Brain className="w-4 h-4 text-white" />,
  },
  qa: {
    id: "qa",
    name: "Q&A",
    color: "bg-amber-500",
    humans: 6700,
    icon: <HelpCircle className="w-4 h-4 text-white" />,
  },
  announcements: {
    id: "announcements",
    name: "Announcements",
    color: "bg-orange-500",
    humans: 15200,
    icon: <Megaphone className="w-4 h-4 text-white" />,
  },
}

// Demo messages for different communities
const demoMessages: Record<string, any[]> = {
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
      views: 1240,
    },
    {
      id: "2",
      author: "@NewMember",
      authorAvatar: "/diverse-user-avatars.png",
      content: "Hi everyone! Just joined Forum and excited to be part of this human-verified community! 🎉",
      timestamp: "1h",
      upvotes: 8,
      downvotes: 0,
      views: 532,
    },
    {
      id: "3",
      author: "@ActiveUser",
      authorAvatar: "/user-profile-avatar.png",
      content: "Great to have you here! The community is growing fast and the discussions are always interesting 😊",
      timestamp: "45m",
      upvotes: 12,
      downvotes: 1,
      views: 789,
    },
    {
      id: "4",
      author: "@worldcitizen",
      authorAvatar: "/placeholder-user.jpg",
      content: "Thanks for the warm welcome! I'm excited to contribute to this amazing community and learn from everyone here! 🚀",
      timestamp: "2m",
      upvotes: 6,
      downvotes: 0,
      views: 234,
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
      views: 2100,
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
      views: 1560,
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
      views: 3420,
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
      views: 2180,
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
      views: 945,
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
      views: 12400,
    },
  ],
}

export function ChatScreen({ onBack, communityId = "global-chat" }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(demoMessages[communityId] || [])
  const [newMessage, setNewMessage] = useState("")
  const [showReportModal, setShowReportModal] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Current user (in a real app, this would come from authentication)
  const currentUser = "@You"

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

  // Close message menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showMessageMenu && !target.closest('[data-message-menu]')) {
        setShowMessageMenu(null)
      }
    }

    if (showMessageMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMessageMenu])

  // Clean up old message times from localStorage (older than 1 hour)
  useEffect(() => {
    const cleanupOldMessageTimes = () => {
      try {
        const messageTimes = JSON.parse(localStorage.getItem('messageTimes') || '{}')
        const now = Date.now()
        const oneHour = 60 * 60 * 1000
        
        let hasChanges = false
        const cleanedTimes: { [key: string]: number } = {}
        
        for (const [messageId, timestamp] of Object.entries(messageTimes)) {
          if (typeof timestamp === 'number' && (now - timestamp) <= oneHour) {
            cleanedTimes[messageId] = timestamp
          } else {
            hasChanges = true
          }
        }
        
        if (hasChanges) {
          localStorage.setItem('messageTimes', JSON.stringify(cleanedTimes))
        }
      } catch (error) {
        console.error('Failed to cleanup message times:', error)
      }
    }

    // Clean up on mount and then every 10 minutes
    cleanupOldMessageTimes()
    const interval = setInterval(cleanupOldMessageTimes, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

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
    // Handle ISO date strings (Firebase-ready format)
    if (timestamp.includes('T') && timestamp.includes('Z')) {
      try {
        const messageDate = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - messageDate.getTime()
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        
        if (diffMinutes < 1) {
          return "now"
        } else if (diffMinutes < 60) {
          return `${diffMinutes}m`
        } else if (diffHours < 24) {
          return `${diffHours}h`
        } else {
          return `${diffDays}d`
        }
      } catch {
        return timestamp
      }
    }
    
    // Handle relative time strings (existing demo data)
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

    const messageId = `msg_${Date.now()}`
    const currentTime = new Date().toISOString()
    const message: ChatMessage = {
      id: messageId,
      communityId: community.id,
      authorId: "user_current",
      author: "@You",
      authorAvatar: "/user-profile-avatar.png",
      content: newMessage,
      timestamp: currentTime, // Use ISO string for Firebase compatibility
      createdAt: currentTime,
      isVerified: true,
      views: 0,
      upvotes: 0,
      downvotes: 0,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        author: replyingTo.author,
        content: replyingTo.content
      } : undefined,
    }

    // Store message time in localStorage for edit time tracking
    try {
      const messageTimes = JSON.parse(localStorage.getItem('messageTimes') || '{}')
      messageTimes[messageId] = Date.now()
      localStorage.setItem('messageTimes', JSON.stringify(messageTimes))
    } catch (error) {
      console.error('Failed to store message time:', error)
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    setReplyingTo(null)
    
    // Auto-scroll to the new message
    scrollToLatestMessage(messageId)
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

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message)
  }

  const scrollToMessage = (messageId: string) => {
    console.log('Scrolling to message:', messageId)
    console.log('Available message refs:', Object.keys(messageRefs.current))
    const messageElement = messageRefs.current[messageId]
    console.log('Message element found:', !!messageElement)
    
    if (messageElement) {
      console.log('Scrolling to element:', messageElement)
      // Use a slight delay to ensure DOM is ready
      setTimeout(() => {
        messageElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        })
        
        // Add a brief highlight effect
        messageElement.style.transition = 'background-color 0.3s ease'
        messageElement.style.backgroundColor = 'rgba(34, 197, 94, 0.25)'
        messageElement.style.borderRadius = '8px'
        
        setTimeout(() => {
          messageElement.style.backgroundColor = ''
        }, 2500)
      }, 100)
    } else {
      console.log('Message element not found for ID:', messageId)
    }
  }

  const scrollToLatestMessage = (messageId: string) => {
    // Scroll to the latest message without highlight effect
    setTimeout(() => {
      const messageElement = messageRefs.current[messageId]
      if (messageElement) {
        messageElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end',
          inline: 'nearest'
        })
      }
    }, 150) // Slightly longer delay to ensure DOM update
  }

  const getCommunityLargeIcon = (communityId: string) => {
    switch (communityId) {
      case "global-chat":
        return <Globe className="w-6 h-6 text-primary-foreground" />
      case "developer":
        return <Code className="w-6 h-6 text-white" />
      case "world-news":
        return <Newspaper className="w-6 h-6 text-white" />
      case "ai-tech":
        return <Brain className="w-6 h-6 text-white" />
      case "qa":
        return <HelpCircle className="w-6 h-6 text-white" />
      case "announcements":
        return <Megaphone className="w-6 h-6 text-white" />
      default:
        return <Users className="w-6 h-6 text-white" />
    }
  }

  // Get message date from timestamp (for grouping)
  const getMessageDate = (timestamp: string) => {
    try {
      // Handle ISO timestamp strings
      if (timestamp.includes('T') && timestamp.includes('Z')) {
        return new Date(timestamp).toDateString()
      }
      // For relative timestamps, estimate the date
      const now = new Date()
      if (timestamp.includes('h')) {
        const hours = parseInt(timestamp.replace('h', ''))
        const messageDate = new Date(now.getTime() - (hours * 60 * 60 * 1000))
        return messageDate.toDateString()
      } else if (timestamp.includes('m')) {
        const minutes = parseInt(timestamp.replace('m', ''))
        const messageDate = new Date(now.getTime() - (minutes * 60 * 1000))
        return messageDate.toDateString()
      } else if (timestamp.includes('d')) {
        const days = parseInt(timestamp.replace('d', ''))
        const messageDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
        return messageDate.toDateString()
      }
      return now.toDateString()
    } catch {
      return new Date().toDateString()
    }
  }

  // Format date for display (DD.MM.YYYY format like Telegram)
  const formatDateSeparator = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    } catch {
      return dateString
    }
  }

  // Group messages by date and add separators
  const getMessagesWithDateSeparators = () => {
    const messagesWithSeparators: any[] = []
    let lastDate = ''
    
    messages.forEach((message, index) => {
      const messageDate = getMessageDate(message.timestamp)
      
      // Add date separator if date changed
      if (messageDate !== lastDate) {
        messagesWithSeparators.push({
          type: 'date-separator',
          id: `date-${index}`,
          date: messageDate
        })
        lastDate = messageDate
      }
      
      // Add the message
      messagesWithSeparators.push({
        type: 'message',
        ...message
      })
    })
    
    return messagesWithSeparators
  }

  // Check if user can edit message (within 5 minutes)
  const canEditMessage = (messageId: string, messageTimestamp?: string) => {
    // For Firebase implementation, use the timestamp
    if (messageTimestamp && messageTimestamp !== "now") {
      try {
        const messageTime = new Date(messageTimestamp).getTime()
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000
        return (now - messageTime) <= fiveMinutes
      } catch {
        // If timestamp parsing fails, fall back to localStorage
      }
    }
    
    // For demo/localStorage implementation, use messageId
    try {
      const messageTimes = JSON.parse(localStorage.getItem('messageTimes') || '{}')
      const messageTime = messageTimes[messageId]
      
      if (!messageTime) {
        return false
      }
      
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000
      return (now - messageTime) <= fiveMinutes
    } catch {
      return false
    }
  }

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessage(messageId)
    setEditText(currentContent)
    setShowMessageMenu(null)
  }

  const handleSaveEdit = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId
          ? { ...message, content: editText }
          : message
      )
    )
    setEditingMessage(null)
    setEditText("")
  }

  const handleCancelEdit = () => {
    setEditingMessage(null)
    setEditText("")
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId))
    setShowMessageMenu(null)
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
              {community.icon}
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">{community.name}</h1>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{formatNumber(community.humans)} humans</span>
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
              {getCommunityLargeIcon(community.id)}
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Welcome to {community.name}!</h3>
            <p className="text-muted-foreground text-sm mb-4">Start the conversation by sending the first message.</p>
          </div>
        ) : (
          getMessagesWithDateSeparators().map((item, index) => {
            if (item.type === 'date-separator') {
              return (
                <div key={item.id} className="flex items-center justify-center my-4">
                  <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-600"></div>
                  <span className="px-3 text-sm text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900">
                    {formatDateSeparator(item.date)}
                  </span>
                  <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-600"></div>
                </div>
              )
            }
            
            const message = item
            
            return (
            <div 
              key={message.id}
              ref={(el) => {
                console.log('Setting ref for message:', message.id, el)
                messageRefs.current[message.id] = el
              }}
            >
              <Card className="border-border bg-card">
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
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{formatNumber(message.views || 0)}</span>
                        </div>
                        {/* Three-dot menu for message author only */}
                        {message.author === currentUser && (
                          <div className="relative" data-message-menu>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-6 w-6 opacity-60 hover:opacity-100"
                              onClick={() => setShowMessageMenu(showMessageMenu === message.id ? null : message.id)}
                            >
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                            {showMessageMenu === message.id && (
                              <div className="absolute right-0 top-7 bg-background border border-border rounded-md shadow-lg z-10 min-w-[120px]">
                                <div className="py-1">
                                  {canEditMessage(message.id, message.timestamp) && (
                                    <button
                                      className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center space-x-2"
                                      onClick={() => handleEditMessage(message.id, message.content)}
                                    >
                                      <Edit className="w-3 h-3" />
                                      <span>Edit</span>
                                    </button>
                                  )}
                                  <button
                                    className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center space-x-2 text-destructive"
                                    onClick={() => handleDeleteMessage(message.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
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
                    
                    {/* Reply Reference */}
                    {message.replyTo && (
                      <div 
                        className="bg-muted/50 rounded-md p-2 mb-2 border-l-2 border-primary/50 cursor-pointer hover:bg-muted/70 transition-colors select-none"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('Reply reference clicked, replyTo:', message.replyTo)
                          scrollToMessage(message.replyTo!.id)
                        }}
                        style={{
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none'
                        }}
                      >
                        <div className="text-xs text-muted-foreground mb-1 pointer-events-none">
                          Replying to {message.replyTo.author}
                        </div>
                        <div className="text-xs text-muted-foreground truncate pointer-events-none">
                          {message.replyTo.content}
                        </div>
                      </div>
                    )}
                    
                    {/* Message Content - Edit Mode or Display Mode */}
                    {editingMessage === message.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[60px] text-sm"
                          placeholder="Edit your message..."
                        />
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(message.id)}
                            className="h-7 px-3 text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="h-7 px-3 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
                    )}
                    
                    {/* Vote and Reply buttons */}
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleVote(message.id, 'up')}
                          className="p-1 h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          style={{ 
                            outline: 'none', 
                            boxShadow: 'none', 
                            border: 'none',
                            background: 'transparent',
                            color: message.userVote === 'up' ? '#22c55e' : '#6b7280'
                          }}
                          onFocus={(e) => e.target.blur()}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-muted-foreground min-w-[20px] text-center">{message.upvotes}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleVote(message.id, 'down')}
                          className="p-1 h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          style={{ 
                            outline: 'none', 
                            boxShadow: 'none', 
                            border: 'none',
                            background: 'transparent',
                            color: message.userVote === 'down' ? '#ef4444' : '#6b7280'
                          }}
                          onFocus={(e) => e.target.blur()}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-muted-foreground min-w-[20px] text-center">{message.downvotes}</span>
                      </div>
                      
                      <button
                        onClick={() => handleReply(message)}
                        className="p-1 h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        style={{ 
                          outline: 'none', 
                          boxShadow: 'none', 
                          border: 'none',
                          background: 'transparent',
                          color: '#6b7280'
                        }}
                        onFocus={(e) => e.target.blur()}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )
          })
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
          {/* Reply Preview */}
          {replyingTo && (
            <div className="bg-muted rounded-lg p-3 border-l-4 border-primary">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">Replying to {replyingTo.author}</span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-muted-foreground hover:text-foreground"
                  style={{ 
                    outline: 'none', 
                    boxShadow: 'none', 
                    border: 'none',
                    background: 'transparent'
                  }}
                  onFocus={(e) => e.target.blur()}
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-muted-foreground truncate">{replyingTo.content}</p>
            </div>
          )}
          
          <div className="flex items-start space-x-2">
            <div className="flex-1 relative">
              <Textarea
                placeholder={`Message ${community.name}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value.slice(0, maxCharacters))}
                className="min-h-[48px] max-h-32 resize-none bg-input border-border text-sm pr-8 pb-6"
                rows={1}
              />
              
              {/* Emoji picker button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEmojiClick}
                className="absolute right-2 top-2 p-1 h-6 w-6"
              >
                <Smile className="w-4 h-4" />
              </Button>
              
              {/* Character counter inside input */}
              <span
                className={`absolute right-2 bottom-1 text-xs pointer-events-none ${
                  newMessage.length > maxCharacters * 0.9 ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {newMessage.length}/{maxCharacters}
              </span>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || newMessage.length > maxCharacters}
              size="sm"
              className="h-[48px] w-[48px] flex-shrink-0"
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
