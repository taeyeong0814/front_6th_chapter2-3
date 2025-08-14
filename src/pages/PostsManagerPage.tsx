import { Plus } from "lucide-react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle, CommentList, PostTable } from "../components"
import CommentForm from "../components/CommentForm"
import Pagination from "../components/Pagination"
import PostDetailDialog from "../components/PostDetailDialog"
import PostForm from "../components/PostForm"
import SearchAndFilterControls from "../components/SearchAndFilterControls"
import UserModal from "../components/UserModal"
import { useComments, usePagination, usePosts, useSearchAndFilter, useUsers } from "../hooks"

interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: {
    likes: number
    dislikes: number
  }
  author?: {
    id: number
    username: string
    image: string
  }
}

const PostsManager = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 커스텀 훅들 사용
  const { skip, limit, setSkip, setLimit, updateURL } = usePagination()
  const {
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    tags,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    highlightText,
  } = useSearchAndFilter(
    queryParams.get("search") || "",
    queryParams.get("tag") || "",
    queryParams.get("sortBy") || "",
    queryParams.get("sortOrder") || "asc",
  )
  const {
    posts,
    total,
    loading,
    selectedPost,
    newPost,
    showAddDialog,
    showEditDialog,
    showPostDetailDialog,
    fetchPosts,
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
  } = usePosts(skip, limit, searchQuery, selectedTag)
  const {
    comments,
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
  } = useComments()
  const { selectedUser, showUserModal, openUserModal, setShowUserModal } = useUsers()

  // URL 파라미터 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])

  // 게시물 상세 보기 시 댓글 가져오기
  const handleOpenPostDetail = (post: Post) => {
    openPostDetail(post)
    fetchComments(post.id)
  }

  // 이벤트 핸들러들
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
    fetchPostsByTag(tag)
    updateURL()
  }

  const handlePostDetailClick = (post: Post) => {
    handleOpenPostDetail(post)
  }

  const handlePostEditClick = (post: Post) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  const handlePostDeleteClick = (postId: number) => {
    deletePost(postId)
  }

  const handleCommentAdd = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  const handleCommentEdit = (comment: any) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

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
          <SearchAndFilterControls
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            sortBy={sortBy}
            sortOrder={sortOrder}
            tags={tags}
            onSearchChange={setSearchQuery}
            onSearchSubmit={() => searchPosts(searchQuery)}
            onTagChange={(value) => {
              setSelectedTag(value)
              fetchPostsByTag(value)
              updateURL()
            }}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={searchQuery}
              selectedTag={selectedTag}
              highlightText={highlightText}
              onTagClick={handleTagClick}
              onUserClick={openUserModal}
              onPostDetailClick={handlePostDetailClick}
              onPostEditClick={handlePostEditClick}
              onPostDeleteClick={handlePostDeleteClick}
            />
          )}

          {/* 페이지네이션 */}
          <Pagination skip={skip} limit={limit} total={total} onLimitChange={setLimit} onSkipChange={setSkip} />
        </div>
      </CardContent>

      {/* 게시물 폼 */}
      <PostForm
        post={newPost}
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSubmit={addPost}
        onTitleChange={(title) => setNewPost({ ...newPost, title })}
        onBodyChange={(body) => setNewPost({ ...newPost, body })}
        onUserIdChange={(userId) => setNewPost({ ...newPost, userId })}
        isEdit={false}
      />

      {/* 게시물 수정 폼 */}
      <PostForm
        post={selectedPost}
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSubmit={updatePost}
        onTitleChange={(title) => setSelectedPost({ ...selectedPost, title })}
        onBodyChange={(body) => setSelectedPost({ ...selectedPost, body })}
        onUserIdChange={(userId) => setSelectedPost({ ...selectedPost, userId })}
        isEdit={true}
      />

      {/* 댓글 추가 대화상자 */}
      <CommentForm
        comment={newComment}
        isOpen={showAddCommentDialog}
        onClose={() => setShowAddCommentDialog(false)}
        onSubmit={addComment}
        onBodyChange={(body) => setNewComment({ ...newComment, body })}
        isEdit={false}
      />

      {/* 댓글 수정 대화상자 */}
      <CommentForm
        comment={selectedComment}
        isOpen={showEditCommentDialog}
        onClose={() => setShowEditCommentDialog(false)}
        onSubmit={updateComment}
        onBodyChange={(body) => setSelectedComment({ ...selectedComment, body })}
        isEdit={true}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        post={selectedPost}
        isOpen={showPostDetailDialog}
        onClose={() => setShowPostDetailDialog(false)}
        searchQuery={searchQuery}
        highlightText={highlightText}
        renderComments={(postId) => (
          <CommentList
            comments={comments[postId] || []}
            postId={postId}
            searchQuery={searchQuery}
            highlightText={highlightText}
            onAddComment={() => handleCommentAdd(postId)}
            onLikeComment={likeComment}
            onEditComment={handleCommentEdit}
            onDeleteComment={deleteComment}
          />
        )}
      />

      {/* 사용자 모달 */}
      <UserModal user={selectedUser} isOpen={showUserModal} onClose={() => setShowUserModal(false)} />
    </Card>
  )
}

export default PostsManager
