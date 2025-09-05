"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, MessageCircle, Shield, CheckCircle, UserMinus } from "lucide-react"

interface Community {
  id: string
  name: string
  description: string
  members: number
  color: string
  rules: string[]
  moderators: string[]
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
    rules: [
      "Be respectful and kind to all community members",
      "No spam, self-promotion, or off-topic content",
      "Keep discussions constructive and meaningful",
      "Report inappropriate behavior to moderators",
    ],
    moderators: ["CommunityMod", "GlobalAdmin"],
  },
  developer: {
    id: "developer",
    name: "Developer",
    description:
      "Technical discussions, code reviews, and development help. Share your projects, ask for advice, and collaborate with fellow developers on various programming languages and technologies.",
    members: 5600,
    color: "bg-emerald-500",
    rules: [
      "Share code snippets and technical resources",
      "Help others with programming questions",
      "No job postings without prior approval",
      "Keep discussions technical and relevant",
    ],
    moderators: ["DevLead", "TechModerator"],
  },
  "world-news": {
    id: "world-news",
    name: "World News",
    description:
      "Global news, current events, and world affairs discussion. Stay informed about what's happening around the world and engage in thoughtful discussions about current events.",
    members: 12300,
    color: "bg-blue-500",
    rules: [
      "Share credible news sources only",
      "Maintain civil discourse on sensitive topics",
      "No misinformation or conspiracy theories",
      "Fact-check before sharing information",
    ],
    moderators: ["NewsEditor", "FactChecker"],
  },
  "ai-tech": {
    id: "ai-tech",
    name: "AI & Tech",
    description:
      "Artificial intelligence, technology innovations, and future trends. Explore the latest developments in AI, discuss emerging technologies, and share insights about the future of tech.",
    members: 8900,
    color: "bg-purple-500",
    rules: [
      "Share AI research and tech innovations",
      "Discuss ethical implications of technology",
      "No fear-mongering about AI",
      "Support claims with credible sources",
    ],
    moderators: ["AIResearcher", "TechExpert"],
  },
  qa: {
    id: "qa",
    name: "Q&A",
    description:
      "Questions, answers, and knowledge sharing from the community. Ask anything you're curious about and help others by sharing your knowledge and expertise.",
    members: 6700,
    color: "bg-amber-500",
    rules: [
      "Ask clear and specific questions",
      "Provide helpful and accurate answers",
      "Search before asking duplicate questions",
      "Thank contributors for their help",
    ],
    moderators: ["KnowledgeKeeper", "HelpModerator"],
  },
  announcements: {
    id: "announcements",
    name: "Announcements",
    description:
      "Official updates, news, and important platform announcements. Stay up to date with the latest World Forum features, policy changes, and community updates.",
    members: 15200,
    color: "bg-orange-500",
    rules: [
      "Official announcements only",
      "Read announcements before asking questions",
      "Provide feedback constructively",
      "Follow new guidelines promptly",
    ],
    moderators: ["WorldForumTeam", "CommunityManager"],
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
      <div className="bg-card border-b border-border px-6 py-4 flex-shrink-0">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl ${community.color} flex items-center justify-center`}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{community.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{formatNumber(community.members)} members</span>
                {isJoined && (
                  <>
                    <span>•</span>
                    <span className="text-primary font-medium">Joined</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Community Info */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">About this community</h2>
              <p className="text-muted-foreground leading-relaxed">{community.description}</p>
            </CardContent>
          </Card>

          {/* Join/Enter/Leave Buttons */}
          <div className="flex justify-center space-x-3">
            {isJoined ? (
              <>
                <Button onClick={() => onEnterChat(communityId)} size="lg" className="flex-1 max-w-sm">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Enter Chat Room
                </Button>
                <Button
                  onClick={handleLeave}
                  disabled={isLeaving}
                  variant="outline"
                  size="lg"
                  className="px-6 bg-transparent"
                >
                  {isLeaving ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  ) : (
                    <UserMinus className="w-5 h-5" />
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={handleJoin} disabled={isJoining} size="lg" className="w-full max-w-sm">
                {isJoining ? (
                  <>
                    <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Joining...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Join Community
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Community Rules */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Community Rules</h2>
              </div>
              <ul className="space-y-3">
                {community.rules.map((rule, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Moderators */}
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Moderators</h2>
              <div className="flex flex-wrap gap-2">
                {community.moderators.map((moderator) => (
                  <div key={moderator} className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Shield className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{moderator}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
