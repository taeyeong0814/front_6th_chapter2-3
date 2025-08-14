import type { Post, PostFormData } from "../types"
import api from "./axios"

// 게시물 목록 조회
export const fetchPostsAPI = async (skip: number, limit: number) => {
  const [postsResponse, usersResponse] = await Promise.all([
    api.get(`/posts?limit=${limit}&skip=${skip}`),
    api.get("/users?limit=0&select=username,image"),
  ])

  const postsData = postsResponse.data
  const usersData = usersResponse.data

  const postsWithUsers = postsData.posts.map((post: Post) => ({
    ...post,
    author: usersData.users.find((user: { id: number; username: string; image: string }) => user.id === post.userId),
  }))

  return { posts: postsWithUsers, total: postsData.total }
}

// 게시물 검색
export const searchPostsAPI = async (query: string) => {
  const response = await api.get(`/posts/search?q=${query}`)
  return response.data
}

// 태그별 게시물 조회
export const fetchPostsByTagAPI = async (tag: string) => {
  const [postsResponse, usersResponse] = await Promise.all([
    api.get(`/posts/tag/${tag}`),
    api.get("/users?limit=0&select=username,image"),
  ])

  const postsData = postsResponse.data
  const usersData = usersResponse.data

  const postsWithUsers = postsData.posts.map((post: Post) => ({
    ...post,
    author: usersData.users.find((user: { id: number; username: string; image: string }) => user.id === post.userId),
  }))

  return { posts: postsWithUsers, total: postsData.total }
}

// 게시물 추가
export const addPostAPI = async (post: PostFormData) => {
  const response = await api.post("/posts/add", post)
  return response.data
}

// 게시물 수정
export const updatePostAPI = async (post: Post) => {
  const response = await api.put(`/posts/${post.id}`, post)
  return response.data
}

// 게시물 삭제
export const deletePostAPI = async (id: number) => {
  await api.delete(`/posts/${id}`)
  return id
}

// 태그 목록 조회
export const fetchTagsAPI = async () => {
  const response = await api.get("/posts/tags")
  return response.data
}
