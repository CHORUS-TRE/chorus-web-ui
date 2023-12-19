import { render, screen, within } from '@testing-library/react'
import Home from '../src/pages/index'

describe('Home', () => {
  it('heading', () => {
    render(<Home />)
    const main = within(screen.getByRole('main'))
    expect(main.getByRole('heading', { level: 1, name: /Welcome to My Frontend App/i })).toBeDefined()
  })
})
