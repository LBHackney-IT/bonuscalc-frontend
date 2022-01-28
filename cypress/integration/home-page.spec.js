/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Home page', () => {
  beforeEach(() => {
    cy.login()

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

    cy.visit('/')
    cy.wait(['@get_periods', '@get_week_12', '@get_week_13'])
  })

  it('Shows the manage open weeks page', () => {
    cy.get('.bc-open-weeks').within(() => {
      cy.contains('h1', 'Open weeks')
      cy.contains('h2', 'Period 3 – 2021')

      cy.get('section:nth-of-type(1)').within(() => {
        cy.get('section:nth-of-type(1)').within(() => {
          cy.contains('h3', 'Period 3 – 2021 / week 12')
        })

        cy.get('section:nth-of-type(2)').within(() => {
          cy.contains('h3', 'Period 3 – 2021 / week 13')
        })
      })
    })

    cy.audit()
  })
})
