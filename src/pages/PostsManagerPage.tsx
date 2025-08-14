import { Plus } from "lucide-react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle, PostTable } from "../components"
import CommentForm from "../components/CommentForm"
import Pagination from "../components/Pagination"
import PostDetailDialog from "../components/PostDetailDialog"
import PostForm from "../components/PostForm"
import SearchAndFilterControls from "../components/SearchAndFilterControls"
import UserModal from "../components/UserModal"
import { usePagination, usePosts } from "../hooks"
import { usePostStore, useUIStore } from "../stores"

const PostsManager = () => {
  const location = useLocation()

  // Zustand 스토어 직접 사용
  const { searchQuery, selectedTag, setSearchQuery, setSelectedTag, setSortBy, setSortOrder } = usePostStore()

  const { setShowAddPostDialog: setShowAddDialog } = useUIStore()

  // 커스텀 훅들 사용 (API 로직은 유지)
  const { skip, limit, setSkip, setLimit } = usePagination()
  const { total, loading } = usePosts(skip, limit, searchQuery, selectedTag)

  // URL 파라미터 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])

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
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostTable />}

          {/* 페이지네이션 */}
          <Pagination skip={skip} limit={limit} total={total} onLimitChange={setLimit} onSkipChange={setSkip} />
        </div>
      </CardContent>

      {/* 게시물 폼 */}
      <PostForm isEdit={false} />

      {/* 게시물 수정 폼 */}
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
