// API 관련 타입 정의

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginationResponse<T> {
  data: T[]
  total: number
  skip: number
  limit: number
  totalPages: number
  currentPage: number
}

export interface PostsResponse {
  posts: any[]
  total: number
  skip: number
  limit: number
}

export interface CommentsResponse {
  comments: any[]
  total: number
}

export interface UsersResponse {
  users: any[]
  total: number
}

export interface TagsResponse {
  tags: string[]
}

export interface SearchResponse {
  posts: any[]
  total: number
}

// API 에러 타입
export interface ApiError {
  message: string
  status: number
  code?: string
}

// API 요청 파라미터 타입
export interface PaginationParams {
  skip: number
  limit: number
}

export interface SearchParams {
  query: string
  skip?: number
  limit?: number
}

export interface FilterParams {
  tag?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}
