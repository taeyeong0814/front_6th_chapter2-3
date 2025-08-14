import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"

// QueryClient 인스턴스 생성
const queryClient = new QueryClient()

interface QueryProviderProps {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
