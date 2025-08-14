import React from "react"
import type { Post } from "../model/types"

interface PostActionsProps {
  post: Post
  onDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onDeleteClick: (postId: number) => void
}

export const PostActions: React.FC<PostActionsProps> = ({ post, onDetailClick, onEditClick, onDeleteClick }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onDetailClick(post)}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        상세보기
      </button>
      <button
        onClick={() => onEditClick(post)}
        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        수정
      </button>
      <button
        onClick={() => onDeleteClick(post.id)}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
      >
        삭제
      </button>
    </div>
  )
}
