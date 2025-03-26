import PropTypes from 'prop-types'
import cx from 'classnames'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Announcement = ({ announcement, setAnnouncement }) => {
  const router = useRouter()
  // const { setAnnouncement } = useContext(AnnouncementContext)

  // const annountmentJustSet = useRef(false)

  // const memoizedAnnouncement = useMemo(() => announcement, [announcement])

  useEffect(() => {
    if (announcement == null) return

    const clearAnnouncement = () => {
      console.log('request to clear announcement', { announcement })

      // if (annountmentJustSet.current == true) {
      //   annountmentJustSet.current = false
      //   console.log('Not clearing this one, just set')
      //   return
      // }

      console.log('clearing this one')
      setAnnouncement(null)
    }

    router.events.on('routeChangeStart', clearAnnouncement)

    return () => {
      router.events.off('routeChangeStart', clearAnnouncement)
    }
  }, [router.events, setAnnouncement, announcement])

  // useEffect(() => {
  //   if (announcement != null) {
  //     console.log('Announcement update, setting true')
  //     annountmentJustSet.current = true
  //   }
  // }, [announcement])

  if (announcement == null) return <></>

  const { title, content, isWarning } = announcement

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
