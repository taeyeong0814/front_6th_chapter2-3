import { useSearchAndFilter } from "../hooks"
import { usePostStore, useUIStore } from "../stores"
import { CommentList } from "./CommentList"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./index"

const PostDetailDialog = () => {
  // Zustand 스토어 직접 사용
  const { selectedPost, searchQuery } = usePostStore()
  const { showPostDetailDialog, setShowPostDetailDialog } = useUIStore()

  // 커스텀 훅에서 데이터 가져오기
  const { highlightText } = useSearchAndFilter()

  const post = selectedPost
  const isOpen = showPostDetailDialog
  const onClose = () => setShowPostDetailDialog(false)

  // 댓글 렌더링 함수
  const renderComments = (_postId: number) => {
    return <CommentList />
  }

  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{highlightText(post.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{highlightText(post.body || "", searchQuery)}</p>
          </div>
          <div className="border-t pt-4">{renderComments(post.id)}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostDetailDialog
