import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import React from "react"
import type { PostActionsProps } from "../shared/types"
import { Button } from "../shared/ui"

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
