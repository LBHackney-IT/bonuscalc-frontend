/// <reference types="cypress" />

describe('Signing out', () => {
  beforeEach(() => {
    cy.login()

    cy.visit('/search')
    cy.contains('h1', 'Find operatives or work orders')
  })

  it('Links to the logout route', () => {
    cy.get('header').within(() => {
      cy.contains('a', 'Sign out').should('have.attr', 'href', '/api/logout')
    })
  })

  it('Clears the session and redirects to Cognito to end that session', () => {
    cy.request({ url: '/api/logout', followRedirect: false }).then(
      (response) => {
        expect(response.status).to.eq(307)
        expect(response.redirectedToUrl).to.match(/\/logout\?client_id=/)
        expect(response.redirectedToUrl).to.contain(
          encodeURIComponent('/login')
        )
      }
    )

    cy.getCookies().should('be.empty')
  })
})

describe('The login page', () => {
  it('Asks people to sign in', () => {
    cy.visit('/login')

    cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
    cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

    cy.get('.lbh-heading-h1').contains('Sign in')
    cy.contains('button', 'Sign in with Google')
    cy.get('.lbh-body').contains(
      'Please sign in with your Hackney email account.'
    )
  })

  it('Redirects people who are not signed in', () => {
    cy.visit('/search')

    cy.location('pathname').should('eq', '/login')
  })
})
