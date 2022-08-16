/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Closing a bonus period', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/manage/periods/close')

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

      cy.visit('/manage/periods/close')
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

      cy.visit('/manage/periods/close')
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

    it('They can close the period', () => {
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
        { statusCode: 200, fixture: 'changes/pending.json' }
      ).as('get_band_changes')

      cy.visit('/manage/periods/close')
      cy.wait(['@get_period', '@get_band_changes'])

      cy.get('.bc-close-period__summary').within(() => {
        cy.get('h1').contains('Close period and send reports')
        cy.get('p').contains('Summary for Period 1 – 2022')
        cy.get('dl').within(() => {
          cy.get('div:nth-of-type(1)').within(() => {
            cy.get('dt').contains('Total number of operatives')
            cy.get('dd').contains('1')
          })
        })
      })

      cy.intercept(
        {
          method: 'POST',
          path: '/api/reports/operatives/123456/band-change',
        },
        { statusCode: 200, body: {} }
      ).as('email_123456_report')

      cy.intercept(
        {
          method: 'POST',
          path: '/api/v1/band-changes/123456/report',
        },
        { statusCode: 200, body: {} }
      ).as('post_123456_report')

      cy.intercept(
        {
          method: 'POST',
          path: '/api/v1/periods/2022-01-31',
        },
        { statusCode: 200, body: {} }
      ).as('post_period')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/periods/current',
        },
        { statusCode: 200, fixture: 'periods/current-after-closing.json' }
      ).as('get_periods')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/weeks/2022-05-02',
        },
        { statusCode: 200, fixture: 'weeks/2022-05-02.json' }
      ).as('get_week_1')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/band-changes/authorisations',
        },
        { statusCode: 200, body: [] }
      ).as('get_authorisations')

      cy.get('.bc-close-period').within(() => {
        cy.contains('button', 'Close and send reports').click()
      })

      cy.wait(['@email_123456_report', '@post_123456_report', '@post_period'])
      cy.wait(['@get_periods', '@get_week_1', '@get_authorisations'])

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/manage/weeks')
      })

      cy.get('.lbh-page-announcement').within(() => {
        cy.contains(
          'Period 1 – 2022 is successfully closed – summary reports have been sent'
        )
      })

      cy.get('.bc-open-weeks__period:nth-of-type(1)').within(() => {
        cy.get('header').within(() => {
          cy.contains('h2', 'Period 2 – 2022')
        })

        cy.get('.bc-open-weeks__week:nth-of-type(1)').within(() => {
          cy.get('header').within(() => {
            cy.contains('h3', 'Period 2 – 2022 / week 1')
          })
        })
      })

      // Navigate to another page to check announcement is removed
      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/pay/bands',
        },
        { statusCode: 200, fixture: 'pay/bands.json' }
      ).as('get_pay_bands')

      cy.contains('a', 'View all operatives').click()

      cy.wait(['@get_pay_bands'])

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/manage/weeks/2022-05-02/operatives')
      })

      cy.get('.bc-all-operatives').within(() => {
        cy.contains('h1', 'Period 2 – 2022 / week 1')
        cy.contains('p', 'All operatives')

        cy.get('tbody tr:nth-child(1)').contains('td:first-child', 'Alex Cable')
        cy.get('tbody tr:nth-child(2)').should('not.exist')
      })

      cy.get('.lbh-page-announcement').should('not.exist')

      cy.audit()
    })
  })
})
