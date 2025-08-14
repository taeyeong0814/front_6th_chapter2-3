import { create } from "zustand"

// UI 상태 인터페이스
interface UIState {
  // 모달 상태
  showAddPostDialog: boolean
  showEditPostDialog: boolean
  showPostDetailDialog: boolean
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  showUserModal: boolean

  // 로딩 상태
  isLoading: boolean
  loadingMessage: string

  // 액션들
  setShowAddPostDialog: (show: boolean) => void
  setShowEditPostDialog: (show: boolean) => void
  setShowPostDetailDialog: (show: boolean) => void
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
  setShowUserModal: (show: boolean) => void
  setLoading: (loading: boolean, message?: string) => void

  // 모든 모달 닫기
  closeAllModals: () => void
}

// UI 스토어 생성
export const useUIStore = create<UIState>((set) => ({
  // 초기 상태
  showAddPostDialog: false,
  showEditPostDialog: false,
  showPostDetailDialog: false,
  showAddCommentDialog: false,
  showEditCommentDialog: false,
  showUserModal: false,
  isLoading: false,
  loadingMessage: "",

  // 액션들
  setShowAddPostDialog: (show) => set({ showAddPostDialog: show }),
  setShowEditPostDialog: (show) => set({ showEditPostDialog: show }),
  setShowPostDetailDialog: (show) => set({ showPostDetailDialog: show }),
  setShowAddCommentDialog: (show) => set({ showAddCommentDialog: show }),
  setShowEditCommentDialog: (show) => set({ showEditCommentDialog: show }),
  setShowUserModal: (show) => set({ showUserModal: show }),

  setLoading: (loading, message = "") =>
    set({
      isLoading: loading,
      loadingMessage: message,
    }),

  // 모든 모달 닫기
  closeAllModals: () =>
    set({
      showAddPostDialog: false,
      showEditPostDialog: false,
      showPostDetailDialog: false,
      showAddCommentDialog: false,
      showEditCommentDialog: false,
      showUserModal: false,
    }),
}))
