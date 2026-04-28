import type { User } from '~/types/auth'

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const accessToken = useState<string | null>('auth.token', () => null)
  const refreshToken = useState<string | null>('auth.refresh', () => null)
  const isLoading = useState<boolean>('auth.loading', () => false)
  const error = useState<string | null>('auth.error', () => null)

  const isAuthenticated = computed(() => !!accessToken.value)

  const initializeAuth = async () => {
    if (process.client) {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)

      if (storedToken) {
        accessToken.value = storedToken
      }
      if (storedRefreshToken) {
        refreshToken.value = storedRefreshToken
      }
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
        } catch {
          localStorage.removeItem(USER_KEY)
        }
      }
    }
  }

  const setTokens = (newAccessToken: string, newRefreshToken: string) => {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken

    if (process.client) {
      localStorage.setItem(TOKEN_KEY, newAccessToken)
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
    }
  }

  const setUser = (newUser: User | null) => {
    user.value = newUser

    if (process.client) {
      if (newUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(newUser))
      } else {
        localStorage.removeItem(USER_KEY)
      }
    }
  }

  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    error.value = null

    if (process.client) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isAuthenticated,
    initializeAuth,
    setTokens,
    setUser,
    logout,
    clearError
  }
}
