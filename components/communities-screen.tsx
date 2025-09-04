"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface Community {
  id: string
  name: string
  description: string
  members: number
  color: string
  posts: Post[]
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
  communityId: string
  isVerified: boolean
}

interface CommunitiesScreenProps {
  onNavigateToChat: () => void
}

// Demo data
const communities: Community[] = [
  {
    id: "worldcoin",
    name: "Worldcoin",
    description: "Official discussions about Worldcoin protocol and ecosystem",
    members: 12500,
    color: "bg-primary",
    posts: [
      {
        id: "1",
        title: "New World ID verification improvements are live!",
        content: "The latest update brings faster verification times and improved security measures...",
        author: "WorldcoinTeam",
        authorAvatar: "/worldcoin-team.png",
        timestamp: "2h", // Removed "ago" from timestamps
        upvotes: 234,
        comments: 45,
        communityId: "worldcoin",
        isVerified: true,
      },
      {
        id: "2",
        title: "How to integrate World ID into your dApp",
        content: "A comprehensive guide for developers looking to add human verification...",
        author: "DevAdvocate",
        authorAvatar: "/developer-working.png",
        timestamp: "4h", // Removed "ago" from timestamps
        upvotes: 156,
        comments: 28,
        communityId: "worldcoin",
        isVerified: true,
      },
    ],
  },
  {
    id: "general",
    name: "General Discussion",
    description: "Open discussions for verified humans",
    members: 8900,
    color: "bg-blue-500",
    posts: [
      {
        id: "3",
        title: "What's the future of human verification?",
        content: "Interesting thoughts on how biometric verification will evolve...",
        author: "TechPhilosopher",
        authorAvatar: "/contemplative-philosopher.png",
        timestamp: "1h", // Removed "ago" from timestamps
        upvotes: 89,
        comments: 67,
        communityId: "general",
        isVerified: true,
      },
    ],
  },
  {
    id: "developers",
    name: "Developers",
    description: "Technical discussions and development help",
    members: 5600,
    color: "bg-green-500",
    posts: [
      {
        id: "4",
        title: "Best practices for World ID integration",
        content: "Sharing some lessons learned from implementing World ID...",
        author: "FullStackDev",
        authorAvatar: "/developer-coding.png",
        timestamp: "3h", // Removed "ago" from timestamps
        upvotes: 124,
        comments: 34,
        communityId: "developers",
        isVerified: true,
      },
    ],
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Official updates and news",
    members: 15200,
    color: "bg-orange-500",
    posts: [
      {
        id: "5",
        title: "World Forum Beta Launch!",
        content: "Welcome to the world's first human-verified forum platform...",
        author: "WorldForumTeam",
        authorAvatar: "/announcement-team.png",
        timestamp: "6h", // Removed "ago" from timestamps
        upvotes: 567,
        comments: 123,
        communityId: "announcements",
        isVerified: true,
      },
    ],
  },
]

export function CommunitiesScreen({ onNavigateToChat }: CommunitiesScreenProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const allPosts = communities.flatMap((community) => community.posts)
  const filteredPosts =
    selectedCommunity === "all" ? allPosts : communities.find((c) => c.id === selectedCommunity)?.posts || []

  const searchedPosts = filteredPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  const handleCommunityClick = (communityId: string) => {
    setSelectedCommunity(communityId)
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header - Fixed at top */}
      <div className="bg-card border-b border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground">World Forum</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Human Verified</span>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Community Tabs - Fixed below header */}
      <div className="bg-card border-b border-border px-4 py-2 flex-shrink-0">
        <div className="flex space-x-2 overflow-x-auto">
          <Button
            variant={selectedCommunity === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCommunity("all")}
            className="whitespace-nowrap"
          >
            All Posts
          </Button>
          {communities.map((community) => (
            <Button
              key={community.id}
              variant={selectedCommunity === community.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCommunity(community.id)}
              className="whitespace-nowrap"
            >
              {community.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts Feed - Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {selectedCommunity === "all" && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Communities</h2>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {communities.map((community) => (
                <Card
                  key={community.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCommunityClick(community.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${community.color}`}></div>
                      <h3 className="font-semibold text-sm">{community.name}</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-2">{community.description}</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(community.members)} members</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 pb-4">
          <h2 className="text-lg font-semibold mb-3">
            {selectedCommunity === "all"
              ? "Recent Posts"
              : `Posts in ${communities.find((c) => c.id === selectedCommunity)?.name}`}
          </h2>

          <div className="space-y-3">
            {searchedPosts.map((post, index) => {
              const community = communities.find((c) => c.id === post.communityId)
              return (
                <div key={post.id}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToChat}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.authorAvatar || "/placeholder.svg"} alt={post.author} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{post.author}</span>
                            {post.isVerified && (
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
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                            {community && (
                              <>
                                <span className="text-xs text-muted-foreground">•</span>
                                <Badge variant="secondary" className="text-xs">
                                  {community.name}
                                </Badge>
                              </>
                            )}
                          </div>

                          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.content}</p>

                          <div className="flex items-center space-x-4">
                            <button
                              className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                              <span className="text-xs">{post.upvotes}</span>
                            </button>

                            <button
                              className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="text-xs">{post.comments}</span>
                            </button>

                            <button
                              className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
