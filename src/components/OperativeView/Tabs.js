import { useEffect } from 'react'

const Tabs = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('lbh-frontend').initAll()
    }
  }, [])

  return (
    <div
      className="govuk-tabs lbh-tabs govuk-!-margin-top-9"
      data-module="govuk-tabs"
    >
      <h2 className="govuk-tabs__title">Contents</h2>
      <ul className="govuk-tabs__list">
        <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
          <a className="govuk-tabs__tab" href="#summary">
            Summary
          </a>
        </li>
        <li className="govuk-tabs__list-item">
          <a className="govuk-tabs__tab" href="#productive">
            Productive (P)
          </a>
        </li>
        <li className="govuk-tabs__list-item">
          <a className="govuk-tabs__tab" href="#non-productive">
            Non-productive (NP)
          </a>
        </li>
        <li className="govuk-tabs__list-item">
          <a className="govuk-tabs__tab" href="#out-of-hours">
            Out of hours
          </a>
        </li>
      </ul>

      <section className="govuk-tabs__panel" id="summary"></section>
      <section
        className="govuk-tabs__panel govuk-tabs__panel--hidden"
        id="productive"
      ></section>
      <section
        className="govuk-tabs__panel govuk-tabs__panel--hidden"
        id="non-productive"
      ></section>
      <section
        className="govuk-tabs__panel govuk-tabs__panel--hidden"
        id="out-of-hours"
      ></section>
    </div>
  )
}

export default Tabs
