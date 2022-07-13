/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Viewing operative projections', () => {
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

  context('When logged in as a week manager', () => {
    beforeEach(() => {
      cy.login('a.week_manager')
    })

    it('They can view the operative projections', () => {
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
          path: '/api/v1/band-changes/projected',
        },
        { statusCode: 200, fixture: 'changes/projected.json' }
      ).as('get_projected')

      cy.visit('/manage/bands')
      cy.wait(['@get_period', '@get_projected'])

      cy.get('.bc-projections').within(() => {
        cy.contains('h1', 'Band change')
        cy.contains('h1', '(Period 1 – 2022)')

        cy.get('.lbh-page-announcement').within(() => {
          cy.contains('h3', 'Band changes cannot be approved or rejected')
        })

        cy.get('.govuk-tabs__list-item:nth-of-type(1)').within(() => {
          cy.contains('a', 'Bonus band (10)')
        })

        cy.get('.govuk-tabs__list-item:nth-of-type(2)').within(() => {
          cy.contains('a', 'Fixed band (2)')
        })

        cy.get('.govuk-tabs__panel:nth-of-type(1)').within(() => {
          cy.get('thead').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.get(':nth-child(1)').contains('Operative')
              cy.get(':nth-child(2)').contains('Payroll no.')
              cy.get(':nth-child(3)').contains('Trade')
              cy.get(':nth-child(4)').contains('Sick hours')
              cy.get(':nth-child(5)').contains('Total SMVh')
              cy.get(':nth-child(6)').within(() => {
                cy.get('button:nth-of-type(1)').contains('Band')
                cy.get('button:nth-of-type(2)').contains('Proj.')
              })
            })
          })

          cy.get('tbody').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.get(':nth-child(1)')
                .contains('a', 'Danelle McClure')
                .should(
                  'have.attr',
                  'href',
                  '/operatives/900019/summaries/2022-01-31'
                )
              cy.get(':nth-child(2)')
                .contains('a', '900019')
                .should(
                  'have.attr',
                  'href',
                  '/operatives/900019/summaries/2022-01-31'
                )
              cy.get(':nth-child(3)')
                .contains('abbr', 'LB')
                .should('have.attr', 'title', 'Labourer')
              cy.get(':nth-child(4)')
                .contains('span', '0.00')
                .should('not.have.attr', 'class', 'sick-warning')
              cy.get(':nth-child(5)').contains('0.00')
              cy.get(':nth-child(6)').within(() => {
                cy.contains('span:nth-of-type(1)', '9')
                cy.contains('span:nth-of-type(3)', '1').should(
                  'not.have.attr',
                  'class',
                  'sick-warning'
                )
              })
            })
          })

          cy.get('tbody').within(() => {
            cy.get('tr:nth-child(3)').within(() => {
              cy.get(':nth-child(1)')
                .contains('a', 'Harry Mosciski')
                .should(
                  'have.attr',
                  'href',
                  '/operatives/900041/summaries/2022-01-31'
                )
              cy.get(':nth-child(2)')
                .contains('a', '900041')
                .should(
                  'have.attr',
                  'href',
                  '/operatives/900041/summaries/2022-01-31'
                )
              cy.get(':nth-child(3)')
                .contains('abbr', 'GE')
                .should('have.attr', 'title', 'Gas Engineer')
              cy.get(':nth-child(4)')
                .contains('span', '36.00')
                .should('have.attr', 'class', 'sick-warning')
              cy.get(':nth-child(5)').contains('64.80')
              cy.get(':nth-child(6)').within(() => {
                cy.contains('span:nth-of-type(1)', '6')
                cy.contains('span:nth-of-type(3)', '1').should(
                  'have.attr',
                  'class',
                  'sick-warning'
                )
              })
            })
          })
        })
      })

      cy.get('input#search').type('Milton Green')

      cy.get('.bc-projections').within(() => {
        cy.get('.govuk-tabs__list-item:nth-of-type(1)').within(() => {
          cy.contains('a', 'Bonus band (1)')
        })

        cy.get('.govuk-tabs__list-item:nth-of-type(2)').within(() => {
          cy.contains('a', 'Fixed band (0)')
        })

        cy.get('.govuk-tabs__panel:nth-of-type(1)').within(() => {
          cy.get('tbody').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.get(':nth-child(1)')
                .contains('a', 'Milton Green')
                .should(
                  'have.attr',
                  'href',
                  '/operatives/900071/summaries/2022-01-31'
                )
              cy.get(':nth-child(2)')
                .contains('a', '900071')
                .should(
                  'have.attr',
                  'href',
                  '/operatives/900071/summaries/2022-01-31'
                )
              cy.get(':nth-child(3)')
                .contains('abbr', 'GE')
                .should('have.attr', 'title', 'Gas Engineer')
              cy.get(':nth-child(4)')
                .contains('span', '0.00')
                .should('not.have.attr', 'class', 'sick-warning')
              cy.get(':nth-child(5)').contains('0.00')
              cy.get(':nth-child(6)').within(() => {
                cy.contains('span:nth-of-type(1)', '9')
                cy.contains('span:nth-of-type(3)', '1').should(
                  'not.have.attr',
                  'class',
                  'sick-warning'
                )
              })
            })
          })
        })
      })

      cy.audit()
    })
  })
})
