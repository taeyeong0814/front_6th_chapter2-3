import React from "react"
import { highlightText } from "../../../shared/lib"
import type { Comment } from "../model/types"

interface CommentItemProps {
  comment: Comment
  searchQuery: string
  onEditClick: (comment: Comment) => void
  onDeleteClick: (commentId: number, postId: number) => void
  onLikeClick: (commentId: number, postId: number) => void
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  searchQuery,
  onEditClick,
  onDeleteClick,
  onLikeClick,
}) => {
  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{comment.user.username}</span>
          <span className="text-xs text-gray-500">ID: {comment.user.id}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onLikeClick(comment.id, comment.postId)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            👍 {comment.likes}
          </button>
        </div>
      </div>

      <p className="text-gray-700">{highlightText(comment.body, searchQuery)}</p>

      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => onEditClick(comment)}
          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          수정
        </button>
        <button
          onClick={() => onDeleteClick(comment.id, comment.postId)}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
