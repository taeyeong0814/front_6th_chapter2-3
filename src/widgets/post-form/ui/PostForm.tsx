import { usePostEntity } from "../../../entities/post"
import { usePostStore, useUIStore } from "../../../shared/stores"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"

const PostForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  // Zustand 스토어 사용
  const {
    newPost,
    selectedPost,
    updateNewPost,
    updateSelectedPost,
    resetNewPost,
    skip,
    limit,
    selectedTag,
    sortOrder,
  } = usePostStore()
  const { showAddPostDialog, showEditPostDialog, setShowAddPostDialog, setShowEditPostDialog } = useUIStore()

  // usePostEntity 훅 사용
  const { addPost, updatePost } = usePostEntity(skip, limit, "", selectedTag, sortOrder)

  const post = isEdit ? selectedPost : newPost
  const isOpen = isEdit ? showEditPostDialog : showAddPostDialog
  const onClose = isEdit ? () => setShowEditPostDialog(false) : () => setShowAddPostDialog(false)

  if (!post) return null

  const handleAddPost = () => {
    addPost()
  }

  const handleUpdatePost = () => {
    updatePost()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "게시물 수정" : "새 게시물 추가"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post.title || ""}
            onChange={(e) => {
              if (isEdit) {
                // 수정 모드에서는 selectedPost 업데이트
                updateSelectedPost({ title: e.target.value })
              } else {
                // 추가 모드에서는 newPost 업데이트
                updateNewPost({ title: e.target.value })
              }
            }}
          />
          <Textarea
            rows={isEdit ? 15 : 30}
            placeholder="내용"
            value={post.body || ""}
            onChange={(e) => {
              if (isEdit) {
                // 수정 모드에서는 selectedPost 업데이트
                updateSelectedPost({ body: e.target.value })
              } else {
                // 추가 모드에서는 newPost 업데이트
                updateNewPost({ body: e.target.value })
              }
            }}
          />
          {!isEdit && (
            <Input
              type="number"
              placeholder="사용자 ID"
              value={post.userId || 1}
              onChange={(e) => updateNewPost({ userId: Number(e.target.value) })}
            />
          )}
          <Button onClick={isEdit ? handleUpdatePost : handleAddPost}>
            {isEdit ? "게시물 업데이트" : "게시물 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostForm
