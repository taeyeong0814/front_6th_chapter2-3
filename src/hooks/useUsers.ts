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

interface UseUsersReturn {
  selectedUser: User | null
  showUserModal: boolean
  openUserModal: (user: { id: number; username: string; image: string }) => void
  setShowUserModal: (show: boolean) => void
}

export const useUsers = (): UseUsersReturn => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)

  // 사용자 모달 열기
  const openUserModal = async (user: { id: number; username: string; image: string }) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
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
