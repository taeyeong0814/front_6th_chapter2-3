import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import React from "react"
import { useComments, usePosts, useSearchAndFilter } from "../hooks"
import { usePostStore, useUIStore, useUserStore } from "../stores"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./index"

export const PostTable: React.FC = () => {
  // Zustand 스토어 직접 사용
  const { searchQuery, selectedTag, setSelectedPost, setSelectedTag, searchResults, isSearchActive, hasSearched } =
    usePostStore()

  const { setShowPostDetailDialog, setShowEditPostDialog } = useUIStore()

  const { setSelectedUser } = useUserStore()
  const { setShowUserModal } = useUIStore()

  // 커스텀 훅에서 데이터 가져오기
  const { posts: originalPosts, deletePost } = usePosts(0, 10, searchQuery, selectedTag)

  // 실제로 검색을 실행했을 때만 검색 결과를 사용
  const posts = hasSearched && isSearchActive && searchResults ? searchResults : originalPosts
  const { highlightText } = useSearchAndFilter()
  const { fetchComments } = useComments()

  // 이벤트 핸들러들
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag)
  }

  const handleUserClick = async (user: any) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  const handlePostDetailClick = async (post: any) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)

    // 댓글 가져오기
    await fetchComments(post.id)
  }

  const handlePostEditClick = (post: any) => {
    setSelectedPost(post)
    setShowEditPostDialog(true)
  }

  const handlePostDeleteClick = (postId: number) => {
    deletePost(postId)
  }
  return (
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
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => post.author && handleUserClick(post.author)}
              >
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
                <Button variant="ghost" size="sm" onClick={() => handlePostDetailClick(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePostEditClick(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePostDeleteClick(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
