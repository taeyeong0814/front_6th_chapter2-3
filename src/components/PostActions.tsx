import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import React from "react"
import { Button } from "./ui"

interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: {
    id: number
    username: string
    image: string
  }
}

interface PostActionsProps {
  post: Post
  onDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onDeleteClick: (postId: number) => void
}

export const PostActions: React.FC<PostActionsProps> = ({ post, onDetailClick, onEditClick, onDeleteClick }) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onDetailClick(post)}>
        <MessageSquare className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onEditClick(post)}>
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDeleteClick(post.id)}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
