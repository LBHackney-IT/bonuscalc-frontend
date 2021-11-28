import { render } from '@testing-library/react'
import Header from '../Header'
import UserContext from '../UserContext'
import { operativeManager } from 'factories/operative_manager'

describe('Header', () => {
  const serviceName = 'DLO Bonus Scheme'

  describe('When user is signed in', () => {
    it('should render header content for managers', () => {
      const { getByText, getByRole } = render(
        <UserContext.Provider
          value={{
            user: operativeManager,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(getByRole('link', { name: 'Search' })).toBeInTheDocument()
      expect(getByRole('link', { name: 'Sign out' })).toBeInTheDocument()
    })

    it('should not link Search when it is the current page', () => {
      const { getByText, queryByRole } = render(
        <UserContext.Provider
          value={{
            user: operativeManager,
          }}
        >
          <Header serviceName={serviceName} currentPage="search" />
        </UserContext.Provider>
      )

      expect(queryByRole('link', { name: 'Search' })).not.toBeInTheDocument()
      expect(getByText('Search')).toBeInTheDocument()
    })
  })

  describe('When user is not signed in', () => {
    it('should render service name without sign out link', () => {
      const { getByText, queryByText } = render(
        <UserContext.Provider
          value={{
            user: null,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(queryByText('Search')).not.toBeInTheDocument()
      expect(queryByText('Sign out')).not.toBeInTheDocument()
    })
  })
})
