import { useQuery } from "@tanstack/react-query"
import type { JSX } from "react"
import { fetchTagsAPI } from "../shared/api"
import { highlightText } from "../shared/lib"
import { usePostStore } from "../shared/stores"

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
  fetchTags: () => void
  highlightText: (text: string, highlight: string) => JSX.Element | null
}

export const useSearchAndFilter = (): UseSearchAndFilterReturn => {
  // Zustand 스토어 사용
  const { searchQuery, selectedTag, sortBy, sortOrder, setSearchQuery, setSelectedTag, setSortBy, setSortOrder } =
    usePostStore()

  // 태그 목록 조회 (useQuery)
  const { data: tags = [], refetch: refetchTags } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTagsAPI,
    staleTime: 10 * 60 * 1000, // 10분 (태그는 자주 변경되지 않음)
  })

  // 태그 가져오기 (기존 함수와 동일한 인터페이스 유지)
  const fetchTags = () => {
    refetchTags()
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
    fetchTags,
    highlightText,
  }
}
