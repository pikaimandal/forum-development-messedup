"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, ChevronRight } from "lucide-react"

interface Community {
  id: string
  name: string
  description: string
  members: number
  color: string
}

interface CommunitiesScreenProps {
  onNavigateToCommunity: (communityId: string) => void
  joinedCommunities: Set<string>
}

const communities: Community[] = [
  {
    id: "global-chat",
    name: "Global Chat",
    description: "General discussion room for all topics and community introductions",
    members: 18500,
    color: "bg-primary",
  },
  {
    id: "developer",
    name: "Developer",
    description: "Technical discussions, code reviews, and development help",
    members: 5600,
    color: "bg-emerald-500",
  },
  {
    id: "world-news",
    name: "World News",
    description: "Global news, current events, and world affairs discussion",
    members: 12300,
    color: "bg-blue-500",
  },
  {
    id: "ai-tech",
    name: "AI & Tech",
    description: "Artificial intelligence, technology innovations, and future trends",
    members: 8900,
    color: "bg-purple-500",
  },
  {
    id: "qa",
    name: "Q&A",
    description: "Questions, answers, and knowledge sharing from the community",
    members: 6700,
    color: "bg-amber-500",
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Official updates, news, and important platform announcements",
    members: 15200,
    color: "bg-orange-500",
  },
]

export function CommunitiesScreen({ onNavigateToCommunity, joinedCommunities }: CommunitiesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"
    }
    return num.toString()
  }

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Communities</h1>
            <p className="text-sm text-muted-foreground mt-1">Join verified human discussions</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-muted-foreground">Human Verified</span>
          </div>
        </div>

        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-input border-border"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4">
          {filteredCommunities.map((community) => {
            const isJoined = joinedCommunities.has(community.id)

            return (
              <Card
                key={community.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border bg-card hover:bg-card/80"
                onClick={() => onNavigateToCommunity(community.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl ${community.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <Users className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-lg text-foreground">{community.name}</h3>
                          {isJoined && (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                              Joined
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{community.description}</p>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatNumber(community.members)} members</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No communities found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}
