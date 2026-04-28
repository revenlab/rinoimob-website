import type { LoginRequest, RegisterRequest, PasswordResetRequest, LoginResponse } from '~/types/auth'

export const useAuthApi = () => {
  const config = useRuntimeConfig()
  const API_BASE_URL = `${config.public.apiUrl.replace(/\/$/, '')}/api/v1`

  const register = async (data: RegisterRequest) => {
    return $fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: data
    })
  }

  const login = async (data: LoginRequest): Promise<LoginResponse> => {
    return $fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: data
    })
  }

  const verifyEmail = async (token: string) => {
    return $fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      body: { token }
    })
  }

  const forgotPassword = async (email: string) => {
    return $fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      body: { email }
    })
  }

  const resetPassword = async (data: PasswordResetRequest) => {
    return $fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      body: data
    })
  }

  const getProfile = async (token: string) => {
    return $fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  const updateProfile = async (token: string, firstName: string, lastName: string) => {
    return $fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: { firstName, lastName }
    })
  }

  const changePassword = async (token: string, currentPassword: string, newPassword: string, confirmPassword: string) => {
    return $fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { currentPassword, newPassword, confirmPassword }
    })
  }

  return {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    changePassword
  }
}
