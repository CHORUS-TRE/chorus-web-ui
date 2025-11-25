export const getGradient = (
  name: string,
  primary: string,
  secondary: string
) => {
  // Simple hash for angle
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const angle = Math.abs(hash % 360)

  return `linear-gradient(${angle}deg, ${primary}, ${secondary})`
}
