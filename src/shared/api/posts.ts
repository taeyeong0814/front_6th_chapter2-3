import type { Post, PostFormData } from "../types"

// 게시물 목록 조회
export const fetchPostsAPI = async (skip: number, limit: number) => {
  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`/api/posts?limit=${limit}&skip=${skip}`),
    fetch("/api/users?limit=0&select=username,image"),
  ])

  const postsData = await postsResponse.json()
  const usersData = await usersResponse.json()

  const postsWithUsers = postsData.posts.map((post: Post) => ({
    ...post,
    author: usersData.users.find((user: { id: number; username: string; image: string }) => user.id === post.userId),
  }))

  return { posts: postsWithUsers, total: postsData.total }
}

// 게시물 검색
export const searchPostsAPI = async (query: string) => {
  const response = await fetch(`/api/posts/search?q=${query}`)
  const data = await response.json()
  return data
}

// 태그별 게시물 조회
export const fetchPostsByTagAPI = async (tag: string) => {
  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`/api/posts/tag/${tag}`),
    fetch("/api/users?limit=0&select=username,image"),
  ])

  const postsData = await postsResponse.json()
  const usersData = await usersResponse.json()

  const postsWithUsers = postsData.posts.map((post: Post) => ({
    ...post,
    author: usersData.users.find((user: { id: number; username: string; image: string }) => user.id === post.userId),
  }))

  return { posts: postsWithUsers, total: postsData.total }
}

// 게시물 추가
export const addPostAPI = async (post: PostFormData) => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

// 게시물 수정
export const updatePostAPI = async (post: Post) => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

// 게시물 삭제
export const deletePostAPI = async (id: number) => {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
  return id
}

// 태그 목록 조회
export const fetchTagsAPI = async () => {
  const response = await fetch("/api/posts/tags")
  const data = await response.json()
  return data
}
