import PropTypes from 'prop-types'
import { Week } from '@/models'

const Buttons = ({ week }) => {
  return (
    <div className="govuk-button-group">
      <button className="govuk-button lbh-button" data-module="govuk-button">
        Download report
      </button>

      {week.isEditable && (
        <button
          className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
          data-module="govuk-button"
        >
          Edit non-productive
        </button>
      )}
    </div>
  )
}

Buttons.propTypes = {
  week: PropTypes.instanceOf(Week).isRequired,
}

export default Buttons
