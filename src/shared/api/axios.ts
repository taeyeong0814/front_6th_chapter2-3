import axios from "axios"

// 환경별 API base URL 설정
const API_BASE_URL = process.env.NODE_ENV === "development" ? "/api" : "https://dummyjson.com"

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: false, // 이거 추가 안하면 CORS 에러 뜸
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
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
    return Promise.reject(error)
  },
)

export default api
