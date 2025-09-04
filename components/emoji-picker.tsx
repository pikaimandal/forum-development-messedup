"use client"

import { Button } from "@/components/ui/button"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

const emojiCategories = {
  Smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
  ],
  Gestures: [
    "👍",
    "👎",
    "👌",
    "🤌",
    "🤏",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
  ],
  Hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
  Objects: [
    "🔥",
    "💯",
    "💎",
    "🚀",
    "⭐",
    "🌟",
    "✨",
    "⚡",
    "💡",
    "🎉",
    "🎊",
    "🏆",
    "🥇",
    "🎯",
    "📱",
    "💻",
    "🖥️",
    "⌚",
    "📷",
    "🎵",
    "🎶",
  ],
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg max-h-48 overflow-y-auto">
      <div className="space-y-3">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category}>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">{category}</h4>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => onEmojiSelect(emoji)}
                  className="h-8 w-8 p-0 text-lg hover:bg-muted"
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
