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

const adjectives = [
  'brilliant',
  'curious',
  'determined',
  'elegant',
  'focused',
  'graceful',
  'humble',
  'innovative',
  'logical',
  'methodical',
  'noble',
  'precise',
  'rational',
  'systematic',
  'thoughtful'
]

const scientists = [
  'bell', // Jocelyn Bell Burnell - astrophysicist
  'bohr', // Niels Bohr - quantum physicist
  'curie', // Marie Curie - physicist and chemist
  'darwin', // Charles Darwin - naturalist and biologist
  'einstein', // Albert Einstein - theoretical physicist
  'faraday', // Michael Faraday - electromagnetic induction
  'feynman', // Richard Feynman - theoretical physicist
  'franklin', // Rosalind Franklin - DNA structure
  'hawking', // Stephen Hawking - theoretical physicist
  'heisenberg', // Werner Heisenberg - quantum mechanics pioneer
  'hopper', // Grace Hopper - computer scientist
  'johnson', // Katherine Johnson - NASA mathematician
  'lovelace', // Ada Lovelace - mathematician and first programmer
  'maxwell', // James Clerk Maxwell - electromagnetic theory
  'mcclintock', // Barbara McClintock - geneticist
  'meitner', // Lise Meitner - nuclear physicist
  'newton', // Isaac Newton - physicist and mathematician
  'noether', // Emmy Noether - mathematician
  'pascal', // Blaise Pascal - mathematician and physicist
  'planck', // Max Planck - quantum theory pioneer
  'rubin', // Vera Rubin - astronomer
  'tesla', // Nikola Tesla - inventor and electrical engineer
  'turing', // Alan Turing - computer scientist and mathematician
  'wu', // Chien-Shiung Wu - physicist
  'yalow' // Rosalyn Yalow - medical physicist
]

export function generateScientistName(separator: string = '-'): string {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomScientist =
    scientists[Math.floor(Math.random() * scientists.length)]

  return `${randomAdjective}${separator}${randomScientist}`
}
