/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Creating a bonus period', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/manage/periods')

      cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      
    })
  })

  context('When logged in as an operative manager', () => {
    beforeEach(() => {
      cy.login('an.operative_manager')
    })

    it('Does not show the manage bonus periods link', () => {
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

      cy.visit('/manage/weeks')
      cy.wait([
        '@get_periods',
        '@get_week_12',
        '@get_week_13',
        '@get_period',
        '@get_band_changes',
        '@get_authorisations',
      ])

      cy.get('.govuk-grid-column-one-fifth').within(() => {
        cy.get('.lbh-list').within(() => {
          cy.contains('a', 'Bonus periods').should('not.exist')
        })
      })

      
    })
  })

  context('When logged in as an authorisations manager', () => {
    beforeEach(() => {
      cy.login('an.authorisations_manager')
    })

    it('Does not show the manage bonus periods link', () => {
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

      cy.visit('/manage/weeks')
      cy.wait([
        '@get_periods',
        '@get_week_12',
        '@get_week_13',
        '@get_period',
        '@get_band_changes',
        '@get_authorisations',
      ])

      cy.get('.govuk-grid-column-one-fifth').within(() => {
        cy.get('.lbh-list').within(() => {
          cy.contains('a', 'Bonus periods').should('not.exist')
        })
      })

      
    })
  })

  context('When logged in as a week manager', () => {
    beforeEach(() => {
      cy.login('a.week_manager')
    })

    it('Shows the manage bonus periods link', () => {
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

      cy.visit('/manage/weeks')
      cy.wait([
        '@get_periods',
        '@get_week_12',
        '@get_week_13',
        '@get_period',
        '@get_band_changes',
        '@get_authorisations',
      ])

      cy.get('.govuk-grid-column-one-fifth').within(() => {
        cy.get('.lbh-list').within(() => {
          cy.contains('a', 'Bonus periods').should('exist')
          cy.contains('a', 'Bonus periods').should(
            'have.attr',
            'href',
            '/manage/periods'
          )
        })
      })

      
    })

    it('They can create a bonus period', () => {
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
          method: 'POST',
          path: '/api/v1/periods',
        },
        { statusCode: 200, fixture: 'periods/create.json' }
      ).as('create_period')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/periods',
        },
        { statusCode: 200, fixture: 'periods/updated.json' }
      ).as('get_updated_periods')

      cy.contains('button', 'Create Period').click()

      cy.wait(['@create_period', '@get_updated_periods'])

      cy.get('@create_period').its('request.body').should('deep.equal', {
        id: '2022-01-31',
      })

      cy.get('.bc-bonus-periods table').within(() => {
        cy.get('tbody > tr:nth-child(3)').within(() => {
          cy.get(':nth-child(1)').contains('Period 1 – 2022')
          cy.get(':nth-child(1) a').should('not.exist')
          cy.get(':nth-child(2)').contains('31 Jan – 1 May')
          cy.get(':nth-child(3)').contains('–')
          cy.get(':nth-child(4)').contains('–')
          cy.get(':nth-child(4) a').should('not.exist')
        })
      })

      cy.get('.bc-bonus-periods button').should('be.disabled')
    })
  })
})
