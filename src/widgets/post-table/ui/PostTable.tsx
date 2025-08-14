import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import React from "react"
import { useCommentEntity } from "../../../entities/comment"
import { usePostEntity } from "../../../entities/post"
import { useUserEntity } from "../../../entities/user"
import { highlightText } from "../../../shared/lib"
import { usePostStore, useUIStore } from "../../../shared/stores"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui"

interface PostTableProps {
  posts?: any[]
  onPostSelect?: (post: any) => void
  onPostEdit?: (post: any) => void
  onPostDelete?: (postId: number) => void
  onTagClick?: (tag: string) => void
  onUserClick?: (user: any) => void
  searchQuery?: string
  selectedTag?: string
  sortBy?: string
  sortOrder?: string
}

export const PostTable: React.FC<PostTableProps> = ({
  posts: externalPosts,
  onPostSelect,
  onPostEdit,
  onPostDelete,
  onTagClick,
  onUserClick,
  searchQuery,
  selectedTag,
  sortBy,
  sortOrder,
}) => {
  // Zustand 스토어 직접 사용 (기본값으로 사용)
  const {
    skip,
    limit,
    searchQuery: storeSearchQuery,
    selectedTag: storeSelectedTag,
    sortBy: storeSortBy,
    sortOrder: storeSortOrder,
    setSelectedPost,
    setSelectedTag,
    searchResults,
    isSearchActive,
    hasSearched,
  } = usePostStore()

  const { setShowPostDetailDialog, setShowEditPostDialog } = useUIStore()
  const { openUserModal } = useUserEntity()

  // Props가 있으면 Props 사용, 없으면 스토어 사용
  const finalSearchQuery = searchQuery ?? storeSearchQuery
  const finalSelectedTag = selectedTag ?? storeSelectedTag
  const finalSortBy = sortBy ?? storeSortBy
  const finalSortOrder = sortOrder ?? storeSortOrder

  // usePostEntity 훅 사용 (올바른 파라미터 전달)
  const { posts: originalPosts, deletePost } = usePostEntity(
    skip,
    limit,
    finalSearchQuery,
    finalSelectedTag,
    finalSortOrder,
  )

  // Props로 받은 posts가 있으면 사용, 없으면 훅에서 가져온 데이터 사용
  const posts = externalPosts ?? (hasSearched && isSearchActive && searchResults ? searchResults : originalPosts)

  // 클라이언트 사이드 정렬
  const sortedPosts = React.useMemo(() => {
    if (!finalSortBy || finalSortBy === "none") return posts

    return [...posts].sort((a: any, b: any) => {
      let aValue: any
      let bValue: any

      switch (finalSortBy) {
        case "id":
          aValue = a.id
          bValue = b.id
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "reactions":
          aValue = (a.reactions?.likes || 0) + (a.reactions?.dislikes || 0)
          bValue = (b.reactions?.likes || 0) + (b.reactions?.dislikes || 0)
          break
        default:
          return 0
      }

      if (finalSortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [posts, finalSortBy, finalSortOrder])

  const { fetchComments } = useCommentEntity()

  // 이벤트 핸들러들 (Props가 있으면 Props 사용, 없으면 기본 동작)
  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag)
    } else {
      setSelectedTag(tag)
    }
  }

  const handleUserClick = async (user: any) => {
    if (onUserClick) {
      onUserClick(user)
    } else {
      openUserModal(user)
    }
  }

  const handlePostDetailClick = async (post: any) => {
    if (onPostSelect) {
      onPostSelect(post)
    } else {
      setSelectedPost(post)
      setShowPostDetailDialog(true)
      await fetchComments(post.id)
    }
  }

  const handlePostEditClick = (post: any) => {
    if (onPostEdit) {
      onPostEdit(post)
    } else {
      setSelectedPost(post)
      setShowEditPostDialog(true)
    }
  }

  const handlePostDeleteClick = (postId: number) => {
    if (onPostDelete) {
      onPostDelete(postId)
    } else {
      deletePost(postId)
    }
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
        {sortedPosts.map((post: any) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, finalSearchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        finalSelectedTag === tag
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
