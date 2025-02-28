/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Starting the band change process', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/manage/bands')

      cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      cy.audit()
    })
  })

  context('When logged in as an operative manager', () => {
    beforeEach(() => {
      cy.login('an.operative_manager')
    })

    it('Shows the holding message', () => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/period',
        },
        { statusCode: 200, fixture: 'changes/period-pending.json' }
      ).as('get_period')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes',
        },
        { statusCode: 200, fixture: 'changes/empty.json' }
      ).as('get_band_changes')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/authorisations',
        },
        { statusCode: 200, body: [] }
      ).as('get_authorisations')

      cy.visit('/manage/bands')
      cy.wait(['@get_period', '@get_band_changes', '@get_authorisations'])

      cy.get('.bc-band-changes').within(() => {
        cy.contains('h1', 'Band change')
        cy.contains('h1', '(Period 1 – 2022)')

        cy.contains(
          'p',
          'All the weeks are closed – waiting for the bonus scheme manager to start the band change process.'
        )

        cy.contains('button', 'Start').should('not.exist')
      })

      cy.audit()
    })
  })

  context('When logged in as a week manager', () => {
    beforeEach(() => {
      cy.login('a.week_manager')
    })

    it('They can start the band change process', () => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/period',
        },
        { statusCode: 200, fixture: 'changes/period-pending.json' }
      ).as('get_period')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes',
        },
        { statusCode: 200, fixture: 'changes/empty.json' }
      ).as('get_band_changes')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/authorisations',
        },
        { statusCode: 200, body: [] }
      ).as('get_authorisations')

      cy.visit('/manage/bands')
      cy.wait(['@get_period', '@get_band_changes', '@get_authorisations'])

      cy.get('.bc-band-changes').within(() => {
        cy.contains('h1', 'Band change')
        cy.contains('h1', '(Period 1 – 2022)')

        cy.contains(
          'p',
          'All the weeks are closed – click ‘Start’ to begin approving/rejecting band changes.'
        )

        cy.contains('button', 'Start').should('exist')

        cy.intercept(
          {
            method: 'POST',
            path: '/api/v1/band-changes/start',
          },
          { statusCode: 200, body: {} }
        ).as('post_start')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/band-changes/period',
          },
          { statusCode: 200, fixture: 'changes/period-pending.json' }
        ).as('get_period')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/band-changes/authorisations',
          },
          { statusCode: 200, body: [] }
        ).as('get_authorisations')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/band-changes',
          },
          { statusCode: 200, fixture: 'changes/changes.json' }
        ).as('get_band_changes')

        cy.get('button').click()
        cy.wait([
          '@post_start',
          '@get_period',
          '@get_authorisations',
          '@get_band_changes',
        ])
      })

      cy.get('.bc-band-changes').within(() => {
        cy.contains('h1', 'Band change')
        cy.contains('h1', '(Period 1 – 2022)')
        cy.contains('h2', 'My operatives')
        cy.contains('#tab_bonus-band', 'Bonus band (0)')
        cy.contains('#tab_fixed-band', 'Fixed band (0)')

        cy.get('.bc-band-changes__search').within(() => {
          cy.get('div:first-child button').click()
        })

        cy.contains('h2', 'All operatives')
        cy.contains('#tab_bonus-band', 'Bonus band (1)')
        cy.contains('#tab_fixed-band', 'Fixed band (1)')

        cy.contains('#tab_bonus-band', 'Bonus band (1)').click()

        cy.get('#bonus-band').within(() => {
          cy.get('thead').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.contains('th:nth-child(2)', 'Operative')
              cy.contains('th:nth-child(3)', 'Payroll no.')
              cy.contains('th:nth-child(4)', 'Trade')
              cy.contains('th:nth-child(5)', 'Sick')
              cy.contains('th:nth-child(6)', 'Total')
              cy.contains('th:nth-child(7) button:first-child', 'Band')
              cy.contains('th:nth-child(7) button:last-child', 'Proj.')
              cy.contains('th:nth-child(8)', 'Change')
            })
          })

          cy.get('tbody:nth-of-type(1)').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.contains('td:nth-child(2)', 'Alex Cable')
              cy.contains('td:nth-child(3)', '123456')
              cy.contains('td:nth-child(4)', 'EL')
              cy.contains('td:nth-child(5)', '72.00')
              cy.contains('td:nth-child(6)', '0.00')
              cy.contains('td:nth-child(7) span:first-child', '5')
              cy.contains('td:nth-child(7) span:last-child', '1')
              cy.contains('td:nth-child(8)', '–')
            })
          })
        })

        cy.contains('#tab_fixed-band', 'Fixed band (1)').click()

        cy.get('#fixed-band').within(() => {
          cy.get('thead').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.contains('th:nth-child(2)', 'Operative')
              cy.contains('th:nth-child(3)', 'Payroll no.')
              cy.contains('th:nth-child(4)', 'Trade')
              cy.contains('th:nth-child(5)', 'Sick')
              cy.contains('th:nth-child(6)', 'Total')
              cy.contains('th:nth-child(7) button:first-child', 'Band')
              cy.contains('th:nth-child(7) button:last-child', 'Proj.')
              cy.contains('th:nth-child(8)', 'Change')
            })
          })

          cy.get('tbody:nth-of-type(1)').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.contains('td:nth-child(2)', 'André Wood')
              cy.contains('td:nth-child(3)', '654321')
              cy.contains('td:nth-child(4)', 'CP')
              cy.contains('td:nth-child(5)', '72.00')
              cy.contains('td:nth-child(6)', '0.00')
              cy.contains('td:nth-child(7) span:first-child', '5')
              cy.contains('td:nth-child(7) span:last-child', '1')
              cy.contains('td:nth-child(8)', '–')
            })
          })
        })
      })

      cy.audit()
    })
  })
})
