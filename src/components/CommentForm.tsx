import React from "react"
import type { CommentFormProps } from "../types"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "./index"

const CommentForm = ({ comment, isOpen, onClose, onSubmit, onBodyChange, isEdit = false }: CommentFormProps) => {
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onBodyChange(e.target.value)}
          />
          <Button onClick={onSubmit}>{isEdit ? "댓글 업데이트" : "댓글 추가"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentForm
