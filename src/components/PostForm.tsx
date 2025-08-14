import { usePosts } from "../hooks"
import { usePostStore, useUIStore } from "../stores"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "./index"

const PostForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  // Zustand 스토어 직접 사용
  const { newPost, selectedPost, updateNewPost } = usePostStore()
  const { showAddPostDialog, showEditPostDialog, setShowAddPostDialog, setShowEditPostDialog } = useUIStore()

  // 커스텀 훅에서 API 로직 가져오기
  const { addPost, updatePost } = usePosts(0, 10, "", "")

  const post = isEdit ? selectedPost : newPost
  const isOpen = isEdit ? showEditPostDialog : showAddPostDialog
  const onClose = isEdit ? () => setShowEditPostDialog(false) : () => setShowAddPostDialog(false)

  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "게시물 수정" : "새 게시물 추가"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={post.title} onChange={(e) => updateNewPost({ title: e.target.value })} />
          <Textarea
            rows={isEdit ? 15 : 30}
            placeholder="내용"
            value={post.body}
            onChange={(e) => updateNewPost({ body: e.target.value })}
          />
          {!isEdit && (
            <Input
              type="number"
              placeholder="사용자 ID"
              value={post.userId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNewPost({ userId: Number(e.target.value) })}
            />
          )}
          <Button
            onClick={() => {
              if (isEdit) {
                updatePost()
              } else {
                addPost()
              }
            }}
          >
            {isEdit ? "게시물 업데이트" : "게시물 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostForm
