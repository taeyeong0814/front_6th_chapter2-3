// Comment 관련 타입 정의

export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: {
    id: number
    username: string
  }
}

export interface CommentFormData {
  body: string
  postId: number
  userId: number
}

export interface CommentUpdateData {
  id: number
  body: string
}

export interface CommentListProps {
  comments: Comment[]
  postId: number
  searchQuery: string
  highlightText: (text: string, highlight: string) => JSX.Element | null
  onAddComment: () => void
  onLikeComment: (id: number, postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (id: number, postId: number) => void
}

export interface CommentFormProps {
  comment: Comment | { body: string; postId: number | null; userId: number }
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  onBodyChange: (body: string) => void
  isEdit: boolean
}
