import { useQueryClient } from "@tanstack/react-query"
import { fetchUserAPI } from "../shared/api"
import { useUIStore, useUserStore } from "../shared/stores"
import type { User } from "../shared/types"

interface UseUsersReturn {
  selectedUser: User | null
  showUserModal: boolean
  openUserModal: (user: { id: number; username: string; image: string }) => void
  setShowUserModal: (show: boolean) => void
}

export const useUsers = (): UseUsersReturn => {
  const queryClient = useQueryClient()

  // Zustand 스토어 사용
  const { selectedUser, setSelectedUser } = useUserStore()
  const { showUserModal, setShowUserModal } = useUIStore()

  // 사용자 모달 열기
  const openUserModal = async (user: { id: number; username: string; image: string }) => {
    // 이미 캐시에 있는지 확인
    const cachedUser = queryClient.getQueryData(["user", user.id])
    if (cachedUser) {
      queryClient.setQueryData(["user"], cachedUser)
      setSelectedUser(cachedUser as User)
      setShowUserModal(true)
      return
    }

    // 캐시에 없으면 새로 요청
    try {
      const userData = await fetchUserAPI(user.id)
      queryClient.setQueryData(["user", user.id], userData) // 캐시에 저장
      queryClient.setQueryData(["user"], userData) // 현재 선택된 사용자로 설정
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return {
    selectedUser,
    showUserModal,
    openUserModal,
    setShowUserModal,
  }
}
