import { Plus } from "lucide-react"
import { useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { usePostEntity } from "../../entities/post"
import { UserModal } from "../../entities/user"
import { updateURLParam } from "../../shared/lib"
import { usePostStore, useUIStore } from "../../shared/stores"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui"
import { CommentForm } from "../../widgets/comment-list"
import { PostDetailDialog } from "../../widgets/post-detail"
import { PostForm } from "../../widgets/post-form"
import { PostTable } from "../../widgets/post-table"
import { SearchAndFilterControls } from "../../widgets/search-filter"

const PostsManager = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Zustand 스토어 직접 사용
  const {
    skip,
    limit,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
  } = usePostStore()

  const { setShowAddPostDialog: setShowAddDialog } = useUIStore()

  // usePostEntity 훅 사용
  const { refetchPosts, total: entityTotal } = usePostEntity(skip, limit, searchQuery, selectedTag, sortOrder)

  // URL 업데이트 함수
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    updateURLParam(params, "skip", skip.toString())
    updateURLParam(params, "limit", limit.toString())
    updateURLParam(params, "search", searchQuery)
    updateURLParam(params, "tag", selectedTag)
    updateURLParam(params, "sortBy", sortBy)
    updateURLParam(params, "sortOrder", sortOrder)
    navigate(`?${params.toString()}`)
  }, [skip, limit, searchQuery, selectedTag, sortBy, sortOrder, navigate])

  // URL 파라미터 동기화 (URL → 상태)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search, setSkip, setLimit, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])

  // 상태 변경 시 URL 업데이트 및 데이터 가져오기
  useEffect(() => {
    refetchPosts()
    updateURL()
  }, [refetchPosts, updateURL])

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

          {/* 원본과 동일한 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= entityTotal} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostForm isEdit={false} />

      {/* 게시물 수정 대화상자 */}
      <PostForm isEdit={true} />

      {/* 댓글 추가 대화상자 */}
      <CommentForm isEdit={false} />

      {/* 댓글 수정 대화상자 */}
      <CommentForm isEdit={true} />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog />

      {/* 사용자 모달 */}
      <UserModal />
    </Card>
  )
}

export default PostsManager
