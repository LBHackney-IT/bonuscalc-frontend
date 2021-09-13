import { render } from '@testing-library/react'
import Header from '../Header'
import UserContext from '../UserContext'
import { operativeManager } from 'factories/operative_manager'

describe('Header', () => {
  const serviceName = 'DLO Bonus Scheme'

  describe('When user is signed in', () => {
    it('should render header content for agents', () => {
      const { getByText } = render(
        <UserContext.Provider
          value={{
            user: operativeManager,
          }}
        >
          <Header serviceName={serviceName} />
        </UserContext.Provider>
      )

      expect(getByText(serviceName)).toBeInTheDocument()
      expect(getByText(operativeManager.name)).toBeInTheDocument()
      expect(getByText('Sign out')).toBeInTheDocument()
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
      expect(queryByText(operativeManager.name)).not.toBeInTheDocument()
      expect(queryByText('Sign out')).not.toBeInTheDocument()
    })
  })
})
