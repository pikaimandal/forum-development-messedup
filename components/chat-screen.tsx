"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EmojiPicker } from "@/components/emoji-picker"

interface ChatScreenProps {
  onBack: () => void
}

interface Comment {
  id: string
  author: string
  authorAvatar: string
  content: string
  timestamp: string
  upvotes: number
  isVerified: boolean
  replies?: Comment[]
}

interface Post {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  timestamp: string
  upvotes: number
  comments: number
  community: string
  isVerified: boolean
}

// Demo post data
const currentPost: Post = {
  id: "1",
  title: "New World ID verification improvements are live!",
  content: `The latest update brings faster verification times and improved security measures. Here's what's new:

• Reduced verification time from 30 seconds to under 10 seconds
• Enhanced biometric accuracy with new ML models
• Improved user experience with better error handling
• Support for more device types and operating systems

We've been working hard to make World ID the gold standard for human verification. These improvements are just the beginning!

What do you think about these updates? Have you noticed the faster verification times?`,
  author: "WorldcoinTeam",
  authorAvatar: "/worldcoin-team.png",
  timestamp: "2h ago",
  upvotes: 234,
  comments: 45,
  community: "Worldcoin",
  isVerified: true,
}

// Demo comments data
const demoComments: Comment[] = [
  {
    id: "c1",
    author: "TechEnthusiast",
    authorAvatar: "/tech-enthusiast.png",
    content:
      "This is amazing! The verification speed improvement is incredible. Just tested it and it's lightning fast now! 🚀",
    timestamp: "1h ago",
    upvotes: 23,
    isVerified: true,
    replies: [
      {
        id: "c1r1",
        author: "WorldcoinTeam",
        authorAvatar: "/worldcoin-team.png",
        content:
          "Thanks for the feedback! We're thrilled you're enjoying the improvements. More updates coming soon! 💪",
        timestamp: "45m ago",
        upvotes: 12,
        isVerified: true,
      },
    ],
  },
  {
    id: "c2",
    author: "DevBuilder",
    authorAvatar: "/developer-building.png",
    content:
      "Great work on the ML model improvements! As a developer integrating World ID, this makes a huge difference for user experience.",
    timestamp: "1h ago",
    upvotes: 18,
    isVerified: true,
  },
  {
    id: "c3",
    author: "CryptoUser",
    authorAvatar: "/crypto-user.png",
    content:
      "Love the enhanced security measures. Privacy and security are so important in this space. Keep up the excellent work! 🔒",
    timestamp: "30m ago",
    upvotes: 15,
    isVerified: true,
  },
]

export function ChatScreen({ onBack }: ChatScreenProps) {
  const [comments, setComments] = useState<Comment[]>(demoComments)
  const [newComment, setNewComment] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [postUpvoted, setPostUpvoted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: "You",
      authorAvatar: "/diverse-user-avatars.png",
      content: newComment,
      timestamp: "now",
      upvotes: 0,
      isVerified: true,
    }

    if (replyingTo) {
      setComments((prev) =>
        prev.map((c) => (c.id === replyingTo ? { ...c, replies: [...(c.replies || []), comment] } : c)),
      )
      setReplyingTo(null)
    } else {
      setComments((prev) => [...prev, comment])
    }

    setNewComment("")
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewComment((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleUpvotePost = () => {
    setPostUpvoted(!postUpvoted)
  }

  const handleUpvoteComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, upvotes: comment.upvotes + 1 }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, upvotes: reply.upvotes + 1 } : reply,
            ),
          }
        }
        return comment
      }),
    )
  }

  const handlePhotoUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file and get a URL
      const photoComment = `📷 Shared a photo: ${file.name}`
      setNewComment(photoComment)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        <div className="flex-1">
          <h1 className="font-semibold text-foreground">Discussion</h1>
          <p className="text-sm text-muted-foreground">{currentPost.community}</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-muted-foreground">Verified</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Original Post */}
        <Card className="m-4 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentPost.authorAvatar || "/placeholder.svg"} alt={currentPost.author} />
                <AvatarFallback>{currentPost.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold">{currentPost.author}</span>
                  {currentPost.isVerified && (
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
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{currentPost.timestamp}</span>
                  <Badge variant="secondary" className="text-xs">
                    {currentPost.community}
                  </Badge>
                </div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-foreground mb-3">{currentPost.title}</h2>
            <div className="text-foreground whitespace-pre-line mb-4">{currentPost.content}</div>

            <div className="flex items-center space-x-6">
              <button
                onClick={handleUpvotePost}
                className={`flex items-center space-x-2 transition-colors ${
                  postUpvoted ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span className="font-medium">{currentPost.upvotes + (postUpvoted ? 1 : 0)}</span>
              </button>

              <div className="flex items-center space-x-2 text-muted-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="font-medium">{comments.length}</span>
              </div>

              <button className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <div className="px-4 pb-4">
          <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} alt={comment.author} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          {comment.isVerified && (
                            <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>

                        <p className="text-sm text-foreground mb-3">{comment.content}</p>

                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleUpvoteComment(comment.id)}
                            className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            <span className="text-xs">{comment.upvotes}</span>
                          </button>

                          <button
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 space-y-3">
                    {comment.replies.map((reply) => (
                      <Card key={reply.id} className="bg-muted/30">
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} alt={reply.author} />
                              <AvatarFallback>{reply.author[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">{reply.author}</span>
                                {reply.isVerified && (
                                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                                <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                              </div>

                              <p className="text-sm text-foreground mb-2">{reply.content}</p>

                              <button
                                onClick={() => handleUpvoteComment(reply.id)}
                                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                                <span className="text-xs">{reply.upvotes}</span>
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="bg-muted px-4 py-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Replying to {comments.find((c) => c.id === replyingTo)?.author}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Input
              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[40px] resize-none"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAddComment()
                }
              }}
            />
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={handlePhotoUpload} className="p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>

            <Button onClick={handleAddComment} disabled={!newComment.trim()} size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mt-2">
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
