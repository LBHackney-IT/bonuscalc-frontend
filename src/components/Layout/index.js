import PropTypes from 'prop-types'
import Head from 'next/head'
import Header from '../Header'
import PhaseBanner from '../PhaseBanner'

const Layout = ({ serviceName, feedbackLink, children }) => {
  return (
    <>
      <Head>
        <title>{serviceName} | Hackney</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
          key="viewport"
        />
        <meta name="theme-color" content="#0b0c0c" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header serviceName={serviceName} />
      <PhaseBanner feedbackLink={feedbackLink} />
      <main className="lbh-main-wrapper" id="main-content" role="main">
        <div className="lbh-container">{children}</div>
      </main>
    </>
  )
}

Layout.propTypes = {
  serviceName: PropTypes.string.isRequired,
  feedbackLink: PropTypes.string.isRequired,
}

export default Layout
