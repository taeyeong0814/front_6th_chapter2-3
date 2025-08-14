import { create } from "zustand"
import type { User } from "../types"

// 사용자 상태 인터페이스
interface UserState {
  // 선택된 사용자
  selectedUser: User | null

  // 액션들
  setSelectedUser: (user: User | null) => void
  clearSelectedUser: () => void
}

// 사용자 스토어 생성
export const useUserStore = create<UserState>((set) => ({
  // 초기 상태
  selectedUser: null,

  // 액션들
  setSelectedUser: (user) => set({ selectedUser: user }),
  clearSelectedUser: () => set({ selectedUser: null }),
}))
