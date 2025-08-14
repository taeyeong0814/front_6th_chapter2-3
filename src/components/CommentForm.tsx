import React from "react"
import { useComments } from "../hooks"
import { useCommentStore, useUIStore } from "../shared/stores"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../shared/ui"

const CommentForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  // Zustand 스토어 직접 사용
  const { newComment, selectedComment, updateNewComment } = useCommentStore()
  const { showAddCommentDialog, showEditCommentDialog, setShowAddCommentDialog, setShowEditCommentDialog } =
    useUIStore()

  // 커스텀 훅에서 API 로직 가져오기
  const { addComment, updateComment } = useComments()

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
            value={comment.body || ""} // ← null 체크 추가
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateNewComment({ body: e.target.value })}
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
