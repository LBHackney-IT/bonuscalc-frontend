import cx from 'classnames'
import PropTypes from 'prop-types'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import ErrorMessage from '@/components/ErrorMessage'
import Button from '@/components/Button'
import AnnouncementContext from '@/components/AnnouncementContext'
import UserContext from '@/components/UserContext'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BonusPeriod } from '@/models'
import { saveManagerDecision, useAuthorisations } from '@/utils/apiClient'
import { numberWithPrecision } from '@/utils/number'
import { captureException } from '@sentry/nextjs'

const Header = ({ period }) => {
  return (
    <h1 className="bc-authorisations__header">
      <span>Authorisations</span>
      <span>({period.description})</span>
    </h1>
  )
}

const SupervisorGroups = ({ groups }) => {
  return Object.keys(groups).map((name, index) => {
    return (
      <SupervisorGroup key={index} name={name} authorisations={groups[name]} />
    )
  })
}

const SupervisorGroup = ({ name, authorisations }) => {
  return (
    <section className="bc-authorisations__group">
      <h2>Supervisor: {name}</h2>
      <ol className="bc-authorisations__operatives">
        {authorisations.map((authorisation, index) => (
          <SupervisorRow key={index} authorisation={authorisation} />
        ))}
      </ol>
    </section>
  )
}

