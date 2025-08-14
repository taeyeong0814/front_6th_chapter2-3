import { useQuery } from "@tanstack/react-query"
import type { JSX } from "react"
import { useState } from "react"

interface UseSearchAndFilterReturn {
  searchQuery: string
  selectedTag: string
  sortBy: string
  sortOrder: string
  tags: string[]
  setSearchQuery: (query: string) => void
  setSelectedTag: (tag: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (sortOrder: string) => void
  setTags: (tags: string[]) => void
  fetchTags: () => void
  highlightText: (text: string, highlight: string) => JSX.Element | null
}

// API 함수
const fetchTagsAPI = async () => {
  const response = await fetch("/api/posts/tags")
  const data = await response.json()
  return data
}

export const useSearchAndFilter = (
  initialSearchQuery: string = "",
  initialSelectedTag: string = "",
  initialSortBy: string = "",
  initialSortOrder: string = "asc",
): UseSearchAndFilterReturn => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedTag, setSelectedTag] = useState(initialSelectedTag)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)

  // 태그 목록 조회 (useQuery)
  const { data: tags = [], refetch: refetchTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsAPI,
    staleTime: 10 * 60 * 1000, // 10분 (태그는 자주 변경되지 않음)
  })

  // 하이라이트 함수
  const highlightText = (text: string, highlight: string): JSX.Element | null => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 태그 가져오기 (기존 함수와 동일한 인터페이스 유지)
  const fetchTags = () => {
    refetchTags()
  }

  // setTags 함수 (기존 인터페이스 유지)
  const setTags = (_newTags: string[]) => {
    // React Query로 관리되므로 실제로는 사용되지 않음
    // 하지만 기존 인터페이스를 유지하기 위해 빈 함수로 유지
  }

  return {
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    tags,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    setTags,
    fetchTags,
    highlightText,
  }
}
