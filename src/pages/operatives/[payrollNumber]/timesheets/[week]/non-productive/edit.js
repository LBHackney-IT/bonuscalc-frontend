import EditOperativePage from '@/components/EditOperativePage'
import EditNonProductive from '@/components/EditNonProductive'
import { compareStrings } from '@/utils/string'
import {
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
} from '@/utils/user'

const EditNonProductivePage = ({ query }) => {
  const selectPayElements = (timesheet) => {
    return timesheet.nonProductivePayElements
  }

  const selectPayElementTypes = (payElementTypes) => {
    return payElementTypes
      .filter((pet) => pet.nonProductive && pet.selectable)
      .sort((a, b) => compareStrings(a.description, b.description))
  }

  return (
    <EditOperativePage
      query={query}
      tab="non-productive"
      selectPayElements={selectPayElements}
      selectPayElementTypes={selectPayElementTypes}
      component={EditNonProductive}
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

EditNonProductivePage.permittedRoles = [
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
]

export default EditNonProductivePage
