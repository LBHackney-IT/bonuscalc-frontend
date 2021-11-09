import PreviousLink from '../PreviousLink'
import NextLink from '../NextLink'
import PageContext from '@/components/PageContext'
import { useContext } from 'react'

const Pagination = () => {
  const { operative, summary } = useContext(PageContext)

  const baseUrl = `/operatives/${operative.id}/summaries`
  const bonusPeriod = summary.bonusPeriod

  return (
    <nav className="lbh-simple-pagination govuk-!-margin-top-3">
      {bonusPeriod.isFirst ? (
        <span className="lbh-simple-pagination__link" />
      ) : (
        <PreviousLink href={`${baseUrl}/${bonusPeriod.previousDate}`}>
          {bonusPeriod.previousDescription}
        </PreviousLink>
      )}
      {bonusPeriod.isLast ? (
        <span className="lbh-simple-pagination__link lbh-simple-pagination__link--next" />
      ) : (
        <NextLink href={`${baseUrl}/${bonusPeriod.nextDate}`}>
          {bonusPeriod.nextDescription}
        </NextLink>
      )}
    </nav>
  )
}

export default Pagination
