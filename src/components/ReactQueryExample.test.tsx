import { render, screen, waitFor } from '@/test/test-utils'
import ReactQueryExample from './ReactQueryExample'
import { server } from '@/mocks/server'
import { HttpResponse, http } from 'msw'
import { afterEach, beforeAll, afterAll } from '@jest/globals'

// Setup MSW
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('<ReactQueryExample/>', () => {
  it('Renders the loading screen', () => {
    render(<ReactQueryExample />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('Renders data from the handler', async () => {
    render(<ReactQueryExample />)
    await waitFor(() => {
      expect(screen.getByText('Hello from the handler!')).toBeInTheDocument()
    })
  })

  it('Renders data from overridden handler', async () => {
    server.use(
      http.get('/api/message', () =>
        HttpResponse.json({ message: 'Hello from the overridden handler!' }),
      ),
    )

    render(<ReactQueryExample />)
    await waitFor(() => {
      expect(
        screen.getByText('Hello from the overridden handler!'),
      ).toBeInTheDocument()
    })
  })
})
