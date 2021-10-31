import Header from './Header'
import Form from './Form'
import { useForm, FormProvider } from 'react-hook-form'

const EditNonProductive = () => {
  const methods = useForm()

  return (
    <>
      <Header />
      <FormProvider {...methods}>
        <Form />
      </FormProvider>
    </>
  )
}

export default EditNonProductive
