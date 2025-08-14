import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface User {
  id: number
  username: string
  image: string
  email?: string
  firstName?: string
  lastName?: string
  age?: number
  gender?: string
  phone?: string
  birthDate?: string
  eyeColor?: string
  height?: number
  weight?: number
  domain?: string
  ip?: string
  address?: {
    address: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
    postalCode: string
    state: string
  }
  macAddress?: string
  university?: string
  bank?: {
    cardExpire: string
    cardNumber: string
    cardType: string
    currency: string
    iban: string
  }
  company?: {
    address: {
      address: string
      city: string
      coordinates: {
        lat: number
        lng: number
      }
      postalCode: string
      state: string
    }
    department: string
    name: string
    title: string
  }
  ein?: string
  ssn?: string
  userAgent?: string
}

// API 함수
const fetchUserAPI = async (userId: number) => {
  const response = await fetch(`/api/users/${userId}`)
  const userData = await response.json()
  return userData
}

interface UseUsersReturn {
  selectedUser: User | null
  showUserModal: boolean
  openUserModal: (user: { id: number; username: string; image: string }) => void
  setShowUserModal: (show: boolean) => void
}

export const useUsers = (): UseUsersReturn => {
  const queryClient = useQueryClient()
  const [showUserModal, setShowUserModal] = useState(false)

  // 사용자 정보 조회 (useQuery)
  const { data: selectedUser, refetch: fetchUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => Promise.resolve(null), // 초기에는 null
    enabled: false, // 수동으로만 호출
  })

  // 사용자 모달 열기
  const openUserModal = async (user: { id: number; username: string; image: string }) => {
    // 이미 캐시에 있는지 확인
    const cachedUser = queryClient.getQueryData(["user", user.id])
    if (cachedUser) {
      queryClient.setQueryData(["user"], cachedUser)
      setShowUserModal(true)
      return
    }

    // 캐시에 없으면 새로 요청
    try {
      const userData = await fetchUserAPI(user.id)
      queryClient.setQueryData(["user", user.id], userData) // 캐시에 저장
      queryClient.setQueryData(["user"], userData) // 현재 선택된 사용자로 설정
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  return {
    selectedUser: selectedUser || null,
    showUserModal,
    openUserModal,
    setShowUserModal,
  }
}
