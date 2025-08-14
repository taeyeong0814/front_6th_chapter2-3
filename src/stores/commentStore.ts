import { create } from "zustand"
import type { Comment } from "../types"

// 댓글 상태 인터페이스
interface CommentState {
  // 선택된 댓글
  selectedComment: Comment | null

  // 새 댓글 폼 데이터
  newComment: {
    body: string
    postId: number | null
    userId: number
  }

  // 액션들
  setSelectedComment: (comment: Comment | null) => void
  setNewComment: (comment: { body: string; postId: number | null; userId: number }) => void
  updateNewComment: (updates: Partial<{ body: string; postId: number | null; userId: number }>) => void
  resetNewComment: () => void
}

// 초기 새 댓글 데이터
const initialNewComment = {
  body: "",
  postId: null as number | null,
  userId: 1,
}

// 댓글 스토어 생성
export const useCommentStore = create<CommentState>((set) => ({
  // 초기 상태
  selectedComment: null,
  newComment: initialNewComment,

  // 액션들
  setSelectedComment: (comment) => set({ selectedComment: comment }),

  setNewComment: (comment) => set({ newComment: comment }),

  updateNewComment: (updates) =>
    set((state) => ({
      newComment: { ...state.newComment, ...updates },
    })),

  resetNewComment: () => set({ newComment: initialNewComment }),
}))
