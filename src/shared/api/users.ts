// 사용자 정보 조회
export const fetchUserAPI = async (userId: number) => {
  const response = await fetch(`/api/users/${userId}`)
  const userData = await response.json()
  return userData
}
