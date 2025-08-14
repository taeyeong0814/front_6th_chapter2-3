import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface UsePaginationReturn {
  skip: number
  limit: number
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  updateURL: () => void
}

export const usePagination = (): UsePaginationReturn => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [skip, setSkip] = useState(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState(parseInt(queryParams.get("limit") || "10"))

  // URL 업데이트 함수
  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    navigate(`?${params.toString()}`)
  }

  // URL 파라미터 변경 시 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
  }, [location.search])

  return {
    skip,
    limit,
    setSkip,
    setLimit,
    updateURL,
  }
}
