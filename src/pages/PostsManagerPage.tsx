import { Edit2, MessageSquare, Plus, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components"
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

  // 게시물 테이블 렌더링
  const renderPostTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => {
                        setSelectedTag(tag)
                        fetchPostsByTag(tag)
                        updateURL()
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => openUserModal(post.author)}>
                <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                <span>{post.author?.username}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedPost(post)
                    setShowEditDialog(true)
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // 댓글 렌더링
  const renderComments = (postId: number) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedComment(comment)
                  setShowEditCommentDialog(true)
                }}
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

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
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : renderPostTable()}

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
        renderComments={renderComments}
      />

      {/* 사용자 모달 */}
      <UserModal user={selectedUser} isOpen={showUserModal} onClose={() => setShowUserModal(false)} />
    </Card>
  )
}

export default PostsManager
