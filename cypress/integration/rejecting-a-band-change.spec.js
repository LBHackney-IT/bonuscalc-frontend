/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Rejecting a band change', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/manage/bands')

      cy.get('.lbh-header__service-name').contains('DLO Bonus Scheme')
      cy.get('.lbh-header__title-link').should('have.attr', 'href', '/')

      cy.get('.lbh-heading-h1').contains('Sign in')
      cy.get('.lbh-body').contains(
        'Please sign in with your Hackney email account.'
      )

      //cy.audit()
    })
  })

  context('When logged in as an operative manager', () => {
    beforeEach(() => {
      cy.login('an.operative_manager')
    })

    it('They can reject a band change', () => {
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

      cy.visit('/manage/bands')
      cy.wait(['@get_period', '@get_authorisations', '@get_band_changes'])

      cy.get('.bc-band-changes').within(() => {
        cy.contains('h1', 'Band change')
        cy.contains('h1', '(Period 1 – 2022)')

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

          cy.get('#operative_123456').check()
          cy.contains('h3', 'Selected: 1 operative')

          cy.get('#rejectBandChangeDecision').check()          
          cy.get('#bandChanges_0_salaryBand').clear()
          cy.get('#bandChanges_0_salaryBand').type('3')
          cy.get('#bandChanges_0_reason').type(
            'Protected from dropping below band 3'
          )

          cy.get('form').within(() => {
            cy.get('.lbh-page-announcement').within(() => {
              cy.contains('h3', 'Rejections have to be approved')
              cy.get('.lbh-page-announcement__content').contains(
                'Your request will now be sent to your manager for approval'
              )
            })
          })

          cy.intercept(
            {
              method: 'POST',
              path: '/api/v1/band-changes/123456/supervisor',
            },
            { statusCode: 200, body: {} }
          ).as('post_rejection')

          cy.intercept(
            {
              method: 'GET',
              path: '/api/v1/band-changes',
            },
            { statusCode: 200, fixture: 'changes/changes-rejected.json' }
          ).as('get_band_changes')

          cy.get('form > button').click()
          cy.wait(['@post_rejection', '@get_band_changes'])

          cy.get('@post_rejection').its('request.body').should('deep.equal', {
            id: '123456',
            name: 'An Operative Manager',
            emailAddress: 'an.operative_manager@hackney.gov.uk',
            decision: 'Rejected',
            reason: 'Protected from dropping below band 3',
            salaryBand: 3,
          })

          cy.get('.bc-band-changes__row--rejected').within(() => {
            cy.get('tr:nth-child(1)').within(() => {
              cy.contains('td:nth-child(8)', '(3)')
            })

            cy.get('tr:nth-child(2)').within(() => {
              cy.contains(
                'h3',
                'Rejected on 06/05/2022 by An Operative Manager, changed to: 3'
              )

              cy.contains(
                'p',
                'Reason for rejection: Protected from dropping below band 3'
              )
            })
          })
        })
      })

      cy.get('.lbh-page-announcement').within(() => {
        cy.contains('h3', 'Band change has been successfully rejected')
      })

      //cy.audit()
    })
  })
})
