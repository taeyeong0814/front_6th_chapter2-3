import type { CommentFormData, CommentUpdateData } from "../types"

// 댓글 목록 조회
export const fetchCommentsAPI = async (postId: number) => {
  const response = await fetch(`/api/comments/post/${postId}`)
  const data = await response.json()
  return data.comments
}

// 댓글 추가
export const addCommentAPI = async (comment: CommentFormData) => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  })
  return response.json()
}

// 댓글 수정
export const updateCommentAPI = async (comment: CommentUpdateData) => {
  const response = await fetch(`/api/comments/${comment.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: comment.body }),
  })
  return response.json()
}

// 댓글 삭제
export const deleteCommentAPI = async (id: number) => {
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  })
  return id
}

// 댓글 좋아요
export const likeCommentAPI = async (id: number) => {
  const response = await fetch(`/api/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: 1 }), // 좋아요 증가
  })
  return response.json()
}
