/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Search page', () => {
  beforeEach(() => {
    cy.login()
  })

  describe('Search for an operative', () => {
    beforeEach(() => {
      cy.visit('/search')

      cy.get('#formView_operative').click()
      cy.get('#operativeSearch').clear()
    })

    it('Checks a payroll number or name has been entered', () => {
      cy.get('button').click()

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Enter a payroll number or operative name')
      })

      cy.audit()
    })

    it('Checks a payroll number is valid', () => {
      cy.get('#operativeSearch').type('12345')
      cy.get('button').click()

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Payroll number must be 6 digits (e.g. 123456)')
      })

      cy.audit()
    })

    it('Displays a message when there is an error', () => {
      cy.intercept(
        { method: 'GET', path: '/api/v1/operatives?query=123456' },
        { statusCode: 500, fixture: 'search/operatives/error.json' }
      ).as('get_operatives')

      cy.get('#operativeSearch').type('123456')
      cy.get('button').click()

      cy.wait('@get_operatives')

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Sorry, an unexpected error occurred')
      })

      cy.audit()
    })

    it('Displays a message when there are no results', () => {
      cy.intercept(
        { method: 'GET', path: '/api/v1/operatives?query=123456' },
        { statusCode: 200, fixture: 'search/operatives/empty.json' }
      ).as('get_operatives')

      cy.get('#operativeSearch').type('123456')
      cy.get('button').click()

      cy.wait('@get_operatives')
      cy.contains('No operatives matched your query')

      cy.audit()
    })

    it('Displays a list of operatives', () => {
      cy.intercept(
        { method: 'GET', path: '/api/v1/operatives?query=123456' },
        { statusCode: 200, fixture: 'search/operatives/results.json' }
      ).as('get_operatives')

      cy.get('#operativeSearch').type('123456')
      cy.get('button').click()

      cy.wait('@get_operatives')
      cy.contains('We found 1 matching result for: 123456')

      cy.get('table').within(() => {
        cy.get('thead > tr:nth-child(1)').within(() => {
          cy.get(':nth-child(1)').contains('Operative name')
          cy.get(':nth-child(2)').contains('Payroll no.')
          cy.get(':nth-child(3)').contains('Trade')
          cy.get(':nth-child(4)').contains('Section / Team')
          cy.get(':nth-child(5)').contains('Scheme')
          cy.get(':nth-child(6)').contains('Salary Band')
        })

        cy.get('tbody > tr:nth-child(1)').within(() => {
          cy.get(':nth-child(1)')
            .contains('a', 'Alex Cable')
            .should((link) => {
              expect(link).to.have.attr('href', '/operatives/123456')
            })
          cy.get(':nth-child(2)')
            .contains('a', '123456')
            .should((link) => {
              expect(link).to.have.attr('href', '/operatives/123456')
            })
          cy.get(':nth-child(3)').contains('Electrician (EL)')
          cy.get(':nth-child(4)').contains('R3007')
          cy.get(':nth-child(5)').contains('Reactive')
          cy.get(':nth-child(6)').contains('5')
        })
      })

      cy.audit()
    })
  })

  describe('Search for a work order', () => {
    beforeEach(() => {
      cy.visit('/search')

      cy.get('#formView_workOrder').click()
      cy.get('#workOrderSearch').clear()
    })

    it('Checks a work order reference or address has been entered', () => {
      cy.get('button').click()

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Enter a work order reference or address')
      })

      cy.audit()
    })

    it('Checks a work order reference is valid', () => {
      cy.get('#workOrderSearch').type('1234567')
      cy.get('button').click()

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Work order reference must be 8 digits (e.g. 12345678)')
      })

      cy.audit()
    })

    it('Displays a message when there is an error', () => {
      cy.intercept(
        { method: 'GET', path: '/api/v1/work/elements?query=12345678' },
        { statusCode: 500, fixture: 'search/work_elements/error.json' }
      ).as('get_work_elements')

      cy.get('#workOrderSearch').type('12345678')
      cy.get('button').click()

      cy.wait('@get_work_elements')

      cy.get('.govuk-error-message').within(() => {
        cy.contains('Sorry, an unexpected error occurred')
      })

      cy.audit()
    })

    it('Displays a message when there are no results', () => {
      cy.intercept(
        { method: 'GET', path: '/api/v1/work/elements?query=12345678' },
        { statusCode: 200, fixture: 'search/work_elements/empty.json' }
      ).as('get_work_elements')

      cy.get('#workOrderSearch').type('12345678')
      cy.get('button').click()

      cy.wait('@get_work_elements')
      cy.contains('No work orders matched your query')

      cy.audit()
    })

    it('Displays a list of work orders', () => {
      cy.intercept(
        { method: 'GET', path: '/api/v1/work/elements?query=12345678' },
        { statusCode: 200, fixture: 'search/work_elements/results.json' }
      ).as('get_work_elements')

      cy.get('#workOrderSearch').type('12345678')
      cy.get('button').click()

      cy.wait('@get_work_elements')
      cy.contains('We found 1 matching result for: 12345678')

      cy.get('table').within(() => {
        cy.get('thead > tr:nth-child(1)').within(() => {
          cy.get(':nth-child(1)').contains('Operative name')
          cy.get(':nth-child(2)').contains('Payroll no.')
          cy.get(':nth-child(3)').contains('Reference')
          cy.get(':nth-child(4)').contains('Property')
          cy.get(':nth-child(5)').contains('Close date')
          cy.get(':nth-child(6)').contains('SMVh')
          cy.get(':nth-child(7)').contains('Period')
          cy.get(':nth-child(8)').contains('Week')
        })

        cy.get('tbody > tr:nth-child(1)').within(() => {
          cy.get(':nth-child(1)')
            .contains('a', 'Alex Cable')
            .should((link) => {
              expect(link).to.have.attr('href', '/operatives/123456')
            })
          cy.get(':nth-child(2)')
            .contains('a', '123456')
            .should((link) => {
              expect(link).to.have.attr('href', '/operatives/123456')
            })
          cy.get(':nth-child(3)')
            .contains('a', '12345678')
            .should((link) => {
              expect(link).to.have.attr(
                'href',
                'https://repairs-hub.hackney.gov.uk/work-orders/12345678'
              )
              expect(link).to.have.attr('target', '_blank')
            })
          cy.get(':nth-child(4)').contains('2 Somewhere Street')
          cy.get(':nth-child(5)').contains('19/10/2021')
          cy.get(':nth-child(6)').contains('1.00')
          cy.get(':nth-child(7)')
            .contains('a', '3')
            .should((link) => {
              expect(link).to.have.attr(
                'href',
                '/operatives/123456/summaries/2021-08-02'
              )
            })
          cy.get(':nth-child(8)')
            .contains('a', '12')
            .should((link) => {
              expect(link).to.have.attr(
                'href',
                '/operatives/123456/timesheets/2021-10-18/productive'
              )
            })
        })
      })

      cy.audit()
    })
  })
})
