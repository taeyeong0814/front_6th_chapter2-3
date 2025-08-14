import type { User } from "../../../shared/types"

// Post 엔티티 타입 정의
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: User
}

export interface PostFormData {
  title: string
  body: string
  userId: number
}

export interface PostListResponse {
  posts: Post[]
  total: number
}

export interface PostSearchResponse {
  posts: Post[]
  total: number
}
