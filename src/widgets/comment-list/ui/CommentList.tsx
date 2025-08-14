import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import React from "react"
import { useComments, useSearchAndFilter } from "../../../hooks"
import { useCommentStore, usePostStore, useUIStore } from "../../../shared/stores"
import { Button } from "../../../shared/ui"

export const CommentList: React.FC = () => {
  // Zustand 스토어 직접 사용
  const { setSelectedComment } = useCommentStore()

  const { setShowAddCommentDialog, setShowEditCommentDialog } = useUIStore()

  // 커스텀 훅에서 데이터 가져오기
  const { comments, deleteComment, likeComment, fetchComments } = useComments()
  const { searchQuery, selectedPost } = usePostStore()
  const { highlightText } = useSearchAndFilter()
  const { setNewComment } = useCommentStore()

  // 현재 선택된 게시물의 댓글만 가져오기
  React.useEffect(() => {
    if (selectedPost) {
      fetchComments(selectedPost.id)
    }
  }, [selectedPost, fetchComments])

  // 이벤트 핸들러들
  const handleAddComment = () => {
    if (selectedPost) {
      // 댓글 추가 시 postId 설정
      setNewComment({ body: "", postId: selectedPost.id, userId: 1 })
    }
    setShowAddCommentDialog(true)
  }

  const handleLikeComment = (commentId: number, postId: number) => {
    likeComment(commentId, postId)
  }

  const handleEditComment = (comment: any) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  const handleDeleteComment = (commentId: number, postId: number) => {
    deleteComment(commentId, postId)
  }
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {selectedPost &&
          comments[selectedPost.id]?.map((comment: any) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id, comment.postId)}>
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEditComment(comment)}>
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id, comment.postId)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
