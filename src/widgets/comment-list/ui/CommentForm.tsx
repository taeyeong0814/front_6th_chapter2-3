import React from "react"
import { useCommentEntity } from "../../../entities/comment"
import { useUIStore } from "../../../shared/stores"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"

const CommentForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { showAddCommentDialog, showEditCommentDialog, setShowAddCommentDialog, setShowEditCommentDialog } =
    useUIStore()

  // 커스텀 훅에서 모든 로직 가져오기
  const { newComment, selectedComment, setNewComment, setSelectedComment, addComment, updateComment } =
    useCommentEntity()

  const comment = isEdit ? selectedComment : newComment
  const isOpen = isEdit ? showEditCommentDialog : showAddCommentDialog
  const onClose = isEdit ? () => setShowEditCommentDialog(false) : () => setShowAddCommentDialog(false)

  if (!comment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "댓글 수정" : "새 댓글 추가"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={comment.body || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (isEdit && selectedComment) {
                // 수정 모드에서는 selectedComment 업데이트
                setSelectedComment({ ...selectedComment, body: e.target.value })
              } else {
                // 추가 모드에서는 newComment 업데이트
                setNewComment({ ...newComment, body: e.target.value })
              }
            }}
          />
          <Button
            onClick={() => {
              if (isEdit) {
                updateComment()
              } else {
                addComment()
              }
            }}
          >
            {isEdit ? "댓글 업데이트" : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentForm
