import type { PostDetailDialogProps } from "../types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./index"

const PostDetailDialog = ({
  post,
  isOpen,
  onClose,
  searchQuery,
  highlightText,
  renderComments,
}: PostDetailDialogProps) => {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post.body || "", searchQuery)}</p>
          {renderComments(post.id)}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailDialog
