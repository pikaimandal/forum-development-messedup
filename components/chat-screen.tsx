"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Send, ChevronUp, ChevronDown, MessageCircle } from "lucide-react"
import { DEMO_COMMUNITIES, DEMO_MESSAGES, DEMO_USER } from "@/lib/data"
import type { Message, Reply } from "@/types"

interface ChatScreenProps {
  onBack: () => void
  communityId?: string
}

export default function ChatScreen({ onBack, communityId = "global-chat" }: ChatScreenProps) {
  const [newMessage, setNewMessage] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES[communityId] || [])

  const community = DEMO_COMMUNITIES[communityId]

  const handleVote = (messageId: string, voteType: 'upvote' | 'downvote') => {
    setMessages(prevMessages => 
      prevMessages.map(message => {
        if (message.id === messageId) {
          const newUpvotes = [...message.upvotes]
          const newDownvotes = [...message.downvotes]
          
          if (voteType === 'upvote') {
            if (newUpvotes.includes(DEMO_USER.id)) {
              // Remove upvote
              const index = newUpvotes.indexOf(DEMO_USER.id)
              newUpvotes.splice(index, 1)
            } else {
              // Add upvote and remove downvote if exists
              newUpvotes.push(DEMO_USER.id)
              const downvoteIndex = newDownvotes.indexOf(DEMO_USER.id)
              if (downvoteIndex > -1) {
                newDownvotes.splice(downvoteIndex, 1)
              }
            }
          } else {
            if (newDownvotes.includes(DEMO_USER.id)) {
              // Remove downvote
              const index = newDownvotes.indexOf(DEMO_USER.id)
              newDownvotes.splice(index, 1)
            } else {
              // Add downvote and remove upvote if exists
              newDownvotes.push(DEMO_USER.id)
              const upvoteIndex = newUpvotes.indexOf(DEMO_USER.id)
              if (upvoteIndex > -1) {
                newUpvotes.splice(upvoteIndex, 1)
              }
            }
          }
          
          return {
            ...message,
            upvotes: newUpvotes,
            downvotes: newDownvotes
          }
        }
        return message
      })
    )
  }

  const handleReplyVote = (messageId: string, replyId: string, voteType: 'upvote' | 'downvote') => {
    setMessages(prevMessages =>
      prevMessages.map(message => {
        if (message.id === messageId) {
          return {
            ...message,
            replies: message.replies.map(reply => {
              if (reply.id === replyId) {
                const newUpvotes = [...reply.upvotes]
                const newDownvotes = [...reply.downvotes]
                
                if (voteType === 'upvote') {
                  if (newUpvotes.includes(DEMO_USER.id)) {
                    const index = newUpvotes.indexOf(DEMO_USER.id)
                    newUpvotes.splice(index, 1)
                  } else {
                    newUpvotes.push(DEMO_USER.id)
                    const downvoteIndex = newDownvotes.indexOf(DEMO_USER.id)
                    if (downvoteIndex > -1) {
                      newDownvotes.splice(downvoteIndex, 1)
                    }
                  }
                } else {
                  if (newDownvotes.includes(DEMO_USER.id)) {
                    const index = newDownvotes.indexOf(DEMO_USER.id)
                    newDownvotes.splice(index, 1)
                  } else {
                    newDownvotes.push(DEMO_USER.id)
                    const upvoteIndex = newUpvotes.indexOf(DEMO_USER.id)
                    if (upvoteIndex > -1) {
                      newUpvotes.splice(upvoteIndex, 1)
                    }
                  }
                }
                
                return {
                  ...reply,
                  upvotes: newUpvotes,
                  downvotes: newDownvotes
                }
              }
              return reply
            })
          }
        }
        return message
      })
    )
  }

  const handleReply = (messageId: string) => {
    if (!replyContent.trim()) return

    const newReply: Reply = {
      id: `reply_${Date.now()}`,
      messageId,
      authorId: DEMO_USER.id,
      author: DEMO_USER.username,
      authorAvatar: DEMO_USER.avatar || "/placeholder-user.jpg",
      content: replyContent,
      timestamp: "now",
      createdAt: new Date().toISOString(),
      isVerified: DEMO_USER.isVerified,
      upvotes: [],
      downvotes: []
    }

    setMessages(prevMessages =>
      prevMessages.map(message => {
        if (message.id === messageId) {
          return {
            ...message,
            replies: [...message.replies, newReply]
          }
        }
        return message
      })
    )

    setReplyContent("")
    setReplyingTo(null)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      communityId,
      authorId: DEMO_USER.id,
      author: DEMO_USER.username,
      authorAvatar: DEMO_USER.avatar || "/placeholder-user.jpg",
      content: newMessage,
      timestamp: "now",
      createdAt: new Date().toISOString(),
      isVerified: DEMO_USER.isVerified,
      upvotes: [],
      downvotes: [],
      replies: []
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className={`w-3 h-3 ${community?.color} rounded-full`} />
          <div>
            <h1 className="font-semibold">{community?.name}</h1>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{community?.members.toLocaleString()} members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.authorAvatar} />
                  <AvatarFallback>{message.author[1]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{message.author}</span>
                    {message.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-sm mb-3">{message.content}</p>
                  
                  {/* Vote and Reply buttons */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleVote(message.id, 'upvote')}
                      className={`flex items-center space-x-1 ${
                        message.upvotes.includes(DEMO_USER.id) 
                          ? 'text-green-500' 
                          : 'text-gray-500 hover:text-green-500'
                      }`}
                    >
                      <ChevronUp className="h-4 w-4" />
                      <span className="text-xs">{message.upvotes.length}</span>
                    </button>
                    <button
                      onClick={() => handleVote(message.id, 'downvote')}
                      className={`flex items-center space-x-1 ${
                        message.downvotes.includes(DEMO_USER.id)
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                      <span className="text-xs">{message.downvotes.length}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(replyingTo === message.id ? null : message.id)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">Reply ({message.replies.length})</span>
                    </button>
                  </div>

                  {/* Reply input */}
                  {replyingTo === message.id && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="mb-2 text-sm"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReply(message.id)}
                          disabled={!replyContent.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {message.replies.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-muted space-y-3">
                      {message.replies.map((reply) => (
                        <div key={reply.id} className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.authorAvatar} />
                              <AvatarFallback>{reply.author[1]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{reply.author}</span>
                                {reply.isVerified && (
                                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                )}
                                <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                              </div>
                              <p className="text-sm mb-2">{reply.content}</p>
                              
                              {/* Reply vote buttons */}
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleReplyVote(message.id, reply.id, 'upvote')}
                                  className={`flex items-center space-x-1 ${
                                    reply.upvotes.includes(DEMO_USER.id)
                                      ? 'text-green-500'
                                      : 'text-gray-500 hover:text-green-500'
                                  }`}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                  <span className="text-xs">{reply.upvotes.length}</span>
                                </button>
                                <button
                                  onClick={() => handleReplyVote(message.id, reply.id, 'downvote')}
                                  className={`flex items-center space-x-1 ${
                                    reply.downvotes.includes(DEMO_USER.id)
                                      ? 'text-red-500'
                                      : 'text-gray-500 hover:text-red-500'
                                  }`}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                  <span className="text-xs">{reply.downvotes.length}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              placeholder="Share your thoughts..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="resize-none"
              rows={1}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}