import EditOperativePage from '@/components/EditOperativePage'
import EditOutOfHours from '@/components/EditOutOfHours'
import { PayElement } from '@/models'
import { compareStrings } from '@/utils/string'
import {
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
} from '@/utils/user'

const EditOutOfHoursPage = ({ query }) => {
  const selectPayElements = (timesheet) => {
    if (timesheet.hasOutOfHoursRota) {
      return timesheet.outOfHoursRota
    } else {
      return [PayElement.outOfHoursRota]
    }
  }

  const selectPayElementTypes = (payElementTypes) => {
    return payElementTypes
      .filter((pet) => pet.outOfHours && pet.selectable)
      .sort((a, b) => compareStrings(a.description, b.description))
  }

  return (
    <EditOperativePage
      query={query}
      tab="out-of-hours"
      selectPayElements={selectPayElements}
      selectPayElementTypes={selectPayElementTypes}
      component={EditOutOfHours}
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

EditOutOfHoursPage.permittedRoles = [
  OPERATIVE_MANAGER_ROLE,
  WEEK_MANAGER_ROLE,
  AUTHORISATIONS_MANAGER_ROLE,
]

export default EditOutOfHoursPage
