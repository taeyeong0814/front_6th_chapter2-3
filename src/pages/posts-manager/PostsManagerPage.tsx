import { Plus } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { updateURLParam } from "../../shared/lib"
import { usePostStore, useUIStore } from "../../shared/stores"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui"
import { CommentForm } from "../../widgets/comment-list"
import { PostDetailDialog } from "../../widgets/post-detail"
import { PostTable } from "../../widgets/post-table"
import { SearchAndFilterControls } from "../../widgets/search-filter"

const PostsManager = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Zustand 스토어 직접 사용
  const { searchQuery, selectedTag, sortBy, sortOrder, setSearchQuery, setSelectedTag, setSortBy, setSortOrder } =
    usePostStore()

  const { setShowAddPostDialog: setShowAddDialog } = useUIStore()

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    updateURLParam(params, "search", searchQuery)
    updateURLParam(params, "tag", selectedTag)
    updateURLParam(params, "sortBy", sortBy)
    updateURLParam(params, "sortOrder", sortOrder)
    navigate(`?${params.toString()}`)
  }, [searchQuery, selectedTag, sortBy, sortOrder, navigate])

  // URL 파라미터 동기화 (URL → 상태)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])

  // 상태 변경 시 URL 업데이트 (상태 → URL)
  useEffect(() => {
    updateURL()
  }, [updateURL])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchAndFilterControls />

          {/* 게시물 테이블 */}
          <PostTable />

          {/* 페이지네이션은 PostTable 내부에서 처리 */}
        </div>
      </CardContent>

      {/* 댓글 추가 대화상자 */}
      <CommentForm isEdit={false} />

      {/* 댓글 수정 대화상자 */}
      <CommentForm isEdit={true} />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog />
    </Card>
  )
}

export default PostsManager