const SupervisorRow = ({ authorisation }) => {
  const [expanded, setExpanded] = useState(false)
  const [characterCount, setCharacterCount] = useState(300)
  const { user } = useContext(UserContext)
  const { setAnnouncement } = useContext(AnnouncementContext)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: user.name,
      emailAddress: user.email,
      decision: authorisation.isManagerRejected ? 'Rejected' : 'Approved',
      reason: authorisation.managerReason,
      salaryBand: authorisation.isManagerRejected
        ? authorisation.managerBand
        : authorisation.supervisorBand,
    },
  })

  const watchDecision = watch('decision')

  const onSubmit = async (data) => {
    try {
      await saveManagerDecision(authorisation.operativeId, data)
      setExpanded(false)

      setAnnouncement({
        title: `Authorisation has been successfully submitted`,
      })
    } catch (error) {
      setAnnouncement({
        title: 'Unable to submit authorisation - please try again in a moment',
        isWarning: true,
      })

      captureException(error)
      throw Error(error)
    }
  }

  useEffect(() => {
    if (watchDecision == 'Approved') {
      setValue('salaryBand', authorisation.supervisorBand)
    } else {
      setValue('salaryBand', authorisation.managerBand)
    }
  }, [
    watchDecision,
    setValue,
    authorisation.supervisorBand,
    authorisation.managerBand,
  ])

  return (
    <li
      className={cx('bc-authorisations__operative', {
        'bc-authorisations__operative--approved':
          authorisation.isManagerApproved,
        'bc-authorisations__operative--rejected':
          authorisation.isManagerRejected,
        'bc-authorisations__operative--expanded': expanded,
      })}
    >
      <dl className="bc-authorisations__operative--details">
        <div>
          <dt>
            <span className="operative-name">
              {authorisation.operativeName}
            </span>
            <span className="operative-id">({authorisation.operativeId})</span>
          </dt>
          <dd>Current band: {authorisation.salaryBand}</dd>
        </div>
        <div>
          <dt>Sick hours</dt>
          <dd className={cx({ 'sick-warning': authorisation.isSickWarning })}>
            {numberWithPrecision(authorisation.sickDuration, 2)}
          </dd>
        </div>
        <div>
          <dt>
            Projected<span className="govuk-visually-hidden"> band</span>
          </dt>
          <dd className={cx({ 'sick-warning': authorisation.isSickWarning })}>
            {authorisation.projectedBand}
          </dd>
        </div>
        <div>
          <dt>
            Proposed<span className="govuk-visually-hidden"> band</span>
          </dt>
          <dd>{authorisation.supervisorBand}</dd>
        </div>
        <div>
          <dt>
            Final<span className="govuk-visually-hidden"> band</span>
          </dt>
          <dd>{authorisation.finalBand || '–'}</dd>
        </div>
      </dl>
      <button
        className="bc-authorisations__operative--expand"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#0B0C0C"
                d="m13 4 2 2-7 7-7-7 2-2 5 5z"
                fillRule="evenodd"
              />
            </svg>
            <span>Click to hide</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#0B0C0C"
                d="m4 3 2-2 7 7-7 7-2-2 5-5z"
                fillRule="evenodd"
              />
            </svg>
            <span>Click to reveal</span>
          </>
        )}
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Reason for a salary band different to the projected band:</h3>
        <p>{authorisation.supervisorReason}</p>

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            <div className="govuk-form-group lbh-form-group">
              <div className="govuk-radios lbh-radios">
                <div className="govuk-radios__item">
                  <input
                    {...register('decision', { required: true })}
                    className="govuk-radios__input"
                    id={`decision_${authorisation.operativeId}_approved`}
                    type="radio"
                    value="Approved"
                  />
                  <label
                    className="govuk-label govuk-radios__label"
                    htmlFor={`decision_${authorisation.operativeId}_approved`}
                  >
                    Approve band change
                  </label>
                </div>
                <div className="govuk-radios__item">
                  <input
                    {...register('decision', { required: true })}
                    className="govuk-radios__input"
                    id={`decision_${authorisation.operativeId}_rejected`}
                    name="decision"
                    type="radio"
                    value="Rejected"
                  />
                  <label
                    className="govuk-label govuk-radios__label"
                    htmlFor={`decision_${authorisation.operativeId}_rejected`}
                  >
                    Reject band change
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="govuk-grid-column-one-half">
            <div className="govuk-form-group lbh-form-group">
              <label
                className="govuk-label lbh-label"
                htmlFor={`salaryBand_${authorisation.operativeId}`}
              >
                Change to
              </label>
              <input
                {...register('salaryBand', {
                  required: true,
                  valueAsNumber: true,
                  validate: {
                    greaterThanZero: (v) => parseInt(v) > 0,
                    lessThanTen: (v) => parseInt(v) < 10,
                    isNumber: (v) => !isNaN(parseInt(v)),
                  },
                })}
                className="govuk-input lbh-input govuk-input--width-3"
                id={`salaryBand_${authorisation.operativeId}`}
                name="salaryBand"
                type="text"
                readOnly={watchDecision == 'Approved'}
              />
            </div>
          </div>
        </div>

        {errors.salaryBand && (
          <div className="govuk-!-margin-0 govuk-!-margin-top-2">
            <ErrorMessage description="Enter a value between 1 and 9 for the salary band" />
          </div>
        )}

        <div className="govuk-form-group lbh-form-group">
          <label
            className="govuk-label lbh-label"
            htmlFor={`reason_${authorisation.operativeId}`}
          >
            Reason for operative
          </label>
          <textarea
            {...register('reason', {
              onChange: (e) => setCharacterCount(300 - e.target.value.length),
              required: true,
              maxLength: 300,
            })}
            className="govuk-textarea lbh-textarea"
            id={`reason_${authorisation.operativeId}`}
            name="reason"
            rows="5"
          ></textarea>
          <span
            className={cx('govuk-hint', 'govuk-character-count__message', {
              'lbh-!-font-colour-warning': characterCount < 0,
            })}
          >
            {characterCount == 300 ? (
              <>You can enter up to 300 characters</>
            ) : (
              <>You have {characterCount} characters remaining</>
            )}
          </span>
        </div>
        {errors.reason?.type == 'required' && (
          <div className="govuk-!-margin-0 govuk-!-margin-top-2">
            <ErrorMessage description="Enter a reason for the operative describing why this decision was made" />
          </div>
        )}
        {errors.reason?.type == 'maxLength' && (
          <div className="govuk-!-margin-0 govuk-!-margin-top-2">
            <ErrorMessage description="Enter a reason for the operative that is 300 characters or less" />
          </div>
        )}
        {authorisation.isCompleted && (
          <section className="lbh-page-announcement lbh-page-announcement--info">
            <h3 className="lbh-page-announcement__title govuk-!-font-size-19">
              Authorisation already submitted
            </h3>
            <div className="lbh-page-announcement__content govuk-!-font-size-16">
              Authorisation can still be changed whilst the period has not been
              closed.
            </div>
          </section>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <>Submitting ...</> : <>Submit</>}
        </Button>
      </form>
    </li>
  )
}

const Authorisations = ({ period }) => {
  const { authorisations, isLoading, isError } = useAuthorisations()

  const groupedAuthorisations = () => {
    return authorisations.reduce((object, item) => {
      const supervisor = item.supervisor.name

      object[supervisor] = object[supervisor] || []
      object[supervisor].push(item)

      return object
    }, {})
  }

  if (isLoading) return <Spinner />
  if (isError || !authorisations)
    return (
      <NotFound>
        Couldn’t find authorisations for the current bonus period.
      </NotFound>
    )

  return (
    <section className="bc-authorisations">
      <Header period={period} />
      <SupervisorGroups groups={groupedAuthorisations()} />
    </section>
  )
}

Authorisations.propTypes = {
  period: PropTypes.instanceOf(BonusPeriod).isRequired,
}

export default Authorisations
