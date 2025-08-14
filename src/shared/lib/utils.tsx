import type { JSX } from "react"

/**
 * 텍스트에서 검색어를 하이라이트하는 함수
 * @param text - 원본 텍스트
 * @param highlight - 하이라이트할 검색어
 * @returns 하이라이트된 JSX 요소
 */
export const highlightText = (text: string, highlight: string): JSX.Element | null => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  
  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  )
}

/**
 * URL 파라미터를 업데이트하는 함수
 * @param params - URLSearchParams 객체
 * @param key - 파라미터 키
 * @param value - 파라미터 값
 */
export const updateURLParam = (params: URLSearchParams, key: string, value: string | number) => {
  if (value) {
    params.set(key, value.toString())
  }
}

/**
 * 숫자를 천 단위로 포맷팅하는 함수
 * @param num - 포맷팅할 숫자
 * @returns 포맷팅된 문자열
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

/**
 * 날짜를 포맷팅하는 함수
 * @param date - 포맷팅할 날짜
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 텍스트를 특정 길이로 자르는 함수
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 잘린 텍스트
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
