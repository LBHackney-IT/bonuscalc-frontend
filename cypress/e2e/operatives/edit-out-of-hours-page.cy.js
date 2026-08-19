/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Out of hours page', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/operatives/123456/timesheets/2021-10-18/out-of-hours/edit')

      cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      
    })
  })

  context('When logged in', () => {
    beforeEach(() => {
      cy.login()
    })

    context('And the operative does not exist', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/v1/operatives/123456' },
          { statusCode: 404, fixture: 'operatives/not_found.json' }
        ).as('get_operative')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-18',
          },
          { statusCode: 404, fixture: 'timesheets/not_found.json' }
        ).as('get_timesheet')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/pay/types',
          },
          { statusCode: 200, fixture: 'pay/types.json' }
        ).as('get_pay_types')

        cy.visit('/operatives/123456/timesheets/2021-10-18/out-of-hours/edit')
        cy.wait(['@get_operative', '@get_timesheet', '@get_pay_types'])
      })

      it('Shows the not found message', () => {
        cy.get('.lbh-main-wrapper').contains('a', 'Back')
        cy.get('.lbh-heading-h1').contains('Not Found')
        cy.get('.lbh-body').contains(
          'Couldn’t find an operative with the payroll number 123456.'
        )

        
      })
    })

    context('And the operative is archived', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/v1/operatives/123456' },
          { statusCode: 200, fixture: 'operatives/archived.json' }
        ).as('get_operative')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-18',
          },
          { statusCode: 200, fixture: 'timesheets/2021-10-18.json' }
        ).as('get_timesheet')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/pay/types',
          },
          { statusCode: 200, fixture: 'pay/types.json' }
        ).as('get_pay_types')

        cy.visit('/operatives/123456/timesheets/2021-10-18/out-of-hours/edit')
        cy.wait(['@get_operative', '@get_timesheet', '@get_pay_types'])
      })

      it('Shows the access denied message', () => {
        cy.get('.lbh-main-wrapper').contains('a', 'Back')
        cy.get('.lbh-heading-h1').contains('Access Denied')
        cy.get('.lbh-body').contains(
          'Sorry, Alex Cable has been archived and is no longer editable.'
        )

        
      })
    })

    context('And the operative exists', () => {
      beforeEach(() => {
        cy.intercept(
          { method: 'GET', path: '/api/v1/operatives/123456' },
          { statusCode: 200, fixture: 'operatives/electrician.json' }
        ).as('get_operative')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-18',
          },
          { statusCode: 200, fixture: 'timesheets/2021-10-18.json' }
        ).as('get_timesheet')

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/pay/types',
          },
          { statusCode: 200, fixture: 'pay/types.json' }
        ).as('get_pay_types')

        cy.visit('/operatives/123456/timesheets/2021-10-18/out-of-hours/edit')
        cy.wait(['@get_operative', '@get_timesheet', '@get_pay_types'])
      })

      it('Shows the header', () => {
        cy.get('.lbh-heading-h2').within(() => {
          cy.contains('Alex Cable')
          cy.contains('Edit out of hours')
        })

        cy.get('.lbh-heading-h3').within(() => {
          cy.contains('Period 3 – 2021 / week 12')
          cy.contains('(18 – 24 Oct)')
        })

        
      })

      it('Can update the out of hours rota', () => {
        cy.intercept(
          {
            method: 'POST',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-18',
          },
          { statusCode: 200, body: {} }
        ).as('update_timesheet')

        cy.contains("Confirm").click()

        cy.wait('@update_timesheet')

        cy.location().should((loc) => {
          expect(loc.pathname).to.eq(
            '/operatives/123456/timesheets/2021-10-18/out-of-hours'
          )
        })

        cy.get('.lbh-page-announcement').within(() => {
          cy.contains('Updated out of hours successfully')
        })

        // Navigate to another page to check announcement is removed
        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-25',
          },
          { statusCode: 200, fixture: 'timesheets/2021-10-25.json' }
        ).as('get_next_week')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-simple-pagination')
            .contains('a', 'Period 3 – 2021 / week 13')
            .click()
        })

        cy.wait('@get_next_week')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 3 – 2021 / week 13')
          cy.location().should((loc) => {
            expect(loc.pathname).to.eq(
              '/operatives/123456/timesheets/2021-10-25/out-of-hours'
            )
          })
        })

        cy.get('.lbh-page-announcement').should('not.exist')
      })
    })
  })
})
