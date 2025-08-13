import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./index"

interface Post {
  id?: number
  title?: string
  body?: string
}

interface PostDetailDialogProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  highlightText: (text: string, highlight: string) => React.ReactNode
  renderComments: (postId?: number) => React.ReactNode
}

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
