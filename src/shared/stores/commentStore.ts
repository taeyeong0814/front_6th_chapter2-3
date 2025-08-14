import { create } from "zustand"
import type { Comment } from "../types"

interface CommentState {
  comments: Record<number, Comment[]>
  selectedComment: Comment | null
  newComment: any
  showCommentModal: boolean
}

interface CommentActions {
  setComments: (postId: number, comments: Comment[]) => void
  addComment: (postId: number, comment: Comment) => void
  deleteComment: (postId: number, commentId: number) => void
  setSelectedComment: (comment: Comment | null) => void
  updateComment: (field: string, value: any) => void
  setNewComment: (comment: any) => void
  updateNewComment: (field: string, value: any) => void
  resetNewComment: () => void
  setShowCommentModal: (show: boolean) => void
}

export const useCommentStore = create<CommentState & CommentActions>((set) => ({
  // 상태
  comments: {},
  selectedComment: null,
  newComment: {},
  showCommentModal: false,

  // 액션들
  setComments: (postId, comments) =>
    set((state) => ({
      comments: { ...state.comments, [postId]: comments },
    })),

  addComment: (postId, comment) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] || []), comment],
      },
    })),

  deleteComment: (postId, commentId) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).filter((comment) => comment.id !== commentId),
      },
    })),

  setSelectedComment: (comment) => set({ selectedComment: comment }),

  updateComment: (field, value) =>
    set((state) => ({
      selectedComment: state.selectedComment ? { ...state.selectedComment, [field]: value } : null,
    })),

  setNewComment: (comment) => set({ newComment: comment }),

  updateNewComment: (field, value) =>
    set((state) => ({
      newComment: { ...state.newComment, [field]: value },
    })),

  resetNewComment: () => set({ newComment: {} }),

  setShowCommentModal: (show) => set({ showCommentModal: show }),
}))
