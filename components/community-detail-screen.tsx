"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Users, MessageCircle, Shield, CheckCircle, UserMinus, Crown, Clock, Globe, Code, Newspaper, Brain, HelpCircle, Megaphone } from "lucide-react"

interface Community {
  id: string
  name: string
  description: string
  members: number
  color: string
  rules: string[]
  moderators: string[]
  icon: React.ComponentType<{ className?: string }>
}

interface CommunityDetailScreenProps {
  communityId: string
  onBack: () => void
  onJoinCommunity: (communityId: string) => void
  onLeaveCommunity: (communityId: string) => void
  onEnterChat: (communityId: string) => void
  isJoined: boolean
}

const communityData: Record<string, Community> = {
  "global-chat": {
    id: "global-chat",
    name: "Global Chat",
    description:
      "General discussion room for all topics and community introductions. This is the main hub where verified humans can connect, share ideas, and engage in meaningful conversations about any subject.",
    members: 18500,
    color: "bg-primary",
    icon: Globe,
    rules: [
      "Be respectful and kind to all community members",
      "No spam, self-promotion, or off-topic content",
      "Keep discussions constructive and meaningful",
      "Report inappropriate behavior to moderators",
    ],
    moderators: ["@CommunityMod", "@GlobalAdmin"],
  },
  developer: {
    id: "developer",
    name: "Developer",
    description:
      "Technical discussions, code reviews, and development help. Share your projects, ask for advice, and collaborate with fellow developers on various programming languages and technologies.",
    members: 5600,
    color: "bg-emerald-500",
    icon: Code,
    rules: [
      "Share code snippets and technical resources",
      "Help others with programming questions",
      "No job postings without prior approval",
      "Keep discussions technical and relevant",
    ],
    moderators: ["@DevLead", "@TechModerator"],
  },
  "world-news": {
    id: "world-news",
    name: "World News",
    description:
      "Global news, current events, and world affairs discussion. Stay informed about what's happening around the world and engage in thoughtful discussions about current events.",
    members: 12300,
    color: "bg-blue-500",
    icon: Newspaper,
    rules: [
      "Share credible news sources only",
      "Maintain civil discourse on sensitive topics",
      "No misinformation or conspiracy theories",
      "Fact-check before sharing information",
    ],
    moderators: ["@NewsEditor", "@FactChecker"],
  },
  "ai-tech": {
    id: "ai-tech",
    name: "AI & Tech",
    description:
      "Artificial intelligence, technology innovations, and future trends. Explore the latest developments in AI, discuss emerging technologies, and share insights about the future of tech.",
    members: 8900,
    color: "bg-purple-500",
    icon: Brain,
    rules: [
      "Share AI research and tech innovations",
      "Discuss ethical implications of technology",
      "No fear-mongering about AI",
      "Support claims with credible sources",
    ],
    moderators: ["@AIResearcher", "@TechExpert"],
  },
  qa: {
    id: "qa",
    name: "Q&A",
    description:
      "Questions, answers, and knowledge sharing from the community. Ask anything you're curious about and help others by sharing your knowledge and expertise.",
    members: 6700,
    color: "bg-amber-500",
    icon: HelpCircle,
    rules: [
      "Ask clear and specific questions",
      "Provide helpful and accurate answers",
      "Search before asking duplicate questions",
      "Thank contributors for their help",
    ],
    moderators: ["@KnowledgeKeeper", "@HelpModerator"],
  },
  announcements: {
    id: "announcements",
    name: "Announcements",
    description:
      "Official updates, news, and important platform announcements. Stay up to date with the latest Forum features, policy changes, and community updates.",
    members: 15200,
    color: "bg-orange-500",
    icon: Megaphone,
    rules: [
      "Official announcements only",
      "Read announcements before asking questions",
      "Provide feedback constructively",
      "Follow new guidelines promptly",
    ],
    moderators: ["@WorldForumTeam", "@CommunityManager"],
  },
}

export function CommunityDetailScreen({
  communityId,
  onBack,
  onJoinCommunity,
  onLeaveCommunity,
  onEnterChat,
  isJoined,
}: CommunityDetailScreenProps) {
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const community = communityData[communityId]

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

  const getIconTextColor = (communityId: string) => {
    if (communityId === "global-chat") {
      return "text-primary-foreground"
    }
    return "text-white"
  }

  const handleJoin = async () => {
    setIsJoining(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onJoinCommunity(communityId)
    setIsJoining(false)
  }

  const handleLeave = async () => {
    setIsLeaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onLeaveCommunity(communityId)
    setIsLeaving(false)
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex-shrink-0 bg-background">
        <div className="flex items-center space-x-3 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Community</h1>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div
                className={`w-16 h-16 rounded-2xl ${community.color} flex items-center justify-center flex-shrink-0`}
              >
                <community.icon className={`w-8 h-8 ${getIconTextColor(community.id)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-bold text-foreground">{community.name}</h2>
                  {isJoined && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Joined
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{formatNumber(community.members)} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
                <p className="text-foreground text-sm leading-relaxed">{community.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-4">
          {isJoined ? (
            <div className="flex space-x-3">
              <Button onClick={() => onEnterChat(communityId)} size="default" className="flex-1 h-12">
                <MessageCircle className="w-5 h-5 mr-2" />
                Enter Chat Room
              </Button>
              <Button
                onClick={handleLeave}
                disabled={isLeaving}
                variant="outline"
                size="default"
                className="px-4 h-12 bg-transparent border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                {isLeaving ? (
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                ) : (
                  <UserMinus className="w-5 h-5" />
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={handleJoin} disabled={isJoining} size="default" className="w-full h-12">
              {isJoining ? (
                <>
                  <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Joining Community...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Join Community
                </>
              )}
            </Button>
          )}

          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{formatNumber(community.members)}</div>
                  <div className="text-xs text-muted-foreground">Total Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">24/7</div>
                  <div className="text-xs text-muted-foreground">Always Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Community Guidelines</h3>
              </div>
              <div className="space-y-3">
                {community.rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-foreground text-sm leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-foreground">Community Moderators</h3>
              </div>
              <div className="space-y-2">
                {community.moderators.map((moderator, index) => (
                  <div key={moderator} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-foreground">{moderator}</span>
                        <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-700 border-amber-500/20">
                          Moderator
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Active now</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">About This Community</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground font-medium">January 2024</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary" className="bg-muted text-foreground">
                    {community.id === "developer"
                      ? "Technology"
                      : community.id === "world-news"
                        ? "News"
                        : community.id === "ai-tech"
                          ? "Technology"
                          : community.id === "qa"
                            ? "Help & Support"
                            : community.id === "announcements"
                              ? "Official"
                              : "General"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Verification Required</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-foreground font-medium">ORB Verified</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
