import OperativeSearch from './OperativeSearch'
import WorkOrderSearch from './WorkOrderSearch'
import { useState } from 'react'

const CombinedSearch = () => {
  const [formView, setFormView] = useState('operative')

  const handleFormViewChange = (event) => {
    setFormView(event.target.value)
  }

  return (
    <>
      <div className="govuk-form-group lbh-form-group">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
            <h1 className="govuk-fieldset__heading">
              Find operatives or work orders
            </h1>
          </legend>
          <div className="govuk-radios lbh-radios">
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="formView_operative"
                name="formView"
                type="radio"
                value="operative"
                checked={formView == 'operative'}
                onChange={handleFormViewChange}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor="formView_operative"
              >
                Operative
              </label>
            </div>
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="formView_workOrder"
                name="formView"
                type="radio"
                value="workOrder"
                checked={formView == 'workOrder'}
                onChange={handleFormViewChange}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor="formView_workOrder"
              >
                Work order or address
              </label>
            </div>
          </div>
        </fieldset>
      </div>
      {formView == 'operative' ? <OperativeSearch /> : <WorkOrderSearch />}
    </>
  )
}

export default CombinedSearch
