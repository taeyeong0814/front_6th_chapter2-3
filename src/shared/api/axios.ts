import axios from "axios"

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "/api", // Vite proxy 설정에 맞춰 /api로 설정
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    console.log("API 요청:", config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공
    return response
  },
  (error) => {
    // 오류 응답을 처리
    console.error("API 오류:", error.response?.status, error.response?.data)
    return Promise.reject(error)
  },
)

export default api
