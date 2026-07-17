import {
  describeElement,
  feedbackMarkdown,
  findFeedbackElement,
  selectorFor
} from '../feedback-dom'

describe('feedback DOM utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('prefers a stable id when available', () => {
    document.body.innerHTML =
      '<main><button id="save-button">Save</button></main>'
    const button = document.querySelector('button')!

    expect(selectorFor(button)).toBe('#save-button')
    expect(findFeedbackElement(selectorFor(button))).toBe(button)
  })

  it('creates a resolvable structural selector without an id', () => {
    document.body.innerHTML =
      '<main><section><button>First</button><button>Second</button></section></main>'
    const button = document.querySelectorAll('button')[1]
    const selector = selectorFor(button)

    expect(selector).toContain('button:nth-of-type(2)')
    expect(findFeedbackElement(selector)).toBe(button)
  })

  it('uses the element text once in the human label', () => {
    document.body.innerHTML = '<div>1 app · 3D Slicer</div>'
    expect(describeElement(document.querySelector('div')!)).toBe(
      'div “1 app · 3D Slicer”'
    )
  })

  it('keeps the CSS selector and relative position in the export', () => {
    const markdown = feedbackMarkdown(
      'Feedback',
      [
        {
          id: 'one',
          path: '/apps',
          sel: '#content > button',
          ox: 0.25,
          oy: 0.75,
          label: 'button “Save”',
          text: 'Make this clearer'
        }
      ],
      { path: '/apps' }
    )

    expect(markdown).toContain('Page: /apps')
    expect(markdown).toContain('CSS: `#content > button`')
    expect(markdown).toContain('Position: 25%, 75%')
  })
})
