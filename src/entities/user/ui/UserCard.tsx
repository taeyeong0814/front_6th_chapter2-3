import React from "react"
import type { UserSummary } from "../model/types"

interface UserCardProps {
  user: UserSummary
  onClick: (user: UserSummary) => void
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <div
      className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100"
      onClick={() => onClick(user)}
    >
      <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
      <span className="text-sm font-medium">{user.username}</span>
    </div>
  )
}
