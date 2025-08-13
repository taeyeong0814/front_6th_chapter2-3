import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "./index"

interface Post {
  id?: number
  title: string
  body: string
  userId: number
}

interface PostFormProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  onTitleChange: (title: string) => void
  onBodyChange: (body: string) => void
  onUserIdChange: (userId: number) => void
  isEdit?: boolean
}

const PostForm = ({
  post,
  isOpen,
  onClose,
  onSubmit,
  onTitleChange,
  onBodyChange,
  onUserIdChange,
  isEdit = false,
}: PostFormProps) => {
  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "게시물 수정" : "새 게시물 추가"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={post.title} onChange={(e) => onTitleChange(e.target.value)} />
          <Textarea
            rows={isEdit ? 15 : 30}
            placeholder="내용"
            value={post.body}
            onChange={(e) => onBodyChange(e.target.value)}
          />
          {!isEdit && (
            <Input
              type="number"
              placeholder="사용자 ID"
              value={post.userId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUserIdChange(Number(e.target.value))}
            />
          )}
          <Button onClick={onSubmit}>{isEdit ? "게시물 업데이트" : "게시물 추가"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PostForm
