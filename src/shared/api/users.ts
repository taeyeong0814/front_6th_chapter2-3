import api from "./axios"

// 사용자 정보 조회
export const fetchUserAPI = async (userId: number) => {
  const response = await api.get(`/users/${userId}`)
  return response.data
}
