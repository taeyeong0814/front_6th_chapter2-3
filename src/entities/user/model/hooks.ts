import { useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchUserAPI } from "../../../shared/api"
import { useUIStore, useUserStore } from "../../../shared/stores"
import type { User } from "./types"

// User 엔티티 커스텀 훅
export const useUserEntity = () => {
  const queryClient = useQueryClient()

  // Zustand 스토어 사용
  const { selectedUser, setSelectedUser } = useUserStore()
  const { showUserModal, setShowUserModal } = useUIStore()

  // 사용자 정보 조회 (useQuery)
  const {
    data: userData,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", selectedUser?.id],
    queryFn: () => fetchUserAPI(selectedUser!.id),
    enabled: !!selectedUser?.id,
  })

  // 사용자 모달 열기
  const openUserModal = async (user: { id: number; username: string; image: string }) => {
    // 이미 캐시에 있는지 확인
    const cachedUser = queryClient.getQueryData(["user", user.id])
    if (cachedUser) {
      setSelectedUser(cachedUser as User)
      setShowUserModal(true)
      return
    }

    // 캐시에 없으면 새로 요청
    try {
      const userData = await fetchUserAPI(user.id)
      queryClient.setQueryData(["user", user.id], userData) // 캐시에 저장
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return {
    selectedUser: userData || selectedUser,
    showUserModal,
    openUserModal,
    setShowUserModal,
    userLoading,
    refetchUser,
  }
}
