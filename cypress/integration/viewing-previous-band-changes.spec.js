/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Viewing previous band changes', () => {
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

    it('Redirects to the default page', () => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/periods/current',
        },
        { statusCode: 200, fixture: 'periods/current.json' }
      ).as('get_periods')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/weeks/2021-10-18',
        },
        { statusCode: 200, fixture: 'weeks/2021-10-18.json' }
      ).as('get_week_12')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/weeks/2021-10-25',
        },
        { statusCode: 200, fixture: 'weeks/2021-10-25.json' }
      ).as('get_week_13')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/period',
        },
        { statusCode: 200, fixture: 'changes/period.json' }
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

      cy.visit('/manage/periods/2021-08-02')
      cy.wait([
        '@get_periods',
        '@get_week_12',
        '@get_week_13',
        '@get_period',
        '@get_band_changes',
        '@get_authorisations',
      ])

      cy.get('.bc-open-weeks').within(() => {
        cy.contains('h1', 'Open weeks')
      })

      cy.audit()
    })
  })

  context('When logged in as an authorisations manager', () => {
    beforeEach(() => {
      cy.login('an.authorisations_manager')
    })

    it('Redirects to the default page', () => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/periods/current',
        },
        { statusCode: 200, fixture: 'periods/current.json' }
      ).as('get_periods')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/weeks/2021-10-18',
        },
        { statusCode: 200, fixture: 'weeks/2021-10-18.json' }
      ).as('get_week_12')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/weeks/2021-10-25',
        },
        { statusCode: 200, fixture: 'weeks/2021-10-25.json' }
      ).as('get_week_13')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/period',
        },
        { statusCode: 200, fixture: 'changes/period.json' }
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

      cy.visit('/manage/periods/2021-08-02')
      cy.wait([
        '@get_periods',
        '@get_week_12',
        '@get_week_13',
        '@get_period',
        '@get_band_changes',
        '@get_authorisations',
      ])

      cy.get('.bc-open-weeks').within(() => {
        cy.contains('h1', 'Open weeks')
      })

      cy.audit()
    })
  })

  context('When logged in as a week manager', () => {
    beforeEach(() => {
      cy.login('a.week_manager')
    })

    it('They can view a previous bonus period', () => {
      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/periods',
        },
        { statusCode: 200, fixture: 'periods/all.json' }
      ).as('get_periods')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/authorisations',
        },
        { statusCode: 200, body: [] }
      ).as('get_authorisations')

      cy.visit('/manage/periods')
      cy.wait(['@get_periods', '@get_authorisations'])

      cy.get('.bc-bonus-periods table').within(() => {
        cy.get('thead > tr:nth-child(1)').within(() => {
          cy.get(':nth-child(1)').contains('Period')
          cy.get(':nth-child(2)').contains('Date')
          cy.get(':nth-child(3)').contains('Closed')
          cy.get(':nth-child(4)').contains('Payroll File')
        })

        cy.get('tbody > tr:nth-child(1)').within(() => {
          cy.get(':nth-child(1)')
            .contains('a', 'Period 3 – 2021')
            .should('have.attr', 'href', '/manage/periods/2021-08-02')
          cy.get(':nth-child(2)').contains('2 Aug – 31 Oct')
          cy.get(':nth-child(3)').contains('10 Nov 2021')
          cy.get(':nth-child(4)')
            .contains('a', 'Download')
            .should('have.attr', 'href', '/api/reports/periods/2021-08-02')
        })

        cy.get('tbody > tr:nth-child(2)').within(() => {
          cy.get(':nth-child(1)').contains('Period 4 – 2021')
          cy.get(':nth-child(1) a').should('not.exist')
          cy.get(':nth-child(2)').contains('1 Nov – 30 Jan')
          cy.get(':nth-child(3)').contains('–')
          cy.get(':nth-child(4)').contains('–')
          cy.get(':nth-child(4) a').should('not.exist')
        })
      })

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/periods/2021-08-02',
        },
        { statusCode: 200, fixture: 'periods/closed.json' }
      ).as('get_period')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes?date=2021-08-02',
        },
        { statusCode: 200, fixture: 'changes/closed.json' }
      ).as('get_band_changes')

      cy.contains('a', 'Period 3 – 2021').click()
      cy.wait(['@get_period', '@get_band_changes'])

      cy.get('.bc-band-changes--historical').within(() => {
        cy.contains('h1', 'Band change')
        cy.contains('h1', '(Period 3 – 2021)')
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
              cy.contains('th:nth-child(1)', 'Operative')
              cy.contains('th:nth-child(2)', 'Payroll no.')
              cy.contains('th:nth-child(3)', 'Trade')
              cy.contains('th:nth-child(4)', 'Sick')
              cy.contains('th:nth-child(5)', 'Total')
              cy.contains('th:nth-child(6) button:first-child', 'Band')
              cy.contains('th:nth-child(6) button:last-child', 'Proj.')
              cy.contains('th:nth-child(7)', 'Change')
            })
          })

          cy.get('tbody:nth-of-type(1)').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.contains('td:nth-child(1)', 'Alex Cable')
              cy.contains('td:nth-child(2)', '123456')
              cy.contains('td:nth-child(3)', 'EL')
              cy.contains('td:nth-child(4)', '72.00')
              cy.contains('td:nth-child(5)', '0.00')
              cy.contains('td:nth-child(6) span:first-child', '5')
              cy.contains('td:nth-child(6) span:last-child', '1')
              cy.contains('td:nth-child(7)', '1')
            })
          })
        })

        cy.contains('#tab_fixed-band', 'Fixed band (1)').click()

        cy.get('#fixed-band').within(() => {
          cy.get('thead').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.contains('th:nth-child(1)', 'Operative')
              cy.contains('th:nth-child(2)', 'Payroll no.')
              cy.contains('th:nth-child(3)', 'Trade')
              cy.contains('th:nth-child(4)', 'Sick')
              cy.contains('th:nth-child(5)', 'Total')
              cy.contains('th:nth-child(6) button:first-child', 'Band')
              cy.contains('th:nth-child(6) button:last-child', 'Proj.')
              cy.contains('th:nth-child(7)', 'Change')
            })
          })

          cy.get('tbody:nth-of-type(1)').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.contains('td:nth-child(1)', 'André Wood')
              cy.contains('td:nth-child(2)', '654321')
              cy.contains('td:nth-child(3)', 'CP')
              cy.contains('td:nth-child(4)', '72.00')
              cy.contains('td:nth-child(5)', '0.00')
              cy.contains('td:nth-child(6) span:first-child', '5')
              cy.contains('td:nth-child(6) span:last-child', '1')
              cy.contains('td:nth-child(7)', '5')
            })
          })
        })
      })
    })
  })
})
