import PropTypes from 'prop-types'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import Form from './Form'
import { Operative, Timesheet } from '@/models'
import { usePayElementTypes } from '@/utils/apiClient'
import { useForm, FormProvider } from 'react-hook-form'

const Body = ({ operative, timesheet }) => {
  const methods = useForm()

  const { payElementTypes, isLoading, isError } = usePayElementTypes()

  if (isLoading) return <Spinner />
  if (isError || !payElementTypes)
    return (
      <ErrorMessage
        description={`Couldn\u2019t fetch the list of pay element types`}
      />
    )

  return (
    <FormProvider {...methods}>
      <Form
        operative={operative}
        timesheet={timesheet}
        payElementTypes={payElementTypes}
      />
    </FormProvider>
  )
}

Body.propTypes = {
  operative: PropTypes.instanceOf(Operative).isRequired,
  timesheet: PropTypes.instanceOf(Timesheet).isRequired,
}

export default Body
