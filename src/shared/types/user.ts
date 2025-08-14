// User 관련 타입 정의

export interface User {
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

export interface UserProfile {
  id: number
  username: string
  image: string
  email?: string
  firstName?: string
  lastName?: string
}

export interface UserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}
