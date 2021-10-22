/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Non-productive page', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/operatives/123456/timesheets/2021-10-18/non-productive')

      cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      cy.audit()
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

        cy.visit('/operatives/123456/timesheets/2021-10-18/non-productive')
        cy.wait('@get_operative')
      })

      it('Shows the not found message', () => {
        cy.get('.lbh-heading-h1').contains('Not Found')
        cy.get('.lbh-body').contains(
          'Couldn’t find an operative with the payroll number 123456.'
        )

        cy.audit()
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

        cy.visit('/operatives/123456/timesheets/2021-10-18/non-productive')
        cy.wait(['@get_operative', '@get_timesheet'])
      })

      it('Shows the operative summary', () => {
        cy.get('.lbh-heading-h2').within(() => {
          cy.contains('Alex Cable')
        })

        cy.get('.govuk-summary-list').within(() => {
          cy.get('.govuk-summary-list__row:nth-child(1)').within(() => {
            cy.get(':nth-child(1)').contains('Employee No')
            cy.get(':nth-child(2)').contains('123456')
            cy.get(':nth-child(3)').contains('Section / Team')
            cy.get(':nth-child(4)').contains('R3007')
          })

          cy.get('.govuk-summary-list__row:nth-child(2)').within(() => {
            cy.get(':nth-child(1)').contains('Trade')
            cy.get(':nth-child(2)').contains('Electrician (EL)')
            cy.get(':nth-child(3)').contains('Scheme')
            cy.get(':nth-child(4)').contains('SMV')
          })

          cy.get('.govuk-summary-list__row:nth-child(3)').within(() => {
            cy.get(':nth-child(1)').contains('Salary Band')
            cy.get(':nth-child(2)').contains('5')
            cy.get(':nth-child(3)').contains('Fixed Band')
            cy.get(':nth-child(4)').contains('No')
          })
        })

        cy.audit()
      })

      it('Shows the non-productive tab', () => {
        cy.get('.govuk-tabs__list-item--selected').contains(
          'Non-productive (NP)'
        )
      })

      it('Shows the week heading', () => {
        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 3 - 2021 / week 12')
        })
      })

      it('Allows navigating to the previous week', () => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-11',
          },
          { statusCode: 200, fixture: 'timesheets/2021-10-11.json' }
        ).as('get_timesheet')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-simple-pagination')
            .contains('a', 'Period 3 - 2021 / week 11')
            .click()
          cy.wait('@get_timesheet')

          cy.get('.lbh-heading-h3').contains('Period 3 - 2021 / week 11')
          cy.url().should(
            'include',
            '/operatives/123456/timesheets/2021-10-11/non-productive'
          )
        })
      })

      it('Allows navigating to the next week', () => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-25',
          },
          { statusCode: 200, fixture: 'timesheets/2021-10-25.json' }
        ).as('get_timesheet')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-simple-pagination')
            .contains('a', 'Period 3 - 2021 / week 13')
            .click()
          cy.wait('@get_timesheet')

          cy.get('.lbh-heading-h3').contains('Period 3 - 2021 / week 13')
          cy.url().should(
            'include',
            '/operatives/123456/timesheets/2021-10-25/non-productive'
          )
        })
      })

      it('Shows the summary of the pay elements for that week', () => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-18',
          },
          { statusCode: 200, fixture: 'timesheets/2021-10-18.json' }
        ).as('get_timesheet')

        cy.get('#non-productive-summary tbody').within(() => {
          cy.get('.govuk-table__row:nth-child(1)').within(() => {
            cy.get(':nth-child(1)').contains('Dayworks')
            cy.get(':nth-child(2)').contains('7.50')
            cy.get(':nth-child(3)').contains('11.63')
          })

          cy.get('.govuk-table__row:nth-child(2)').within(() => {
            cy.get(':nth-child(1)').contains('Annual Leave')
            cy.get(':nth-child(2)').contains('7.50')
            cy.get(':nth-child(3)').contains('11.63')
          })
        })

        cy.get('#adjustment-summary tbody').within(() => {
          cy.get('.govuk-table__row:nth-child(1)').within(() => {
            cy.get(':nth-child(1)').contains('10000001')
            cy.get(':nth-child(2)').contains('Note about adjustment')
            cy.get(':nth-child(4)').contains('24.00')
          })
        })

        cy.get('#adjustment-summary tfoot').within(() => {
          cy.get('.govuk-table__row:nth-child(1)').within(() => {
            cy.get(':nth-child(2)').contains('Total')
            cy.get(':nth-child(3)').contains('47.25')
          })
        })
      })

      it('Hides the edit non-productive time button if the week is closed', () => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-11',
          },
          { statusCode: 200, fixture: 'timesheets/2021-10-11.json' }
        ).as('get_timesheet')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.contains('button', 'Edit non-productive').should('exist')

          cy.get('.lbh-simple-pagination')
            .contains('a', 'Period 3 - 2021 / week 11')
            .click()
          cy.wait('@get_timesheet')

          cy.contains('button', 'Edit non-productive').should('not.exist')
        })
      })
    })
  })
})
