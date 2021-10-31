import PageContext from '@/components/PageContext'
import BackButton from '@/components/BackButton'
import EditNonProductive from '@/components/EditNonProductive'
import Spinner from '@/components/Spinner'
import NotFound from '@/components/NotFound'
import { OPERATIVE_MANAGER_ROLE } from '@/utils/user'
import {
  useOperative,
  usePayElementTypes,
  useTimesheet,
} from '@/utils/apiClient'

const OperativePage = ({ query }) => {
  const { payrollNumber, week } = query
  const {
    operative,
    isLoading: isOperativeLoading,
    isError: isOperativeError,
  } = useOperative(payrollNumber)

  const {
    timesheet,
    isLoading: isTimesheetLoading,
    isError: isTimesheetError,
  } = useTimesheet(payrollNumber, week)

  const {
    payElementTypes,
    isLoading: isPayElementTypesLoading,
    isError: isPayElementTypesError,
  } = usePayElementTypes()

  if (isOperativeLoading) return <Spinner />
  if (isOperativeError || !operative)
    return (
      <NotFound
        message={`Couldn\u2019t find an operative with the payroll number ${payrollNumber}.`}
      />
    )

  if (isTimesheetLoading) return <Spinner />
  if (isTimesheetError || !timesheet)
    return (
      <NotFound
        message={`Couldn\u2019t find a timesheet for the week beginning ${week}.`}
      />
    )

  if (isPayElementTypesLoading) return <Spinner />
  if (isPayElementTypesError || !payElementTypes)
    return (
      <NotFound message={`Couldn\u2019t fetch the list of pay element types`} />
    )

  return (
    <PageContext.Provider
      value={{ operative, timesheet, payElementTypes, week }}
    >
      <BackButton
        href={`/operatives/${payrollNumber}/timesheets/${week}/non-productive`}
      />
      <EditNonProductive />
    </PageContext.Provider>
  )
}

export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query: query,
    },
  }
}

OperativePage.permittedRoles = [OPERATIVE_MANAGER_ROLE]

export default OperativePage
