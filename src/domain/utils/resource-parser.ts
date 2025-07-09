const MEMORY_UNITS: { [key: string]: number } = {
  K: 1024,
  M: 1024 ** 2,
  G: 1024 ** 3,
  T: 1024 ** 4,
  P: 1024 ** 5,
  E: 1024 ** 6,
  Ki: 1024,
  Mi: 1024 ** 2,
  Gi: 1024 ** 3,
  Ti: 1024 ** 4,
  Pi: 1024 ** 5,
  Ei: 1024 ** 6
}

export function parseMemory(value: string): number {
  if (!value) return 0
  const unit = value.match(/[a-zA-Z]+/)
  const number = parseFloat(value)
  if (!unit || !(unit[0] in MEMORY_UNITS)) {
    return number
  }
  return number * MEMORY_UNITS[unit[0]]
}

export function parseCPU(value: string): number {
  if (!value) return 0
  if (value.endsWith('m')) {
    return parseFloat(value) / 1000
  }
  return parseFloat(value)
}
