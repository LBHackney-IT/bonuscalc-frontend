export const OPERATIVE_MANAGER_ROLE = 'operative_manager'
export const WEEK_MANAGER_ROLE = 'week_manager'
export const AUTHORISATIONS_MANAGER_ROLE = 'authorisations_manager'

export const buildUser = (name, email, authServiceGroups) => {
  const {
    OPERATIVE_MANAGERS_GOOGLE_GROUPNAME,
    WEEK_MANAGERS_GOOGLE_GROUPNAME,
    AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME,
  } = process.env

  const rolesFromGroups = (groupNames) => {
    return groupNames.map((groupName) => {
      if (isOperativeManagerGroupName(groupName)) {
        return OPERATIVE_MANAGER_ROLE
      } else if (isWeekManagerGroupName(groupName)) {
        return WEEK_MANAGER_ROLE
      } else if (isAuthorisationsManagerGroupName(groupName)) {
        return AUTHORISATIONS_MANAGER_ROLE
      }

      console.log(`User group name not recognised: ${groupName}`)
    })
  }

  const isOperativeManagerGroupName = (groupName) =>
    groupName === OPERATIVE_MANAGERS_GOOGLE_GROUPNAME

  const isWeekManagerGroupName = (groupName) =>
    groupName === WEEK_MANAGERS_GOOGLE_GROUPNAME

  const isAuthorisationsManagerGroupName = (groupName) =>
    groupName === AUTHORISATION_MANAGERS_GOOGLE_GROUPNAME

  const groupNames = authServiceGroups.filter(
    (groupName) =>
      isOperativeManagerGroupName(groupName) ||
      isWeekManagerGroupName(groupName) ||
      isAuthorisationsManagerGroupName(groupName)
  )

  const roles = rolesFromGroups(groupNames)

  const hasRole = (r) => roles.includes(r)

  return {
    name: name,
    email: email,
    roles: roles,
    hasRole: hasRole,
    hasOperativeManagerPermissions: hasRole(OPERATIVE_MANAGER_ROLE),
    hasWeekManagerPermissions: hasRole(WEEK_MANAGER_ROLE),
    hasAuthorisationsManagerPermissions: hasRole(AUTHORISATIONS_MANAGER_ROLE),
    hasAnyPermissions: roles.length > 0,
  }
}
