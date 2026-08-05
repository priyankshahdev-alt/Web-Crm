import axios from 'axios'
import { BASE_URL } from '../config/api'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    isMaster: boolean
    roles: string[]
  }
  organizations: unknown[]
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: string
          errors?: Array<{
            message?: string
            details?: Array<{ message?: string }>
          }>
        }
      | undefined
    const firstDetail = data?.errors?.[0]?.details?.[0]?.message
    if (firstDetail) return firstDetail
    const firstError = data?.errors?.[0]?.message
    if (firstError) return firstError
    if (data?.message) return data.message
  }
  return 'Unable to sign in. Please try again.'
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  try {
    const response = await client.post<{
      success: boolean
      data: LoginResponse
    }>('/auth/login', input)
    return response.data.data
  } catch (error) {
    throw new Error(extractErrorMessage(error))
  }
}
