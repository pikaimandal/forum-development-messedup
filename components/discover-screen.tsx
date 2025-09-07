"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Users, Clock, Star } from "lucide-react"
import { CommunityService } from "@/lib/firebase-services"
import { FirebaseCommunity } from "@/types/firebase"

interface DiscoverScreenProps {
  onNavigateToCommunity: (communityId: string) => void
}

interface TrendingTopic {
  id: string
  title: string
  community: string
  communityId: string
  engagement: number
  timeframe: string
}

interface FeaturedCommunity {
  id: string
  name: string
  description: string
  members: number
  color: string
  category: string
  isNew?: boolean
}

const trendingTopics: TrendingTopic[] = [
  {
    id: "1",
    title: "World ID integration best practices",
    community: "Developer",
    communityId: "developer",
    engagement: 234,
    timeframe: "24h",
  },
  {
    id: "2",
    title: "Digital identity adoption worldwide",
    community: "World News",
    communityId: "world-news",
    engagement: 189,
    timeframe: "12h",
  },
  {
    id: "3",
    title: "AI-powered verification systems",
    community: "AI & Tech",
    communityId: "ai-tech",
    engagement: 156,
    timeframe: "6h",
  },
  {
    id: "4",
    title: "Privacy concerns with biometric data",
    community: "Q&A",
    communityId: "qa",
    engagement: 142,
    timeframe: "18h",
  },
]

const featuredCommunities: FeaturedCommunity[] = []

export function DiscoverScreen({ onNavigateToCommunity }: DiscoverScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredCommunities, setFeaturedCommunities] = useState<FeaturedCommunity[]>([])
  const [loading, setLoading] = useState(true)

  // Load featured communities from Firebase
  useEffect(() => {
    const loadFeaturedCommunities = async () => {
      try {
        setLoading(true)
        const firebaseCommunities = await CommunityService.getAllCommunities()
        
        // Transform Firebase communities to featured format (show top 3 by member count)
        const transformedCommunities: FeaturedCommunity[] = firebaseCommunities
          .sort((a, b) => b.memberCount - a.memberCount)
          .slice(0, 3)
          .map((community: FirebaseCommunity) => ({
            id: community.id,
            name: community.name,
            description: community.description,
            members: community.memberCount,
            color: community.color,
            category: community.category,
            isNew: community.memberCount < 100, // Mark as new if less than 100 members
          }))
        
        setFeaturedCommunities(transformedCommunities)
      } catch (error) {
        console.error("Error loading featured communities:", error)
        setFeaturedCommunities([])
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedCommunities()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search topics, communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border rounded-full h-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        {/* Trending Topics */}
        <section>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Trending</h2>
          </div>
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <Card
                key={topic.id}
                className="cursor-pointer hover:bg-muted/50 transition-all duration-200 border-border bg-card active:scale-95"
                onClick={() => onNavigateToCommunity(topic.communityId)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        <Badge variant="secondary" className="text-xs">
                          {topic.community}
                        </Badge>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="text-xs">{topic.timeframe}</span>
                        </div>
                      </div>
                      <h3 className="font-medium text-foreground text-sm mb-1">{topic.title}</h3>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-xs">{topic.engagement} upvotes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Communities */}
        <section>
          <div className="flex items-center space-x-2 mb-3">
            <Star className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Featured</h2>
          </div>
          <div className="space-y-2">
            {featuredCommunities.map((community) => (
              <Card
                key={community.id}
                className="cursor-pointer hover:bg-muted/50 transition-all duration-200 border-border bg-card active:scale-95"
                onClick={() => onNavigateToCommunity(community.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${community.color} flex items-center justify-center`}>
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-sm text-foreground">{community.name}</h3>
                        {community.isNew && (
                          <Badge className="bg-secondary text-secondary-foreground text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs mb-1">{community.description}</p>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span className="text-xs">{formatNumber(community.members)} members</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 flex-col space-y-1 bg-transparent">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">All Trending</span>
            </Button>
            <Button variant="outline" className="h-12 flex-col space-y-1 bg-transparent">
              <Users className="w-4 h-4" />
              <span className="text-xs">Categories</span>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
