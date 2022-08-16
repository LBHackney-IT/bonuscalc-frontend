export const isEditable = (operative, week, period, user) => {
  if (operative.isArchived || period.isClosed) {
    return false
  }

  if (user.hasWeekManagerPermissions) {
    return true
  }

  return week.isEditable
}
