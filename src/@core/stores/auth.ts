import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cookieRef } from '@layouts/stores/config'

interface User {
  email: string
  password: string
}

interface AuthState {
  token: string | null
  users: User[]
  rememberedEmail: string | null
  currentUserEmail: string | null
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = cookieRef<string | null>('authToken', null)
  const rememberedEmail = cookieRef<string | null>('rememberedEmail', null)
  const users = ref<User[]>([])
  const currentUserEmail = ref<string | null>(null)

  const generateToken = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = 32
    let result = 'mock-jwt-'
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }

  // Actions
  const register = async (email: string, password: string) => {
    if (users.value.some(user => user.email === email)) {
      throw new Error('Email already exists')
    }

    users.value.push({ email, password })
    token.value = generateToken()
    currentUserEmail.value = email
  }

  const login = async (email: string, password: string) => {
    const user = users.value.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    token.value = generateToken()
    currentUserEmail.value = email
    return { user: { email }, token: token.value }
  }

  const logout = () => {
    token.value = null
    // rememberedEmail.value = null
    currentUserEmail.value = null
  }

  const setRememberedEmail = (email: string | null) => {
    rememberedEmail.value = email
  }

  // Getters
  const isAuthenticated = () => !!token.value
  const tokenValue = () => token.value

  return {
    token,
    users,
    rememberedEmail,
    currentUserEmail,
    register,
    login,
    logout,
    setRememberedEmail,
    isAuthenticated,
    tokenValue
  }
})
