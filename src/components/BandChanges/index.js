import cx from 'classnames'
import PropTypes from 'prop-types'
import Link from 'next/link'
import AnnouncementContext from '@/components/AnnouncementContext'
import Button from '@/components/Button'
import ButtonGroup from '@/components/ButtonGroup'
import LinkButton from '@/components/LinkButton'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import ErrorMessage from '@/components/ErrorMessage'
import UserContext from '@/components/UserContext'
import { useContext, useState, useRef } from 'react'
import { useEffect, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/router'
import { SearchIcon, CrossIcon } from '@/components/Icons'
import { Table, THead, TBody, TR, TH, TD } from '@/components/Table'
import { BonusPeriod } from '@/models'
import { useBandChanges, startBandChangeProcess } from '@/utils/apiClient'
import { saveSupervisorDecision } from '@/utils/apiClient'
import { numberWithPrecision } from '@/utils/number'
import { smvh } from '@/utils/scheme'
import { compareStrings, pluralize } from '@/utils/string'
import { escapeRegExp, transliterate } from '@/utils/string'
import { captureException } from '@sentry/nextjs'

const StartBandChangeProcess = ({ period }) => {
  const router = useRouter()
  const startButton = useRef(null)
  const [completed, setCompleted] = useState(false)
  const { user } = useContext(UserContext)

  const onClick = async () => {
    startButton.current.disabled = true
    await startBandChangeProcess()
    setCompleted(true)
  }

  useEffect(() => {
    if (completed) {
      router.reload('/manage/bands')
    }
  }, [completed, router])

  return (
    <section className="bc-band-changes">
      <h1 className="bc-band-changes__header">
        <span>Band change</span>
        <span>({period.description})</span>
      </h1>
      {user.hasWeekManagerPermissions ? (
        <>
          <p>
            All the weeks are closed – click ‘Start’ to begin
            approving/rejecting band changes.
          </p>
          <ButtonGroup>
            <Button ref={startButton} onClick={onClick}>
              Start
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <p>
          All the weeks are closed – waiting for the bonus scheme manager to
          start the band change process.
        </p>
      )}
    </section>
  )
}

const Header = ({ period }) => {
  return (
    <h1 className="bc-band-changes__header">
      <span>Band change</span>
      <span>({period.description})</span>
    </h1>
  )
}

const SelectAllCheckbox = ({ htmlId, onChange }) => {
  return (
    <div className="govuk-checkboxes govuk-checkboxes--small lbh-checkboxes">
      <div className="govuk-checkboxes__item">
        <input
          className="govuk-checkboxes__input"
          id={htmlId}
          name={htmlId}
          type="checkbox"
          value="1"
          defaultChecked={false}
          onChange={onChange}
        />
        <label className="govuk-label govuk-checkboxes__label" htmlFor={htmlId}>
          <span className="govuk-visually-hidden">Select All</span>
        </label>
      </div>
    </div>
  )
}

const OperativeCheckbox = ({ operative, isChecked, onChange }) => {
  return (
    <div className="govuk-checkboxes govuk-checkboxes--small lbh-checkboxes">
      <div className="govuk-checkboxes__item">
        <input
          className="govuk-checkboxes__input"
          id={`operative_${operative?.operativeId}`}
          name={`operative_${operative?.operativeId}`}
          type="checkbox"
          value={operative?.operativeId}
          checked={isChecked(operative?.operativeId)}
          onChange={onChange}
          disabled={operative?.isDisabled}
        />
        <label
          className="govuk-label govuk-checkboxes__label"
          htmlFor={`operative_${operative?.operativeId}`}
        >
          <span className="govuk-visually-hidden">Select Operative</span>
        </label>
      </div>
    </div>
  )
}

const RejectionForm = ({ bandChange, operative, register, errors, index }) => {
  const [characterCount, setCharacterCount] = useState(300)
  const summaryLink = `/operatives/${operative?.operativeId}/summaries/${operative?.bonusPeriod?.id}`

  return (
    <li key={bandChange.id} className="bc-band-changes__rejection">
      <dl className="bc-band-changes__rejection--details">
        <div>
          <dt>Operative</dt>
          <dd>
            <Link href={summaryLink}>
              <a className="lbh-link lbh-link--no-visited-state">
                <span className="operative-name">
                  {operative?.operativeName}
                </span>
                <span className="operative-id">({operative?.operativeId})</span>
              </a>
            </Link>
          </dd>
        </div>
        <div>
          <dt>Trade</dt>
          <dd>{operative?.trade}</dd>
        </div>
        <div>
          <dt>Sick hours</dt>
          <dd className={cx({ 'sick-warning': operative?.isSickWarning })}>
            {numberWithPrecision(operative?.sickDuration, 2)}
          </dd>
        </div>
        <div>
          <dt>Total SMVh</dt>
          <dd>{numberWithPrecision(operative?.totalValue, 2)}</dd>
        </div>
        <div>
          <dt>
            Current<span className="govuk-visually-hidden"> band</span>
          </dt>
          <dd>{operative?.salaryBand}</dd>
        </div>
        <div>
          <dt>
            Projected<span className="govuk-visually-hidden"> band</span>
          </dt>
          <dd className={cx({ 'sick-warning': operative?.isSickWarning })}>
            {operative?.projectedBand}
          </dd>
        </div>
      </dl>
      <div className="govuk-form-group lbh-form-group">
        <label
          className="govuk-label lbh-label"
          htmlFor={`bandChanges_${index}_salaryBand`}
        >
          Change to
        </label>
        <input
          {...register(`bandChanges.${index}.salaryBand`, {
            required: true,
            valueAsNumber: true,
            validate: {
              greaterThanZero: (v) => parseInt(v) > 0,
              lessThanTen: (v) => parseInt(v) < 10,
              isNumber: (v) => !isNaN(parseInt(v)),
            },
          })}
          className="govuk-input lbh-input govuk-input--width-3"
          id={`bandChanges_${index}_salaryBand`}
          type="text"
        />
      </div>
      {errors.bandChanges?.[index]?.salaryBand && (
        <div className="govuk-!-margin-0 govuk-!-margin-top-2">
          <ErrorMessage description="Enter a value between 1 and 9 for the salary band" />
        </div>
      )}
      <div className="govuk-form-group lbh-form-group">
        <label
          className="govuk-label lbh-label"
          htmlFor={`bandChanges_${index}_reason`}
        >
          Reason for rejection
        </label>
        <textarea
          {...register(`bandChanges.${index}.reason`, {
            onChange: (e) => setCharacterCount(300 - e.target.value.length),
            required: true,
            maxLength: 300,
          })}
          className="govuk-textarea lbh-textarea"
          id={`bandChanges_${index}_reason`}
          rows="5"
        ></textarea>
        <span
          className={cx('govuk-hint', 'govuk-character-count__message', {
            'lbh-!-font-colour-warning': characterCount < 0,
          })}
        >
          {characterCount == 300 ? (
            <>You can enter up to 300 characters{console.log(errors)}</>
          ) : (
            <>You have {characterCount} characters remaining</>
          )}
        </span>
      </div>
      {errors.bandChanges?.[index]?.reason?.type == 'required' && (
        <div className="govuk-!-margin-0 govuk-!-margin-top-2">
          <ErrorMessage description="Enter a reason why the projected band should be rejected" />
        </div>
      )}
      {errors.bandChanges?.[index]?.reason?.type == 'maxLength' && (
        <div className="govuk-!-margin-0 govuk-!-margin-top-2">
          <ErrorMessage description="Enter a reason that is 300 characters or less" />
        </div>
      )}
    </li>
  )
}

const BonusBandForm = ({ operatives, checked, setChecked }) => {
  const [decision, setDecision] = useState('Approved')
  const [selectedOperatives, setSelectedOperatives] = useState({})
  const { user } = useContext(UserContext)
  const { setAnnouncement } = useContext(AnnouncementContext)

  const {
    register,
    control,
    clearErrors,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const { fields, replace } = useFieldArray({
    control,
    name: 'bandChanges',
  })

  const onSubmit = async (data) => {
    const { bandChanges } = data

    try {
      await Promise.all(
        bandChanges.map((bandChange) => {
          const { operativeId, ...request } = bandChange
          return saveSupervisorDecision(operativeId, request)
        })
      )

      if (checked.length > 1) {
        setAnnouncement({
          title: `Band changes have been successfully ${decision.toLowerCase()}`,
        })
      } else {
        setAnnouncement({
          title: `Band change has been successfully ${decision.toLowerCase()}`,
        })
      }

      setChecked([])
      setDecision('Approved')
    } catch (error) {
      if (checked.length > 1) {
        setAnnouncement({
          title: `Unable to save band change decisions - please try again in a moment`,
          isWarning: true,
        })
      } else {
        setAnnouncement({
          title: `Unable to save band change decision - please try again in a moment`,
          isWarning: true,
        })
      }

      captureException(error)
      throw Error(error)
    }
  }

  useEffect(() => {
    if (checked.length == 0) {
      setDecision('Approved')
    }

    setSelectedOperatives(
      operatives.reduce((object, item) => {
        if (checked.includes(item?.operativeId)) {
          object[item?.operativeId] = item
        }

        return object
      }, {})
    )

    clearErrors()

    replace(
      operatives
        .filter((o) => checked.includes(o?.operativeId))
        .map((o) => ({
          id: o?.operativeId,
          operativeId: o?.operativeId,
          name: user.name,
          emailAddress: user.email,
          decision: decision,
          reason: null,
          salaryBand: o.projectedBand,
        }))
    )
  }, [
    operatives,
    checked,
    replace,
    clearErrors,
    user.name,
    user.email,
    decision,
  ])

  return (
    <div className="bc-band-changes__form">
      <h3>
        Selected: {checked.length}{' '}
        {pluralize(checked.length, 'operative', 'operatives')}
      </h3>

      <div className="govuk-radios lbh-radios">
        <div className="govuk-radios__item">
          <input
            className="govuk-radios__input"
            id="approveBandChangeDecision"
            name="bandChangeDecision"
            type="radio"
            value="Approved"
            onChange={() => setDecision('Approved')}
            checked={decision == 'Approved'}
            disabled={checked == 0}
          />
          <label
            className="govuk-label govuk-radios__label"
            htmlFor="approveBandChangeDecision"
          >
            Approve band change
          </label>
        </div>
        <div className="govuk-radios__item">
          <input
            className="govuk-radios__input"
            id="rejectBandChangeDecision"
            name="bandChangeDecision"
            type="radio"
            value="Rejected"
            onChange={() => setDecision('Rejected')}
            checked={decision == 'Rejected'}
            disabled={checked == 0}
          />
          <label
            className="govuk-label govuk-radios__label"
            htmlFor="rejectBandChangeDecision"
          >
            Reject band change
          </label>
        </div>
      </div>

      <form className="govuk-!-margin-top-0" onSubmit={handleSubmit(onSubmit)}>
        {decision == 'Rejected' && (
          <>
            <ol className="bc-band-changes__rejections">
              {fields.map((bandChange, index) => (
                <RejectionForm
                  key={bandChange.id}
                  bandChange={bandChange}
                  operative={selectedOperatives[bandChange.id]}
                  register={register}
                  errors={errors}
                  index={index}
                />
              ))}
            </ol>
            <section className="lbh-page-announcement lbh-page-announcement--info">
              <h3 className="lbh-page-announcement__title govuk-!-font-size-19">
                Rejections have to be approved
              </h3>
              <div className="lbh-page-announcement__content govuk-!-font-size-16">
                Your request will now be sent to your manager for approval
              </div>
            </section>
          </>
        )}
        <Button
          className="govuk-!-margin-top-3"
          type="submit"
          disabled={checked.length == 0 || isSubmitting}
        >
          {isSubmitting ? <>Submitting ...</> : <>Submit</>}
        </Button>
      </form>
    </div>
  )
}

const FixedBandForm = ({ operatives, checked, setChecked }) => {
  const [acknowledged, setAcknowledged] = useState(false)
  const { user } = useContext(UserContext)
  const { setAnnouncement } = useContext(AnnouncementContext)
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const { replace } = useFieldArray({
    control,
    name: 'bandChanges',
  })

  const onSubmit = async (data) => {
    const { bandChanges } = data

    try {
      await Promise.all(
        bandChanges.map((bandChange) => {
          const { operativeId, ...request } = bandChange
          return saveSupervisorDecision(operativeId, request)
        })
      )

      if (checked.length > 1) {
        setAnnouncement({
          title: `Bands have been successfully acknowledged`,
        })
      } else {
        setAnnouncement({
          title: `Band has been successfully acknowledged`,
        })
      }

      setChecked([])
      setAcknowledged(false)
    } catch (error) {
      if (checked.length > 1) {
        setAnnouncement({
          title: 'Unable to acknowledge bands - please try again in a moment',
          isWarning: true,
        })
      } else {
        setAnnouncement({
          title: 'Unable to acknowledge band - please try again in a moment',
          isWarning: true,
        })
      }

      captureException(error)
      throw Error(error)
    }
  }

  useEffect(() => {
    if (checked.length == 0) {
      setAcknowledged(false)
    }

    replace(
      operatives
        .filter((o) => checked.includes(o?.operativeId))
        .map((o) => ({
          id: o?.operativeId,
          operativeId: o?.operativeId,
          name: user.name,
          emailAddress: user.email,
          decision: 'Approved',
          reason: null,
          salaryBand: o.salaryBand,
        }))
    )
  }, [operatives, checked, replace, user.name, user.email])

  return (
    <div className="bc-band-changes__form">
      <h3>
        Selected: {checked.length}{' '}
        {pluralize(checked.length, 'operative', 'operatives')}
      </h3>

      <div className="govuk-form-group lbh-form-group">
        <div className="govuk-checkboxes lbh-checkboxes">
          <div className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id="bandAcknowledgement"
              name="bandAcknowledgement"
              type="checkbox"
              value="approve"
              checked={acknowledged}
              disabled={checked.length == 0}
              onChange={(e) => setAcknowledged(e.target.checked)}
            />
            <label
              className="govuk-label govuk-checkboxes__label"
              htmlFor="bandAcknowledgement"
            >
              Acknowledge Band
            </label>
          </div>
        </div>
      </div>

      <form className="govuk-!-margin-top-0" onSubmit={handleSubmit(onSubmit)}>
        <Button
          className="govuk-!-margin-top-3"
          type="submit"
          disabled={checked.length == 0 || !acknowledged || isSubmitting}
        >
          {isSubmitting ? <>Submitting ...</> : <>Submit</>}
        </Button>
      </form>
    </div>
  )
}

const OperativeList = ({ operatives, period, form, selectAllId }) => {
  const FormComponent = form
  const baseUrl = `/operatives`
  const [checked, setChecked] = useState([])
  const [sortBy, setSortBy] = useState('operativeId')
  const [sortOrder, setSortOrder] = useState('ASC')

  const isChecked = (operativeId) => {
    return checked.includes(operativeId)
  }

  const handleOperativeCheck = (event) => {
    var updatedList = [...checked]

    if (event.target.checked) {
      updatedList = [...checked, event.target.value]
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1)
    }

    setChecked(updatedList)
  }

  const handleSelectAllCheck = (event) => {
    var updatedList = []

    if (event.target.checked) {
      updatedList = operatives
        .filter((o) => o.isSelectable)
        .map((o) => o?.operativeId)
    }

    setChecked(updatedList)
  }

  const sortOn = (property) => {
    return () => {
      if (sortBy == property) {
        if (sortOrder == 'ASC') {
          setSortOrder('DESC')
        } else {
          setSortOrder('ASC')
        }
      } else {
        setSortBy(property)
      }
    }
  }

  const sortClass = (property) => {
    return cx(
      sortBy == property ? 'bc-sort' : null,
      sortBy == property && sortOrder == 'DESC' ? 'bc-sort-desc' : null
    )
  }

  const buttonProps = (property) => {
    return {
      onClick: sortOn(property),
      className: sortClass(property),
    }
  }

  if (sortOrder == 'ASC') {
    operatives.sort((a, b) => {
      return compareStrings(a[sortBy], b[sortBy])
    })
  } else {
    operatives.sort((a, b) => {
      return compareStrings(b[sortBy], a[sortBy])
    })
  }

  useEffect(() => {
    setChecked([])
  }, [operatives])

  return (
    <>
      <Table className="bc-band-changes__list">
        <THead>
          <TR>
            <TH scope="col">
              <SelectAllCheckbox
                htmlId={selectAllId}
                onChange={handleSelectAllCheck}
              />
            </TH>
            <TH scope="col">
              <button {...buttonProps('operativeName')}>{'Operative'}</button>
            </TH>
            <TH scope="col" align="centre">
              <button {...buttonProps('operativeId')}>
                {'Payroll\u00A0no.'}
              </button>
            </TH>
            <TH scope="col" align="centre">
              <button {...buttonProps('trade')}>Trade</button>
            </TH>
            <TH scope="col" numeric={true}>
              <button {...buttonProps('sickDuration')}>{'Sick'}</button>
            </TH>
            <TH scope="col" numeric={true}>
              <button {...buttonProps('totalValue')}>{'Total'}</button>
            </TH>
            <TH scope="col" align="centre">
              <div className="bc-summary-payband">
                <button {...buttonProps('salaryBand')}>Band</button>
                <span> </span>
                <button {...buttonProps('projectedBand')}>
                  <abbr title="Projected">Proj.</abbr>
                </button>
              </div>
            </TH>
            <TH scope="col" align="centre">
              <button {...buttonProps('finalBand')}>{'Change'}</button>
            </TH>
          </TR>
        </THead>
        {operatives.length > 0 ? (
          operatives.map((o, index) => (
            <TBody
              key={index}
              className={cx('bc-band-changes__row', {
                'bc-band-changes__row--approved': o.isApproved,
                'bc-band-changes__row--rejected': o.isRejected,
                'bc-band-changes__row--manager-decision': o.hasManagerDecision,
                'bc-band-changes__row--supervisor-decision':
                  o.isSupervisorRejected,
              })}
            >
              <TR>
                <TD>
                  <OperativeCheckbox
                    operative={o}
                    isChecked={isChecked}
                    onChange={handleOperativeCheck}
                  />
                </TD>
                <TD>
                  <Link
                    href={`${baseUrl}/${o?.operativeId}/summaries/${period.id}`}
                  >
                    <a>{o.operativeName}</a>
                  </Link>
                </TD>
                <TD align="centre">
                  <Link
                    href={`${baseUrl}/${o?.operativeId}/summaries/${period.id}`}
                  >
                    <a>{o?.operativeId}</a>
                  </Link>
                </TD>
                <TD align="centre">
                  <abbr title={o.tradeDescription}>{o.tradeCode}</abbr>
                </TD>
                <TD numeric={true}>
                  <span className={cx({ 'sick-warning': o.isSickWarning })}>
                    {numberWithPrecision(o.sickDuration, 2)}
                  </span>
                </TD>
                <TD numeric={true}>
                  {numberWithPrecision(smvh(o.totalValue), 2)}
                </TD>
                <TD align="centre">
                  <div className="bc-summary-payband">
                    <span>{o.salaryBand}</span>
                    <span> </span>
                    <span className={cx({ 'sick-warning': o.isSickWarning })}>
                      {o.projectedBand}
                    </span>
                  </div>
                </TD>
                <TD align="centre">{o.changedBand}</TD>
              </TR>
              {o.isSupervisorRejected && (
                <TR className="bc-band-changes__supervisor">
                  <TD>&nbsp;</TD>
                  <TD colSpan="6">
                    <h3>
                      Rejected on {o.supervisorDate} by {o.supervisorName},
                      changed to: {o.supervisorBand}
                    </h3>
                    <p>
                      <strong>Reason for rejection:</strong>{' '}
                      {o.supervisorReason}
                    </p>
                  </TD>
                  <TD>&nbsp;</TD>
                </TR>
              )}
              {o.hasManagerDecision && (
                <TR className="bc-band-changes__manager">
                  <TD>&nbsp;</TD>
                  <TD colSpan="6">
                    {o.isManagerApproved ? (
                      <h3>
                        Approved on {o.managerDate} by {o.managerName}
                      </h3>
                    ) : (
                      <h3>
                        Rejected on {o.managerDate} by {o.managerName}, changed
                        to: {o.managerBand}
                      </h3>
                    )}
                    <p>
                      <strong>Reason for operative:</strong> {o.managerReason}
                    </p>
                  </TD>
                  <TD>&nbsp;</TD>
                </TR>
              )}
            </TBody>
          ))
        ) : (
          <TBody>
            <TR>
              <TD colSpan="8">No operatives match your search</TD>
            </TR>
          </TBody>
        )}
      </Table>
      <FormComponent
        period={period}
        operatives={operatives}
        checked={checked}
        setChecked={setChecked}
      />
    </>
  )
}

const Search = ({ allOperatives, period, showAll, setShowAll }) => {
  const searchInput = useRef(null)

  const [value, setValue] = useState('')
  const [operatives, setOperatives] = useState(allOperatives)

  const filterOperatives = useCallback(
    (filter) => {
      if (filter) {
        const regex = new RegExp(escapeRegExp(transliterate(filter)), 'i')
        setOperatives(allOperatives.filter((o) => o.matches(regex)))
      } else {
        setOperatives(allOperatives)
      }
    },
    [allOperatives]
  )

  const onChange = (event) => {
    setValue(event.target.value)
    filterOperatives(event.target.value)
  }

  const onClick = () => {
    setValue('')
    filterOperatives('')
    searchInput.current.focus()
  }

  useEffect(() => {
    filterOperatives(searchInput.current.value)
  }, [allOperatives, filterOperatives])

  return (
    <>
      <div className="bc-band-changes__search">
        <div>
          <h2>{showAll ? <>All operatives</> : <>My operatives</>}</h2>
          <p>
            <LinkButton
              className={'govuk-!-font-size-14'}
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? <>Show my operatives</> : <>Show all operatives</>}
            </LinkButton>
          </p>
        </div>
        <p className="lbh-search-box">
          <label htmlFor="search">Search</label>
          <input
            ref={searchInput}
            id="search"
            type="search"
            placeholder="Search..."
            value={value}
            onChange={onChange}
          />
          <button onClick={onClick}>
            <span>Clear search</span>
            <SearchIcon />
            <CrossIcon />
          </button>
        </p>
      </div>

      <div
        className="govuk-tabs lbh-tabs govuk-!-margin-top-6"
        data-module="govuk-tabs"
      >
        <ul className="govuk-tabs__list">
          <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
            <a className="govuk-tabs__tab" href="#bonus-band">
              Bonus band ({operatives.filter((o) => o.isBonusBand).length})
            </a>
          </li>
          <li className="govuk-tabs__list-item">
            <a className="govuk-tabs__tab" href="#fixed-band">
              Fixed band ({operatives.filter((o) => o.isFixedBand).length})
            </a>
          </li>
        </ul>
        <section className="govuk-tabs__panel" id="bonus-band">
          <OperativeList
            period={period}
            operatives={operatives.filter((o) => o.isBonusBand)}
            form={BonusBandForm}
            selectAllId="selectAllBonusBandOperatives"
          />
        </section>
        <section
          className="govuk-tabs__panel govuk-tabs__panel--hidden"
          id="fixed-band"
        >
          <OperativeList
            period={period}
            operatives={operatives.filter((o) => o.isFixedBand)}
            form={FixedBandForm}
            selectAllId="selectAllFixedBandOperatives"
          />
        </section>
      </div>
    </>
  )
}

const BandChanges = ({ period }) => {
  const { bandChanges, isLoading, isError } = useBandChanges()
  const { user } = useContext(UserContext)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('lbh-frontend').initAll()
    }
  }, [bandChanges])

  if (isLoading) return <Spinner />
  if (isError || !bandChanges)
    return (
      <NotFound>
        Couldn’t find band changes for the current bonus period.
      </NotFound>
    )

  if (bandChanges.length == 0) return <StartBandChangeProcess period={period} />

  const myBandChanges = bandChanges.filter(
    (bc) => bc.supervisorEmail == user.email
  )

  return (
    <section className="bc-band-changes">
      <Header period={period} />
      <Search
        allOperatives={showAll ? bandChanges : myBandChanges}
        period={period}
        showAll={showAll}
        setShowAll={setShowAll}
      />
    </section>
  )
}

BandChanges.propTypes = {
  period: PropTypes.instanceOf(BonusPeriod).isRequired,
}

export default BandChanges
