import { create } from "zustand"
import type { Post, PostFormData } from "../shared/types"

// 게시물 상태 인터페이스
interface PostState {
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
  hasSearched: boolean // 실제로 검색을 실행했는지 여부

  // 액션들
  setSelectedPost: (post: Post | null) => void
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
  setSelectedPost: (post) => set({ selectedPost: post }),

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
      // 빈 값일 때는 검색 결과를 초기화하고 전체 데이터를 보여주도록 함
      set({ searchResults: null, isSearchActive: false, hasSearched: false })
      return
    }

    try {
      const response = await fetch(`/api/posts/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      // 검색 결과를 상태에 저장
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

  // 검색 초기화
  clearSearch: () => {
    set({ searchResults: null, isSearchActive: false, hasSearched: false })
  },
}))
