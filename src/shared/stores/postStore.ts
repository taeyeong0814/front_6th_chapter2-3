import { create } from "zustand"
import { searchPostsAPI } from "../api"
import type { Post, PostFormData } from "../types"

// 게시물 상태 인터페이스
interface PostState {
  // 게시물 데이터
  posts: Post[]
  total: number
  skip: number
  limit: number

  // 선택된 게시물
  selectedPost: Post | null

  // 새 게시물 폼 데이터
  newPost: PostFormData

  // 게시물 필터 상태
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string

  // 검색 결과 상태
  searchResults: Post[] | null
  isSearchActive: boolean
  hasSearched: boolean

  // 액션들
  setPosts: (posts: Post[]) => void
  setTotal: (total: number) => void
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setSelectedPost: (post: Post | null) => void
  updateSelectedPost: (updates: Partial<Post>) => void
  setNewPost: (post: PostFormData) => void
  updateNewPost: (updates: Partial<PostFormData>) => void
  resetNewPost: () => void

  // 필터 액션들
  setSearchQuery: (query: string) => void
  setSelectedTag: (tag: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: string) => void
  resetFilters: () => void

  // 검색 액션
  searchPosts: (query: string) => Promise<void>
  clearSearch: () => void
}

// 초기 새 게시물 데이터
const initialNewPost: PostFormData = {
  title: "",
  body: "",
  userId: 1,
}

// 게시물 스토어 생성
export const usePostStore = create<PostState>((set) => ({
  // 초기 상태
  posts: [],
  total: 0,
  skip: 0,
  limit: 10,
  selectedPost: null,
  newPost: initialNewPost,
  searchQuery: "",
  selectedTag: "",
  sortBy: "",
  sortOrder: "asc",
  searchResults: null,
  isSearchActive: false,
  hasSearched: false,

  // 액션들
  setPosts: (posts) => set({ posts }),
  setTotal: (total) => set({ total }),
  setSkip: (skip) => set({ skip }),
  setLimit: (limit) => set({ limit }),
  setSelectedPost: (post) => set({ selectedPost: post }),

  updateSelectedPost: (updates) =>
    set((state) => ({
      selectedPost: state.selectedPost ? { ...state.selectedPost, ...updates } : null,
    })),

  setNewPost: (post) => set({ newPost: post }),

  updateNewPost: (updates) =>
    set((state) => ({
      newPost: { ...state.newPost, ...updates },
    })),

  resetNewPost: () => set({ newPost: initialNewPost }),

  // 필터 액션들
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  resetFilters: () =>
    set({
      searchQuery: "",
      selectedTag: "",
      sortBy: "",
      sortOrder: "asc",
    }),

  // 검색 액션
  searchPosts: async (query: string) => {
    if (!query.trim()) {
      set({ searchResults: null, isSearchActive: false, hasSearched: false })
      return
    }

    try {
      const data = await searchPostsAPI(query)

      set({
        searchResults: data.posts || [],
        isSearchActive: true,
        hasSearched: true,
      })
    } catch (error) {
      console.error("검색 오류:", error)
      set({ searchResults: [], isSearchActive: true, hasSearched: true })
    }
  },

  clearSearch: () => {
    set({ searchResults: null, isSearchActive: false, hasSearched: false })
  },
}))
