import EditOperativePage from '@/components/EditOperativePage'
import EditOvertime from '@/components/EditOvertime'
import { compareStrings } from '@/utils/string'
import { OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE } from '@/utils/user'

const EditOvertimePage = ({ query }) => {
  const selectPayElements = (timesheet) => {
    return timesheet.sortedOvertimeHours
  }

  const selectPayElementTypes = (payElementTypes) => {
    return payElementTypes
      .filter((pet) => pet.overtime && pet.selectable)
      .sort((a, b) => compareStrings(a.description, b.description))
  }

  return (
    <EditOperativePage
      query={query}
      tab="overtime"
      selectPayElements={selectPayElements}
      selectPayElementTypes={selectPayElementTypes}
      component={EditOvertime}
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

EditOvertimePage.permittedRoles = [OPERATIVE_MANAGER_ROLE, WEEK_MANAGER_ROLE]

export default EditOvertimePage
