import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { usePosts } from "../hooks"
import { usePostStore } from "../stores"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./index"

const SearchAndFilterControls = () => {
  // Zustand 스토어 직접 사용
  const {
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    searchPosts,
    clearSearch,
  } = usePostStore()

  // usePosts 훅에서 refetchPosts 가져오기
  const { refetchPosts } = usePosts(0, 10, searchQuery, selectedTag, sortOrder)

  // 태그 목록 상태
  const [tags, setTags] = useState<Array<{ slug: string; name: string; url: string }>>([])

  // 태그 가져오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/posts/tags")
        const data = await response.json()
        setTags(data)
      } catch (error) {
        console.error("태그 가져오기 오류:", error)
      }
    }
    fetchTags()
  }, [])
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = e.currentTarget.value.trim()
                if (query) {
                  searchPosts(query)
                } else {
                  clearSearch()
                  // 빈 값일 때는 전체 데이터를 다시 가져오기
                  refetchPosts()
                }
              }
            }}
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        onValueChange={(tag) => {
          setSelectedTag(tag)
          // 태그 선택 시 검색 결과 초기화
          clearSearch()
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag, index) => (
            <SelectItem key={`tag-${index}`} value={tag.slug}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SearchAndFilterControls
