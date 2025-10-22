/**
 * Formats file size from KB to the most appropriate unit with 2 decimal places
 * @param sizeInKB - File size in kilobytes
 * @returns Formatted string with appropriate unit (KB, MB, GB, TB)
 */
export function formatFileSize(sizeInKB: number | null | undefined): string {
  if (!sizeInKB || sizeInKB === 0) {
    return '0.00 KB'
  }

  const size = sizeInKB

  if (size < 1024) {
    return `${size.toFixed(2)} KB`
  }

  const sizeInMB = size / 1024
  if (sizeInMB < 1024) {
    return `${sizeInMB.toFixed(2)} MB`
  }

  const sizeInGB = sizeInMB / 1024
  if (sizeInGB < 1024) {
    return `${sizeInGB.toFixed(2)} GB`
  }

  const sizeInTB = sizeInGB / 1024
  return `${sizeInTB.toFixed(2)} TB`
}
