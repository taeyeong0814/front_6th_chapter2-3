// Comment 엔티티 타입 정의
export interface Comment {
  id: number
  body: string
  postId: number
  user: {
    id: number
    username: string
  }
  likes: number
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

export interface CommentListResponse {
  comments: Comment[]
}
