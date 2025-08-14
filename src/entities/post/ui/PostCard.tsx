import React from "react"
import { highlightText } from "../../../shared/lib"
import type { Post } from "../model/types"

interface PostCardProps {
  post: Post
  searchQuery: string
  selectedTag: string
  onTagClick: (tag: string) => void
  onUserClick: (user: any) => void
  onDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onDeleteClick: (postId: number) => void
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  searchQuery,
  selectedTag,
  onTagClick,
  onUserClick,
  onDetailClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{highlightText(post.title, searchQuery)}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">ID: {post.id}</span>
        </div>
      </div>

      <p className="text-gray-700">{highlightText(post.body, searchQuery)}</p>

      <div className="flex flex-wrap gap-1">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className={`px-2 py-1 text-xs font-semibold rounded cursor-pointer ${
              selectedTag === tag
                ? "text-white bg-blue-500 hover:bg-blue-600"
                : "text-blue-800 bg-blue-100 hover:bg-blue-200"
            }`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => post.author && onUserClick(post.author)}
        >
          <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium">{post.author?.username}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            👍 {post.reactions?.likes || 0} 👎 {post.reactions?.dislikes || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
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
    </div>
  )
}
