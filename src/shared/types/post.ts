// Post 관련 타입 정의

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: {
    id: number
    username: string
    image: string
  }
}

export interface PostFormData {
  title: string
  body: string
  userId: number
}

export interface PostFilters {
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
}

export interface PostTableProps {
  posts: Post[]
  searchQuery: string
  selectedTag: string
  highlightText: (text: string, highlight: string) => React.ReactElement | null
  onTagClick: (tag: string) => void
  onUserClick: (user: any) => void
  onPostDetailClick: (post: Post) => void
  onPostEditClick: (post: Post) => void
  onPostDeleteClick: (postId: number) => void
}

export interface PostCardProps {
  post: Post
  searchQuery: string
  selectedTag: string
  highlightText: (text: string, highlight: string) => React.ReactElement | null
  onTagClick: (tag: string) => void
  onUserClick: (user: any) => void
  onPostDetailClick: (post: Post) => void
  onPostEditClick: (post: Post) => void
  onPostDeleteClick: (postId: number) => void
}

export interface PostActionsProps {
  post: Post
  onDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onDeleteClick: (postId: number) => void
}

export interface PostFormProps {
  post: Post | { title: string; body: string; userId: number }
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  onTitleChange: (title: string) => void
  onBodyChange: (body: string) => void
  onUserIdChange: (userId: number) => void
  isEdit: boolean
}

export interface PostDetailDialogProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  highlightText: (text: string, highlight: string) => React.ReactElement | null
  renderComments: (postId: number) => React.ReactElement
}
