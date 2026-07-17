import type { FeedbackComment } from '@/domain/model'

export function createFeedbackId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `feedback-${Date.now()}`
}

function escapeCss(value: string): string {
  if (globalThis.CSS?.escape) return globalThis.CSS.escape(value)
  return value.replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`)
}

export function selectorFor(element: Element): string {
  if (element.id) return `#${escapeCss(element.id)}`

  const parts: string[] = []
  let current: Element | null = element

  while (current && current !== document.body) {
    let part = current.tagName.toLowerCase()
    const parent: Element | null = current.parentElement

    if (parent) {
      const sameTagSiblings = Array.from(parent.children).filter(
        (sibling) => sibling.tagName === current?.tagName
      )
      if (sameTagSiblings.length > 1) {
        part += `:nth-of-type(${sameTagSiblings.indexOf(current) + 1})`
      }
    }

    parts.unshift(part)
    current = parent
  }

  return parts.join(' > ')
}

export function findFeedbackElement(selector: string): Element | null {
  try {
    return document.querySelector(selector)
  } catch {
    return null
  }
}

export function describeElement(element: Element): string {
  const tag = element.tagName.toLowerCase()
  const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim()
  const conciseText = text.length > 70 ? `${text.slice(0, 67)}…` : text
  return conciseText ? `${tag} “${conciseText}”` : tag
}

export function feedbackMarkdown(
  title: string,
  comments: FeedbackComment[],
  metadata: Record<string, string>
): string {
  const lines = [`# ${title}`, '']

  for (const [key, value] of Object.entries(metadata)) {
    lines.push(`- ${key}: ${value}`)
  }

  comments.forEach((comment, index) => {
    lines.push(
      '',
      `## ${index + 1}. ${comment.label}`,
      '',
      comment.text,
      '',
      `Page: ${comment.path ?? metadata.path ?? 'unknown'}`,
      `CSS: \`${comment.sel}\``,
      `Position: ${Math.round(comment.ox * 100)}%, ${Math.round(comment.oy * 100)}%`
    )
  })

  return lines.join('\n')
}
