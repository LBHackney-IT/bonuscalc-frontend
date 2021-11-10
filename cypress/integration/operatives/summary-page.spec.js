/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Summary page', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/operatives/123456/summaries/2021-08-02')

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
            path: '/api/v1/operatives/123456/summary?bonusPeriod=2021-08-02',
          },
          { statusCode: 404, fixture: 'summaries/not_found.json' }
        ).as('get_summary')

        cy.visit('/operatives/123456/summaries/2021-08-02')
        cy.wait(['@get_operative', '@get_summary'])
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
            path: '/api/v1/operatives/123456/summary?bonusPeriod=2021-08-02',
          },
          { statusCode: 200, fixture: 'summaries/2021-08-02.json' }
        ).as('get_summary')

        cy.visit('/operatives/123456/summaries/2021-08-02')
        cy.wait(['@get_operative', '@get_summary'])
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

      it('Shows the summary tab', () => {
        cy.get('.govuk-tabs__list-item--selected').contains('Summary')
      })

      it('Shows the bonus period heading', () => {
        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').within(() => {
            cy.contains('Period 3 – 2021')
            cy.get('.lbh-caption').contains('(2 Aug – 31 Oct)')
          })
        })
      })

      it('Allows navigating between bonus periods', () => {
        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 3 – 2021')

          cy.get('.lbh-simple-pagination').within(() => {
            cy.contains('a', 'Period 2 – 2021').should('not.exist')
            cy.contains('a', 'Period 4 – 2021').should('exist')
          })
        })

        cy.intercept(
          {
            method: 'GET',
            path: '/api/v1/operatives/123456/summary?bonusPeriod=2021-11-01',
          },
          { statusCode: 200, fixture: 'summaries/2021-11-01.json' }
        ).as('get_summary')

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-simple-pagination')
            .contains('a', 'Period 4 – 2021')
            .click()
        })

        cy.wait('@get_summary')

        cy.location().should((loc) => {
          expect(loc.pathname).to.eq('/operatives/123456/summaries/2021-11-01')
        })

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 4 – 2021')

          cy.get('.lbh-simple-pagination').within(() => {
            cy.contains('a', 'Period 3 – 2021').should('exist')
            cy.contains('a', 'Period 1 – 2022').should('not.exist')
          })
        })

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-simple-pagination')
            .contains('a', 'Period 3 – 2021')
            .click()
        })

        cy.get('.govuk-tabs__panel').within(() => {
          cy.get('.lbh-heading-h3').contains('Period 3 – 2021')

          cy.get('.lbh-simple-pagination').within(() => {
            cy.contains('a', 'Period 2 – 2021').should('not.exist')
            cy.contains('a', 'Period 4 – 2021').should('exist')
          })
        })
      })

      it('Shows the summary for the bonus period', () => {
        cy.get('#weekly-summary thead').within(() => {
          cy.get('.govuk-table__row:nth-child(1)').within(() => {
            cy.get(':nth-child(1)').contains('Week')
            cy.get(':nth-child(2)').contains('SMVh (P)')
            cy.get(':nth-child(3)').contains('Hours (NP)')
            cy.get(':nth-child(4)').contains('SMVh (NP)')
            cy.get(':nth-child(5)').contains('Total SMVh')
            cy.get(':nth-child(6)').contains('Band Projected')
          })
        })

        cy.get('#weekly-summary tbody').within(() => {
          cy.get('.govuk-table__row:nth-child(1)').within(() => {
            cy.get(':nth-child(1)').contains('1 02/08/2021')
            cy.get(':nth-child(2)').contains('43.67')
            cy.get(':nth-child(3)').contains('14.25')
            cy.get(':nth-child(4)').contains('24.23')
            cy.get(':nth-child(5)').contains('67.90')
            cy.get(':nth-child(6)').contains('7 7')
          })

          cy.get('.govuk-table__row:nth-child(6)').within(() => {
            cy.get(':nth-child(1)').contains('6 06/09/2021')
            cy.get(':nth-child(2)').contains('114.00')
            cy.get(':nth-child(3)').contains('7.25')
            cy.get(':nth-child(4)').contains('12.33')
            cy.get(':nth-child(5)').contains('126.33')
            cy.get(':nth-child(6)').contains('9 3')
          })

          cy.get('.govuk-table__row:nth-child(13)').within(() => {
            cy.get(':nth-child(1)').contains('13 25/10/2021')
            cy.get(':nth-child(2)').contains('93.77')
            cy.get(':nth-child(3)').contains('28.75')
            cy.get(':nth-child(4)').contains('47.21')
            cy.get(':nth-child(5)').contains('140.98')
            cy.get(':nth-child(6)').contains('9 2')
          })
        })

        cy.get('#weekly-summary tfoot').within(() => {
          cy.get('.govuk-table__row:nth-child(1)').within(() => {
            cy.get(':nth-child(1)').contains('Totals')
            cy.get(':nth-child(2)').contains('399.99')
            cy.get(':nth-child(3)').contains('158.75')
            cy.get(':nth-child(4)').contains('268.26')
            cy.get(':nth-child(5)').contains('668.25')
            cy.get(':nth-child(6)').contains('5→2')
          })
        })
      })
    })
  })
})
