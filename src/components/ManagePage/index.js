import cx from 'classnames'
import PropTypes from 'prop-types'
import Link from 'next/link'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import { useAuthorisations } from '@/utils/apiClient'

const MenuItem = ({ item, section, children }) => {
  return (
    <Link
      href={`/manage/${item}`}
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
    </Link>
  )
}

const Menu = ({ section, user }) => {
  const { authorisations, isLoading, isError } = useAuthorisations()

  if (isLoading) return <Spinner />
  if (isError || !authorisations)
    return (
      <p className="lbh-body-s">
        <ErrorMessage description={`Unable to fetch authorisations`} />
      </p>
    )

  const pendingAuthorisations = authorisations.filter((a) => !a.isCompleted)

  return (
    <ul className="lbh-list lbh-body-s">
      <li>
        <MenuItem item="weeks" section={section}>
          Open weeks
        </MenuItem>
      </li>
      {user.hasWeekManagerPermissions && (
        <li>
          <MenuItem item="periods" section={section}>
            Bonus periods
          </MenuItem>
        </li>
      )}
      <li>
        <MenuItem item="bands" section={section}>
          Band change
        </MenuItem>
      </li>
      {user.hasAuthorisationsManagerPermissions && (
        <>
          {authorisations && authorisations.length > 0 && (
            <li>
              <MenuItem item="authorisations" section={section}>
                Authorisations{' '}
                {pendingAuthorisations.length > 0 && (
                  <>({pendingAuthorisations.length})</>
                )}
              </MenuItem>
            </li>
          )}
        </>
      )}
    </ul>
  )
}

const ManagePage = ({ user, section, children }) => {
  return (
    <>
      <p className="lbh-heading-h4 govuk-!-margin-bottom-2">{user.name}</p>
      <hr className="govuk-section-break govuk-section-break--visible" />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-fifth">
          <Menu section={section} user={user} />
        </div>
        <div className="govuk-grid-column-four-fifths">{children}</div>
      </div>
    </>
  )
}

ManagePage.propTypes = {
  user: PropTypes.object.isRequired,
  section: PropTypes.string.isRequired,
}

export default ManagePage
