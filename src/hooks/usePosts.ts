import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { usePostStore, useUIStore } from "../stores"
import type { Post, PostFormData } from "../types"

// API 함수들
const fetchPostsAPI = async (skip: number, limit: number) => {
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

const searchPostsAPI = async (query: string) => {
  const response = await fetch(`/api/posts/search?q=${query}`)
  const data = await response.json()
  return data
}

const fetchPostsByTagAPI = async (tag: string) => {
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

const addPostAPI = async (post: PostFormData) => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

const updatePostAPI = async (post: Post) => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

const deletePostAPI = async (id: number) => {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
  return id
}

interface UsePostsReturn {
  posts: Post[]
  total: number
  loading: boolean
  selectedPost: Post | null
  newPost: { title: string; body: string; userId: number }
  showAddDialog: boolean
  showEditDialog: boolean
  showPostDetailDialog: boolean
  searchPosts: (query: string) => void
  fetchPostsByTag: (tag: string) => void
  addPost: () => void
  updatePost: () => void
  deletePost: (id: number) => void
  openPostDetail: (post: Post) => void
  setSelectedPost: (post: Post | null) => void
  setNewPost: (post: { title: string; body: string; userId: number }) => void
  setShowAddDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setShowPostDetailDialog: (show: boolean) => void
}

export const usePosts = (skip: number, limit: number, searchQuery: string, selectedTag: string): UsePostsReturn => {
  const queryClient = useQueryClient()

  // Zustand 스토어 사용
  const { selectedPost, newPost, setSelectedPost, setNewPost, resetNewPost } = usePostStore()

  const {
    showAddPostDialog: showAddDialog,
    showEditPostDialog: showEditDialog,
    showPostDetailDialog,
    setShowAddPostDialog: setShowAddDialog,
    setShowEditPostDialog: setShowEditDialog,
    setShowPostDetailDialog,
  } = useUIStore()

  // 게시물 목록 조회 (useQuery)
  const {
    data: postsData = { posts: [], total: 0 },
    isLoading: loading,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["posts", skip, limit, selectedTag],
    queryFn: () => {
      if (selectedTag && selectedTag !== "all") {
        return fetchPostsByTagAPI(selectedTag)
      }
      return fetchPostsAPI(skip, limit)
    },
    enabled: true, // 항상 활성화
  })

  // 게시물 검색 (useQuery)
  const {
    data: searchData,
    isLoading: searchLoading,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ["posts", "search", searchQuery],
    queryFn: () => searchPostsAPI(searchQuery),
    enabled: false, // 수동으로만 호출
  })

  // 검색 실행 상태 관리
  const [isSearchActive, setIsSearchActive] = useState(false)

  // 현재 표시할 데이터 결정 (검색이 활성화되었을 때만 검색 데이터 사용)
  const currentData = isSearchActive && searchData && searchData.posts ? searchData : postsData
  const posts = currentData?.posts || []
  const total = currentData?.total || 0
  const isLoading = searchLoading || loading

  // 디버깅 로그
  console.log("📊 데이터 상태:", {
    isSearchActive,
    searchData: searchData?.posts?.length || 0,
    postsData: postsData?.posts?.length || 0,
    currentPosts: posts.length,
    searchQuery,
    selectedTag,
  })

  // 게시물 추가 (useMutation)
  const addPostMutation = useMutation({
    mutationFn: addPostAPI,
    onSuccess: (data) => {
      // 직접 캐시 업데이트 (원본 방식과 동일)
      queryClient.setQueryData(["posts", skip, limit, selectedTag], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          posts: [data, ...oldData.posts],
          total: oldData.total + 1,
        }
      })
      setShowAddDialog(false)
      resetNewPost()
    },
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
  })

  // 게시물 수정 (useMutation)
  const updatePostMutation = useMutation({
    mutationFn: updatePostAPI,
    onSuccess: (data) => {
      // 직접 캐시 업데이트 (원본 방식과 동일)
      queryClient.setQueryData(["posts", skip, limit, selectedTag], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          posts: oldData.posts.map((post: any) => (post.id === data.id ? data : post)),
        }
      })
      setShowEditDialog(false)
    },
    onError: (error) => {
      console.error("게시물 수정 오류:", error)
    },
  })

  // 게시물 삭제 (useMutation)
  const deletePostMutation = useMutation({
    mutationFn: deletePostAPI,
    onSuccess: (_, deletedId) => {
      // 직접 캐시 업데이트 (원본 방식과 동일)
      queryClient.setQueryData(["posts", skip, limit, selectedTag], (oldData: any) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          posts: oldData.posts.filter((post: any) => post.id !== deletedId),
          total: oldData.total - 1,
        }
      })
    },
    onError: (error) => {
      console.error("게시물 삭제 오류:", error)
    },
  })

  // 게시물 검색
  const searchPosts = (query: string) => {
    if (query) {
      setIsSearchActive(true)
      refetchSearch()
    } else {
      setIsSearchActive(false)
      refetchPosts()
    }
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = (tag: string) => {
    if (tag && tag !== "all") {
      queryClient.invalidateQueries({ queryKey: ["posts", skip, limit, tag] })
    } else {
      refetchPosts()
    }
  }

  // 게시물 추가
  const addPost = () => {
    addPostMutation.mutate(newPost)
  }

  // 게시물 업데이트
  const updatePost = () => {
    if (selectedPost) {
      updatePostMutation.mutate(selectedPost)
    }
  }

  // 게시물 삭제
  const deletePost = (id: number) => {
    deletePostMutation.mutate(id)
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  return {
    posts,
    total,
    loading: isLoading,
    selectedPost,
    newPost,
    showAddDialog,
    showEditDialog,
    showPostDetailDialog,
    searchPosts,
    fetchPostsByTag,
    addPost,
    updatePost,
    deletePost,
    openPostDetail,
    setSelectedPost,
    setNewPost,
    setShowAddDialog,
    setShowEditDialog,
    setShowPostDetailDialog,
  }
}
