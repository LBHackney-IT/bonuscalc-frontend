/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Overtime page', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/operatives/123456/timesheets/2021-10-18/overtime')

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

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-10-18',
          },
          { statusCode: 404, fixture: 'timesheets/not_found.json' }
        ).as('get_timesheet')

        cy.visit('/operatives/123456/timesheets/2021-10-18/overtime')
        cy.wait(['@get_operative', '@get_timesheet'])
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

        cy.visit('/operatives/123456/timesheets/2021-10-18/overtime')
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
            cy.get(':nth-child(4)').contains('Reactive')
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

      it('Shows the overtime tab', () => {
        cy.get('.govuk-tabs__list-item--selected').contains('Overtime')
      })

      it('Shows the week heading', () => {
        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').within(() => {
            cy.contains('Period 3 – 2021 / week 12')
            cy.get('.lbh-caption').contains('(18 – 24 Oct)')
          })
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
            .contains('a', 'Period 3 – 2021 / week 11')
            .click()
        })

        cy.wait('@get_timesheet')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 3 – 2021 / week 11')
          cy.location().should((loc) => {
            expect(loc.pathname).to.eq(
              '/operatives/123456/timesheets/2021-10-11/overtime'
            )
          })
        })
      })

      it('Hides the previous link when on the first week', () => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2021-08-02',
          },
          { statusCode: 200, fixture: 'timesheets/2021-08-02.json' }
        ).as('get_timesheet')

        cy.visit('/operatives/123456/timesheets/2021-08-02/overtime')

        cy.wait('@get_timesheet')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 3 – 2021 / week 1')

          cy.get('.lbh-simple-pagination').within(() => {
            cy.contains('a', 'Period 2 – 2021 / week 13').should('not.exist')
            cy.contains('a', 'Period 3 – 2021 / week 2').should('exist')
          })
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
            .contains('a', 'Period 3 – 2021 / week 13')
            .click()
        })

        cy.wait('@get_timesheet')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 3 – 2021 / week 13')
          cy.location().should((loc) => {
            expect(loc.pathname).to.eq(
              '/operatives/123456/timesheets/2021-10-25/overtime'
            )
          })
        })
      })

      it('Hides the next link when on the last week', () => {
        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/timesheet?week=2022-01-24',
          },
          { statusCode: 200, fixture: 'timesheets/2022-01-24.json' }
        ).as('get_timesheet')

        cy.visit('/operatives/123456/timesheets/2022-01-24/overtime')

        cy.wait('@get_timesheet')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 4 – 2021 / week 13')

          cy.get('.lbh-simple-pagination').within(() => {
            cy.contains('a', 'Period 4 – 2021 / week 12').should('exist')
            cy.contains('a', 'Period 1 – 2022 / week 1').should('not.exist')
          })
        })
      })
    })
  })
})