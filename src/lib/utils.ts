import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with clsx and tailwind-merge.
 * This is commonly used in component libraries to handle class name merging.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return '—'

  const units = ['o', 'Ko', 'Mo', 'Go', 'To']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

/**
 * Parses Kubernetes scheduling error messages to extract concise status information.
 * Example input: "Scheduling: Unschedulable - 0/1 nodes are available: 1 Insufficient cpu..."
 * Example output: "0/1 nodes available: Insufficient cpu"
 */
export function parseK8sInsufficientResourceMessage(
  message: string | undefined
): string | null {
  if (!message) return null

  // Match pattern: "X/Y nodes are available: Z Insufficient [resource]"
  const match = message.match(
    /(\d+\/\d+)\s+nodes?\s+are\s+available:\s+\d+\s+Insufficient\s+(\w+)/i
  )

  if (match) {
    const [, nodeRatio, resource] = match
    return `${nodeRatio} nodes available: Insufficient ${resource.toLowerCase()}`
  }

  // Fallback: return the original message if pattern doesn't match
  return message
}
