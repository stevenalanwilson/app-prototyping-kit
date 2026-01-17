/**
 * Shared type definitions
 * Re-export types from API or define app-wide types here
 */

export type { Item } from '@/lib/api'

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
