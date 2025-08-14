import React, { useState, useEffect } from 'react'

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

export const useSearchAndFilter = (
  initialSearchQuery: string = "",
  initialSelectedTag: string = "",
  initialSortBy: string = "",
  initialSortOrder: string = "asc"
): UseSearchAndFilterReturn => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedTag, setSelectedTag] = useState(initialSelectedTag)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)
  const [tags, setTags] = useState<string[]>([])

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const response = await fetch("/api/posts/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

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

  // 컴포넌트 마운트 시 태그 가져오기
  useEffect(() => {
    fetchTags()
  }, [])

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
