import cx from 'classnames'
import PropTypes from 'prop-types'
import Link from 'next/link'

const MenuItem = ({ item, section, children }) => {
  return (
    <Link href={`/manage/${item}`}>
      <a
        className={cx(
          'lbh-link',
          'lbh-link--no-visited-state',
          'govuk-link--no-underline',
          {
            'lbh-!-font-weight-bold': item == section,
          }
        )}
      >
        {children}
      </a>
    </Link>
  )
}

const ManagePage = ({ user, section, children }) => {
  return (
    <>
      <p className="lbh-heading-h4 govuk-!-margin-bottom-2">{user.name}</p>
      <hr className="govuk-section-break govuk-section-break--visible" />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter">
          <ul className="lbh-list">
            <li>
              <MenuItem item="weeks" section={section}>
                Open weeks
              </MenuItem>
            </li>
            <li>
              <MenuItem item="reports" section={section}>
                Reports
              </MenuItem>
            </li>
            <li>
              <MenuItem item="bands" section={section}>
                Band change
              </MenuItem>
            </li>
          </ul>
        </div>
        <div className="govuk-grid-column-three-quarters">{children}</div>
      </div>
    </>
  )
}

ManagePage.propTypes = {
  user: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
}

export default ManagePage
