import AnnouncementContext from '../AnnouncementContext'
import BackButton from '../BackButton'
import { useEffect, useContext } from 'react'

const ServerError = ({ children }) => {
  const { setAnnouncement } = useContext(AnnouncementContext)

  useEffect(() => {
    setAnnouncement({})
  }, [setAnnouncement])

  return (
    <>
      <BackButton href="/" />
      <section className="section">
        <h1 className="lbh-heading-h1">Server Error</h1>
        <p className="lbh-body">{children}</p>
      </section>
    </>
  )
}

export default ServerError
