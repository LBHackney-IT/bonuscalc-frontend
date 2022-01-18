import EditOperativePage from '@/components/EditOperativePage'
import EditProductive from '@/components/EditProductive'
import { compareStrings } from '@/utils/string'
import { OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE } from '@/utils/user'

const EditProductivePage = ({ query }) => {
  const selectPayElements = (timesheet) => {
    return timesheet.adjustmentPayElements
  }

  const selectPayElementTypes = (payElementTypes) => {
    return payElementTypes
      .filter((pet) => pet.adjustment && pet.selectable)
      .sort((a, b) => compareStrings(a.description, b.description))
  }

  return (
    <EditOperativePage
      query={query}
      tab="productive"
      selectPayElements={selectPayElements}
      selectPayElementTypes={selectPayElementTypes}
      component={EditProductive}
    />
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

EditProductivePage.permittedRoles = [OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE]

export default EditProductivePage
