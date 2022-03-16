/// <reference types="cypress" />

import 'cypress-audit/commands'

describe('Closing a week', () => {
  context('When not logged in', () => {
    it('Redirects to the sign in page', () => {
      cy.visit('/manage/weeks')

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

    it('Does not show the close week link', () => {
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

      cy.visit('/manage/weeks')
      cy.wait(['@get_periods', '@get_week_12', '@get_week_13'])

      cy.get('.bc-open-weeks__period:nth-of-type(1)').within(() => {
        cy.get('.bc-open-weeks__week:nth-of-type(1)').within(() => {
          cy.get('header').within(() => {
            cy.contains('a', 'Close week and send reports').should('not.exist')
          })
        })
      })

      cy.audit()
    })

    it('Does not show the download CSV links on closed weeks', () => {
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

      cy.visit('/manage/weeks')
      cy.wait(['@get_periods', '@get_week_12', '@get_week_13'])

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-02' },
        { statusCode: 200, fixture: 'weeks/2021-08-02.json' }
      ).as('get_week_1')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-09' },
        { statusCode: 200, fixture: 'weeks/2021-08-09.json' }
      ).as('get_week_2')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-16' },
        { statusCode: 200, fixture: 'weeks/2021-08-16.json' }
      ).as('get_week_3')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-23' },
        { statusCode: 200, fixture: 'weeks/2021-08-23.json' }
      ).as('get_week_4')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-30' },
        { statusCode: 200, fixture: 'weeks/2021-08-30.json' }
      ).as('get_week_5')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-09-06' },
        { statusCode: 200, fixture: 'weeks/2021-09-06.json' }
      ).as('get_week_6')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-09-13' },
        { statusCode: 200, fixture: 'weeks/2021-09-13.json' }
      ).as('get_week_7')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-09-20' },
        { statusCode: 200, fixture: 'weeks/2021-09-20.json' }
      ).as('get_week_8')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-09-27' },
        { statusCode: 200, fixture: 'weeks/2021-09-27.json' }
      ).as('get_week_9')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-10-04' },
        { statusCode: 200, fixture: 'weeks/2021-10-04.json' }
      ).as('get_week_10')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-10-11' },
        { statusCode: 200, fixture: 'weeks/2021-10-11.json' }
      ).as('get_week_11')

      cy.contains('button', 'View all weeks').click()

      cy.wait([
        '@get_week_1',
        '@get_week_2',
        '@get_week_3',
        '@get_week_4',
        '@get_week_5',
        '@get_week_6',
        '@get_week_7',
        '@get_week_8',
        '@get_week_9',
        '@get_week_10',
        '@get_week_11',
      ])

      cy.get('.bc-open-weeks__period:nth-of-type(1)').within(() => {
        cy.get('.bc-open-weeks__week--closed:nth-of-type(1)').within(() => {
          cy.get('.bc-open-weeks__operatives').within(() => {
            cy.get('header').within(() => {
              cy.contains('a', 'View all operatives').should('exist')
              cy.contains('a', 'Download Overtime CSV file').should('not.exist')
              cy.contains('a', 'Download Out of hours CSV file').should(
                'not.exist'
              )
            })
          })
        })
      })

      cy.audit()
    })
  })

  context('When logged in as a week manager', () => {
    beforeEach(() => {
      cy.login('a.week_manager')
    })

    it('They can close the week', () => {
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

      cy.visit('/manage/weeks')
      cy.wait(['@get_periods', '@get_week_12', '@get_week_13'])

      cy.get('.bc-open-weeks__period:nth-of-type(1)').within(() => {
        cy.get('.bc-open-weeks__week:nth-of-type(1)').within(() => {
          cy.get('header').within(() => {
            cy.contains('a', 'Close week and send reports').click()

            cy.location().should((loc) => {
              expect(loc.pathname).to.eq('/manage/weeks/2021-10-18/close')
            })
          })
        })
      })

      cy.get('.bc-close-week__summary').within(() => {
        cy.get('h1').contains('Close week and send reports')
        cy.get('p').contains('Summary for Period 3 – 2021 / week 1')
        cy.get('dl').within(() => {
          cy.get('div:nth-of-type(1)').within(() => {
            cy.get('dt').contains('Total number of operatives')
            cy.get('dd').contains('1')
          })

          cy.get('div:nth-of-type(2)').within(() => {
            cy.get('dt').contains('Operatives with no SMVs')
            cy.get('dd').contains('0')
          })
        })
      })

      cy.intercept(
        {
          method: 'POST',
          path: '/api/v1/weeks/2021-10-18',
        },
        { statusCode: 200, body: {} }
      ).as('post_week_12')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/weeks/2021-10-18',
        },
        { statusCode: 200, fixture: 'weeks/2021-10-18-closed.json' }
      ).as('get_week_12_closed')

      cy.intercept(
        {
          method: 'POST',
          path: '/api/reports/operatives/123456/email?date=2021-08-02',
        },
        { statusCode: 200, body: {} }
      ).as('email_123456_report')

      cy.intercept(
        {
          method: 'POST',
          path: '/api/v1/operatives/123456/timesheet/report?week=2021-10-18',
        },
        { statusCode: 200, body: {} }
      ).as('post_123456_report')

      cy.intercept(
        {
          method: 'POST',
          path: '/api/v1/weeks/2021-10-18/reports',
        },
        { statusCode: 200, body: {} }
      ).as('post_week_12_report')

      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/periods/current',
        },
        { statusCode: 200, fixture: 'periods/current-closed-and-sent.json' }
      ).as('get_periods_closed_and_sent')

      cy.get('.bc-close-week').within(() => {
        cy.contains('button', 'Close and send reports').click()
      })

      cy.wait(['@post_week_12', '@get_week_12_closed'])
      cy.wait(['@email_123456_report', '@post_123456_report'])
      cy.wait(['@post_week_12_report', '@get_periods_closed_and_sent'])

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/manage/weeks')
      })

      cy.get('.lbh-page-announcement').within(() => {
        cy.contains(
          'Week 12 is successfully closed – weekly and summary reports have been sent'
        )
      })

      cy.get('.bc-open-weeks__period:nth-of-type(1)').within(() => {
        cy.get('.bc-open-weeks__week:nth-of-type(1)').within(() => {
          cy.get('header').within(() => {
            cy.contains('h3', 'Period 3 – 2021 / week 13')
          })
        })
      })

      // Navigate to another page to check announcement is removed
      cy.intercept(
        {
          method: 'GET',
          path: '/api/v1/pay/bands',
        },
        { statusCode: 200, fixture: 'pay/bands.json' }
      ).as('get_pay_bands')

      cy.contains('a', 'View all operatives').click()

      cy.wait(['@get_pay_bands'])

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/manage/weeks/2021-10-25/operatives')
      })

      cy.get('.bc-all-operatives').within(() => {
        cy.contains('h1', 'Period 3 – 2021 / week 13')
        cy.contains('p', 'All operatives')
      })

      cy.get('.lbh-page-announcement').should('not.exist')

      cy.audit()
    })

    it('Shows the download CSV links on closed weeks', () => {
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

      cy.visit('/manage/weeks')
      cy.wait(['@get_periods', '@get_week_12', '@get_week_13'])

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-02' },
        { statusCode: 200, fixture: 'weeks/2021-08-02.json' }
      ).as('get_week_1')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-09' },
        { statusCode: 200, fixture: 'weeks/2021-08-09.json' }
      ).as('get_week_2')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-16' },
        { statusCode: 200, fixture: 'weeks/2021-08-16.json' }
      ).as('get_week_3')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-23' },
        { statusCode: 200, fixture: 'weeks/2021-08-23.json' }
      ).as('get_week_4')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-08-30' },
        { statusCode: 200, fixture: 'weeks/2021-08-30.json' }
      ).as('get_week_5')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-09-06' },
        { statusCode: 200, fixture: 'weeks/2021-09-06.json' }
      ).as('get_week_6')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-09-13' },
        { statusCode: 200, fixture: 'weeks/2021-09-13.json' }
      ).as('get_week_7')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-09-20' },
        { statusCode: 200, fixture: 'weeks/2021-09-20.json' }
      ).as('get_week_8')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-09-27' },
        { statusCode: 200, fixture: 'weeks/2021-09-27.json' }
      ).as('get_week_9')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-10-04' },
        { statusCode: 200, fixture: 'weeks/2021-10-04.json' }
      ).as('get_week_10')

      cy.intercept(
        { method: 'GET', path: '/api/v1/weeks/2021-10-11' },
        { statusCode: 200, fixture: 'weeks/2021-10-11.json' }
      ).as('get_week_11')

      cy.contains('button', 'View all weeks').click()

      cy.wait([
        '@get_week_1',
        '@get_week_2',
        '@get_week_3',
        '@get_week_4',
        '@get_week_5',
        '@get_week_6',
        '@get_week_7',
        '@get_week_8',
        '@get_week_9',
        '@get_week_10',
        '@get_week_11',
      ])

      cy.get('.bc-open-weeks__period:nth-of-type(1)').within(() => {
        cy.get('.bc-open-weeks__week--closed:nth-of-type(1)').within(() => {
          cy.get('.bc-open-weeks__operatives').within(() => {
            cy.get('header').within(() => {
              cy.contains('a', 'View all operatives').should('exist')
              cy.contains('a', 'Download Overtime CSV file').should('exist')
              cy.contains('a', 'Download Out of hours CSV file').should('exist')
            })
          })
        })
      })

      cy.audit()
    })
  })
})
