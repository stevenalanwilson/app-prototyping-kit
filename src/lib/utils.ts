import { type ClassValue, clsx } from 'clsx'

/**
 * Utility to merge Tailwind classes with proper handling of conflicts
 * Simplified version - for production consider 'tailwind-merge'
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
