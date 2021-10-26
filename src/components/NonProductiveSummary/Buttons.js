import PropTypes from 'prop-types'
import Link from 'next/link'
import { Week } from '@/models'

const Buttons = ({ week, baseUrl }) => {
  return (
    <div className="govuk-button-group">
      <button className="govuk-button lbh-button" data-module="govuk-button">
        Download report
      </button>

      {week.isEditable && (
        <Link href={`${baseUrl}/${week.id}/non-productive/edit`}>
          <a
            role="button"
            draggable="false"
            className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
            data-module="govuk-button"
          >
            Edit non-productive
          </a>
        </Link>
      )}
    </div>
  )
}

Buttons.propTypes = {
  week: PropTypes.instanceOf(Week).isRequired,
  baseUrl: PropTypes.string.isRequired,
}

export default Buttons
