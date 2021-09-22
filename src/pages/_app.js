import '../styles/all.scss'
import App from 'next/app'
import Script from 'next/script'
import Layout from '../components/Layout'
import AccessDenied from '../components/AccessDenied'

import {
  isAuthorised,
  redirectToAcessDenied,
  AUTH_WHITELIST,
} from '../utils/googleAuth'

import UserContext from '../components/UserContext'

if (typeof window !== 'undefined') {
  document.body.className = document.body.className
    ? document.body.className + ' js-enabled'
    : 'js-enabled'
}

class BonusCalcApp extends App {
  render() {
    const { Component, pageProps } = this.props
    const ComponentToRender = this.props.accessDenied ? AccessDenied : Component

    return (
      <>
        <UserContext.Provider value={{ user: this.props.userDetails }}>
          <Layout
            serviceName="DLO Bonus Scheme"
            feedbackLink="mailto:repairshub.feedback@hackney.gov.uk"
          >
            <ComponentToRender
              {...pageProps}
              userDetails={this.props.userDetails}
            />
          </Layout>
        </UserContext.Provider>
        <Script src="/js/govuk.js"></Script>
      </>
    )
  }
}

BonusCalcApp.getInitialProps = async ({ ctx, Component: pageComponent }) => {
  if (AUTH_WHITELIST.includes(ctx.pathname)) {
    return {}
  }

  const isClientSideTransition = ctx.req.url.match('^/_next/data')

  // Do not write server redirects if this is a client side transition.
  // Otherwise I think Next JS tries to write another response and the
  // entire request fails.
  const userDetails = isAuthorised(ctx, !isClientSideTransition)

  if (!userDetails) {
    return { accessDenied: true }
  }

  if (userAuthorisedForPage(pageComponent, userDetails)) {
    return { userDetails, accessDenied: false }
  } else {
    if (!isClientSideTransition) {
      redirectToAcessDenied(ctx.res)
    }
    return { userDetails, accessDenied: true }
  }
}

const userAuthorisedForPage = (component, user) => {
  if (component.name === 'Error') {
    return true
  }

  if (!component.permittedRoles || component?.permittedRoles?.length === 0) {
    console.log(`Component ${component.name} has no permittedRoles defined.`)
    return false
  }

  return component.permittedRoles.some((role) => user.hasRole(role))
}

export default BonusCalcApp
