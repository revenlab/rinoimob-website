import type { LoginRequest, RegisterRequest, PasswordResetRequest, LoginResponse } from '~/types/auth'

const API_BASE_URL = '/api/v1'

export const useAuthApi = () => {
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
    return $fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`, {
      method: 'POST'
    })
  }

  const forgotPassword = async (email: string) => {
    return $fetch(`${API_BASE_URL}/auth/forgot-password?email=${email}`, {
      method: 'POST'
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
    return $fetch(
      `${API_BASE_URL}/users/profile?firstName=${firstName}&lastName=${lastName}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

  const changePassword = async (token: string, currentPassword: string, newPassword: string, confirmPassword: string) => {
    return $fetch(
      `${API_BASE_URL}/users/change-password?currentPassword=${currentPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
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
