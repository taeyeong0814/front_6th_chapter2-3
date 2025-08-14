import type { CommentFormData, CommentUpdateData } from "../types"
import api from "./axios"

// 댓글 목록 조회
export const fetchCommentsAPI = async (postId: number) => {
  const response = await api.get(`/comments/post/${postId}`)
  return response.data.comments
}

// 댓글 추가
export const addCommentAPI = async (comment: CommentFormData) => {
  const response = await api.post("/comments/add", comment)
  return response.data
}

// 댓글 수정
export const updateCommentAPI = async (comment: CommentUpdateData) => {
  const response = await api.put(`/comments/${comment.id}`, { body: comment.body })
  return response.data
}

// 댓글 삭제
export const deleteCommentAPI = async (id: number) => {
  await api.delete(`/comments/${id}`)
  return id
}

// 댓글 좋아요
export const likeCommentAPI = async (id: number) => {
  const response = await api.patch(`/comments/${id}`, { likes: 1 }) // 좋아요 증가
  return response.data
}
