import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const Header = () => {
  const {
    timesheet: { week },
  } = useContext(PageContext)

  return <h3 className="lbh-heading-h3">{week.description}</h3>
}

export default Header
