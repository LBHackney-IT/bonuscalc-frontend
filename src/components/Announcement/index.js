import PropTypes from 'prop-types'
import cx from 'classnames'
import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import AnnouncementContext from '../AnnouncementContext'

const Announcement = ({ announcement }) => {
  const router = useRouter()
  const { setAnnouncement } = useContext(AnnouncementContext)
  const { title, content, isWarning } = announcement

  useEffect(() => {
    const clearAnnouncement = () => {
      setAnnouncement({})
    }

    router.events.on('routeChangeStart', clearAnnouncement)

    return () => {
      router.events.off('routeChangeStart', clearAnnouncement)
    }
  }, [router.events, setAnnouncement])

  if (!title) return <></>

  return (
    <div className="lbh-container">
      <section
        className={cx(
          'lbh-page-announcement govuk-!-margin-bottom-0',
          isWarning ? 'lbh-page-announcement--warning' : null
        )}
      >
        {content ? (
          <>
            <h3 className="lbh-page-announcement__title">{title}</h3>
            <div className="lbh-page-announcement__content">{content}</div>
          </>
        ) : (
          <h3 className="lbh-page-announcement__title govuk-!-margin-bottom-0">
            {title}
          </h3>
        )}
      </section>
    </div>
  )
}

Announcement.propTypes = {
  announcement: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    isWarning: PropTypes.bool,
  }),
}

export default Announcement
