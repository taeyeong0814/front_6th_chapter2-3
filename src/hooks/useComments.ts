import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addCommentAPI, deleteCommentAPI, fetchCommentsAPI, likeCommentAPI, updateCommentAPI } from "../shared/api"
import { useCommentStore, useUIStore } from "../shared/stores"
import type { Comment } from "../shared/types"

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
      // 직접 캐시 업데이트 (원본 방식과 동일)
      queryClient.setQueryData(["comments"], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          [data.postId]: [...(oldData[data.postId] || []), data],
        }
      })
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
      // 직접 캐시 업데이트 (원본 방식과 동일)
      queryClient.setQueryData(["comments"], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          [data.postId]: oldData[data.postId]?.map((comment: any) => (comment.id === data.id ? data : comment)) || [],
        }
      })
      setShowEditCommentDialog(false)
    },
    onError: (error) => {
      console.error("댓글 수정 오류:", error)
    },
  })

  // 댓글 삭제 (useMutation)
  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentAPI,
    onSuccess: (_, deletedId) => {
      // 직접 캐시 업데이트 (원본 방식과 동일)
      queryClient.setQueryData(["comments"], (oldData: any) => {
        if (!oldData) return oldData
        const newData = { ...oldData }
        Object.keys(newData).forEach((postId) => {
          newData[postId] = newData[postId].filter((comment: any) => comment.id !== deletedId)
        })
        return newData
      })
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
  })

  // 댓글 좋아요 (useMutation)
  const likeCommentMutation = useMutation({
    mutationFn: likeCommentAPI,
    onSuccess: (data) => {
      // 직접 캐시 업데이트 (원본 방식과 동일)
      queryClient.setQueryData(["comments"], (oldData: any) => {
        if (!oldData) return oldData
        const newData = { ...oldData }
        Object.keys(newData).forEach((postId) => {
          newData[postId] = newData[postId].map((comment: any) =>
            comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
          )
        })
        return newData
      })
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
  const deleteComment = (id: number, _postId?: number) => {
    deleteCommentMutation.mutate(id)
  }

  // 댓글 좋아요
  const likeComment = (id: number, _postId?: number) => {
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
