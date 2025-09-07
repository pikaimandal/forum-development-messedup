interface UserAvatarProps {
  username?: string
  avatar?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UserAvatar({ username, avatar, size = "md", className }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10"
  }

  const fallbackText = username 
    ? username.replace('@', '').slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full bg-primary/10 flex items-center justify-center overflow-hidden`}>
      {avatar ? (
        <img 
          src={avatar} 
          alt={username || 'User'} 
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs font-medium text-primary">
          {fallbackText}
        </span>
      )}
    </div>
  )
}
