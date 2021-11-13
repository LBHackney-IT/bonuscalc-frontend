import AnnouncementContext from '../AnnouncementContext'
import BackButton from '../BackButton'
import { useEffect, useContext } from 'react'

const NotFound = ({ children }) => {
  const { setAnnouncement } = useContext(AnnouncementContext)

  useEffect(() => {
    setAnnouncement({})
  }, [setAnnouncement])

  return (
    <>
      <BackButton href="/" />
      <section className="section">
        <h1 className="lbh-heading-h1">Not Found</h1>
        <p className="lbh-body">{children}</p>
      </section>
    </>
  )
}

export default NotFound
