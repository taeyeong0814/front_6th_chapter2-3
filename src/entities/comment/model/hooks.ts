import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addCommentAPI,
  deleteCommentAPI,
  fetchCommentsAPI,
  likeCommentAPI,
  updateCommentAPI,
} from "../../../shared/api"
import { useCommentStore, useUIStore } from "../../../shared/stores"

// Comment 엔티티 커스텀 훅
export const useCommentEntity = () => {
  const queryClient = useQueryClient()

  // Zustand 스토어 사용
  const { selectedComment, newComment, setSelectedComment, setNewComment, resetNewComment } = useCommentStore()

  const { showAddCommentDialog, showEditCommentDialog, setShowAddCommentDialog, setShowEditCommentDialog } =
    useUIStore()

  // 댓글 목록 조회 (useQuery)
  const { data: commentsData = {} } = useQuery({
    queryKey: ["comments"],
    queryFn: () => Promise.resolve({}),
    enabled: false,
  })

  // 댓글 추가 (useMutation)
  const addCommentMutation = useMutation({
    mutationFn: addCommentAPI,
    onSuccess: (data) => {
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
    const cachedData = queryClient.getQueryData(["comments", postId])
    if (cachedData) return

    const comments = await fetchCommentsAPI(postId)
    queryClient.setQueryData(["comments", postId], comments)

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
