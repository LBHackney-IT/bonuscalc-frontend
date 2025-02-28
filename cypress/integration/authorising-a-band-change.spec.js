/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Authorising a band change', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/manage/authorisations')

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

      cy.visit('/manage/authorisations')
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

      cy.visit('/manage/authorisations')
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

    it('Shows the authorisations count in the menu', () => {
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
        { statusCode: 200, fixture: 'changes/authorisations.json' }
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
          cy.contains('a', 'Authorisations (1)').should('exist')
          cy.contains('a', 'Authorisations (1)').should(
            'have.attr',
            'href',
            '/manage/authorisations'
          )
        })
      })

      cy.audit()
    })

    it('They can approve band changes', () => {
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
          path: '/api/v1/band-changes/authorisations',
        },
        { statusCode: 200, fixture: 'changes/authorisations.json' }
      ).as('get_authorisations')

      cy.visit('/manage/authorisations')
      cy.wait(['@get_period', '@get_authorisations'])

      cy.get('.bc-authorisations').within(() => {
        cy.contains('h1', 'Authorisations')
        cy.contains('h1', '(Period 1 – 2022)')
      })

      cy.get('.bc-authorisations__group:nth-of-type(1)').within(() => {
        cy.contains('h2', 'Supervisor: A Supervisor')

        cy.get('.bc-authorisations__operative:nth-of-type(1)').within(() => {
          cy.get('.bc-authorisations__operative--details').within(() => {
            cy.get(':nth-child(1) dt').contains('Alex Cable')
            cy.get(':nth-child(1) dt').contains('(123456)')
            cy.get(':nth-child(1) dd').contains('Current band: 5')

            cy.get(':nth-child(2) dt').contains('Sick hours')
            cy.get(':nth-child(2) dd.sick-warning').contains('72.00')

            cy.get(':nth-child(3) dt').contains('Projected band')
            cy.get(':nth-child(3) dd').contains('1')

            cy.get(':nth-child(4) dt').contains('Proposed band')
            cy.get(':nth-child(4) dd').contains('5')

            cy.get(':nth-child(5) dt').contains('Final band')
            cy.get(':nth-child(5) dd').contains('–')
          })

          cy.get('form').should('not.be.visible')
          cy.get('.bc-authorisations__operative--expand').click()
          cy.get('form').should('be.visible')

          cy.get('form').within(() => {
            cy.get('h3').contains(
              'Reason for a salary band different to the projected band:'
            )

            cy.get('p').contains(
              'Reason for keeping this operative at their current band'
            )

            cy.get('textarea[name=reason] + span').contains(
              'You can enter up to 300 characters'
            )

            cy.get('textarea[name=reason]').type('Because of reason')

            cy.get('textarea[name=reason] + span').contains(
              'You have 283 characters remaining'
            )

            cy.intercept(
              {
                method: 'POST',
                path: '/api/v1/band-changes/123456/manager',
              },
              { statusCode: 200, body: {} }
            ).as('post_approval')

            cy.intercept(
              {
                method: 'GET',
                path: '/api/v1/band-changes/authorisations',
              },
              { statusCode: 200, fixture: 'changes/approved.json' }
            ).as('get_authorisations_approved')

            cy.get('button').click()

            cy.wait(['@post_approval', '@get_authorisations_approved'])

            cy.get('@post_approval').its('request.body').should('deep.equal', {
              name: 'An Authorisations Manager',
              emailAddress: 'an.authorisations_manager@hackney.gov.uk',
              decision: 'Approved',
              reason: 'Because of reason',
              salaryBand: 5,
            })
          })
        })

        cy.get('.bc-authorisations__operative--approved').should('exist')

        cy.get('.bc-authorisations__operative--approved').within(() => {
          cy.get('.bc-authorisations__operative--details').within(() => {
            cy.get(':nth-child(5) dt').contains('Final band')
            cy.get(':nth-child(5) dd').contains('5')
          })
        })

        cy.get('.bc-authorisations__operative--expand').click()

        cy.get('form').within(() => {
          cy.get('.lbh-page-announcement').within(() => {
            cy.contains('h3', 'Authorisation already submitted')
            cy.get('.lbh-page-announcement__content').contains(
              'Authorisation can still be changed whilst the period has not been closed.'
            )
          })
        })
      })

      cy.audit()
    })

    it('They can reject band changes', () => {
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
          path: '/api/v1/band-changes/authorisations',
        },
        { statusCode: 200, fixture: 'changes/authorisations.json' }
      ).as('get_authorisations')

      cy.visit('/manage/authorisations')
      cy.wait(['@get_period', '@get_authorisations'])

      cy.get('.bc-authorisations').within(() => {
        cy.contains('h1', 'Authorisations')
        cy.contains('h1', '(Period 1 – 2022)')
      })

      cy.get('.bc-authorisations__group:nth-of-type(1)').within(() => {
        cy.contains('h2', 'Supervisor: A Supervisor')

        cy.get('.bc-authorisations__operative:nth-of-type(1)').within(() => {
          cy.get('.bc-authorisations__operative--details').within(() => {
            cy.get(':nth-child(1) dt').contains('Alex Cable')
            cy.get(':nth-child(1) dt').contains('(123456)')
            cy.get(':nth-child(1) dd').contains('Current band: 5')

            cy.get(':nth-child(2) dt').contains('Sick hours')
            cy.get(':nth-child(2) dd.sick-warning').contains('72.00')

            cy.get(':nth-child(3) dt').contains('Projected band')
            cy.get(':nth-child(3) dd').contains('1')

            cy.get(':nth-child(4) dt').contains('Proposed band')
            cy.get(':nth-child(4) dd').contains('5')

            cy.get(':nth-child(5) dt').contains('Final band')
            cy.get(':nth-child(5) dd').contains('–')
          })

          cy.get('form').should('not.be.visible')
          cy.get('.bc-authorisations__operative--expand').click()
          cy.get('form').should('be.visible')

          cy.get('form').within(() => {
            cy.get('h3').contains(
              'Reason for a salary band different to the projected band:'
            )

            cy.get('p').contains(
              'Reason for keeping this operative at their current band'
            )

            cy.get('input[value=Rejected]').check()
            cy.get('input[name=salaryBand]').type('3')

            cy.get('textarea[name=reason] + span').contains(
              'You can enter up to 300 characters'
            )

            cy.get('textarea[name=reason]').type('Because of reason')

            cy.get('textarea[name=reason] + span').contains(
              'You have 283 characters remaining'
            )

            cy.intercept(
              {
                method: 'POST',
                path: '/api/v1/band-changes/123456/manager',
              },
              { statusCode: 200, body: {} }
            ).as('post_rejection')

            cy.intercept(
              {
                method: 'GET',
                path: '/api/v1/band-changes/authorisations',
              },
              { statusCode: 200, fixture: 'changes/rejected.json' }
            ).as('get_authorisations_rejected')

            cy.get('button').click()

            cy.wait(['@post_rejection', '@get_authorisations_rejected'])

            cy.get('@post_rejection').its('request.body').should('deep.equal', {
              name: 'An Authorisations Manager',
              emailAddress: 'an.authorisations_manager@hackney.gov.uk',
              decision: 'Rejected',
              reason: 'Because of reason',
              salaryBand: 3,
            })
          })
        })

        cy.get('.bc-authorisations__operative--rejected').should('exist')

        cy.get('.bc-authorisations__operative--rejected').within(() => {
          cy.get('.bc-authorisations__operative--details').within(() => {
            cy.get(':nth-child(5) dt').contains('Final band')
            cy.get(':nth-child(5) dd').contains('3')
          })
        })

        cy.get('.bc-authorisations__operative--expand').click()

        cy.get('form').within(() => {
          cy.get('.lbh-page-announcement').within(() => {
            cy.contains('h3', 'Authorisation already submitted')
            cy.get('.lbh-page-announcement__content').contains(
              'Authorisation can still be changed whilst the period has not been closed.'
            )
          })
        })
      })

      cy.audit()
    })
  })
})
