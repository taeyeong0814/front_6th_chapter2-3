import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCommentStore, useUIStore } from "../stores"
import type { Comment, CommentFormData, CommentUpdateData } from "../types"

// API 함수들
const fetchCommentsAPI = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`)
  const data = await response.json()
  return data.comments
}

const addCommentAPI = async (comment: CommentFormData) => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  })
  return response.json()
}

const updateCommentAPI = async (comment: CommentUpdateData) => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  })
  return response.json()
}

const deleteCommentAPI = async (id: number) => {
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
  return id
}

const likeCommentAPI = async (id: number) => {
  const response = await fetch(`/api/comments/${id}/like`, {
    method: "POST",
  })
  return response.json()
}

interface UseCommentsReturn {
  comments: { [postId: number]: Comment[] }
  selectedComment: Comment | null
  newComment: { body: string; postId: number | null; userId: number }
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  fetchComments: (postId: number) => void
  addComment: () => void
  updateComment: () => void
  deleteComment: (id: number, postId: number) => void
  likeComment: (id: number, postId: number) => void
  setSelectedComment: (comment: Comment | null) => void
  setNewComment: (comment: { body: string; postId: number | null; userId: number }) => void
  setShowAddCommentDialog: (show: boolean) => void
  setShowEditCommentDialog: (show: boolean) => void
}

export const useComments = (): UseCommentsReturn => {
  const queryClient = useQueryClient()

  // Zustand 스토어 사용
  const { selectedComment, newComment, setSelectedComment, setNewComment, resetNewComment } = useCommentStore()

  const { showAddCommentDialog, showEditCommentDialog, setShowAddCommentDialog, setShowEditCommentDialog } =
    useUIStore()

  // 댓글 목록 조회 (useQuery)
  const { data: commentsData = {} } = useQuery({
    queryKey: ["comments"],
    queryFn: () => Promise.resolve({}), // 초기에는 빈 객체
    enabled: false, // 수동으로만 호출
  })

  // 댓글 추가 (useMutation)
  const addCommentMutation = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: (data) => {
      // 특정 게시물의 댓글 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      setShowAddCommentDialog(false)
      resetNewComment()
    },
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })

  // 댓글 수정 (useMutation)
  const updateCommentMutation = useMutation({
    mutationFn: updateCommentAPI,
    onSuccess: (data) => {
      // 특정 게시물의 댓글 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
      setShowEditCommentDialog(false)
    },
    onError: (error) => {
      console.error("댓글 수정 오류:", error)
    },
  })

  // 댓글 삭제 (useMutation)
  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentAPI,
    onSuccess: () => {
      // 모든 댓글 캐시 무효화 (삭제된 댓글 ID로 postId를 알 수 없으므로)
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
  })

  // 댓글 좋아요 (useMutation)
  const likeCommentMutation = useMutation({
    mutationFn: likeCommentAPI,
    onSuccess: (data) => {
      // 특정 게시물의 댓글 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    },
  })

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    // 이미 캐시에 있는지 확인
    const cachedData = queryClient.getQueryData(["comments", postId])
    if (cachedData) return

    // 캐시에 없으면 새로 요청
    const comments = await fetchCommentsAPI(postId)
    queryClient.setQueryData(["comments", postId], comments)

    // 전체 댓글 데이터 업데이트
    const currentData = queryClient.getQueryData(["comments"]) || {}
    queryClient.setQueryData(["comments"], {
      ...currentData,
      [postId]: comments,
    })
  }

  // 댓글 추가
  const addComment = () => {
    if (newComment.postId) {
      addCommentMutation.mutate({
        body: newComment.body,
        postId: newComment.postId,
        userId: newComment.userId,
      })
    }
  }

  // 댓글 업데이트
  const updateComment = () => {
    if (selectedComment) {
      updateCommentMutation.mutate({
        id: selectedComment.id,
        body: selectedComment.body,
      })
    }
  }

  // 댓글 삭제
  const deleteComment = (id: number) => {
    deleteCommentMutation.mutate(id)
  }

  // 댓글 좋아요
  const likeComment = (id: number) => {
    likeCommentMutation.mutate(id)
  }

  return {
    comments: commentsData,
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
  }
}
