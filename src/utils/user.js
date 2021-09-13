export const OPERATIVE_MANAGER_ROLE = 'operative_manager'

export const buildUser = (name, email, authServiceGroups) => {
  const { OPERATIVE_MANAGERS_GOOGLE_GROUPNAME } = process.env

  const rolesFromGroups = (groupNames) => {
    return groupNames.map((groupName) => {
      if (isOperativeManagerGroupName(groupName)) {
        return OPERATIVE_MANAGER_ROLE
      }

      console.log(`User group name not recognised: ${groupName}`)
    })
  }

  const isOperativeManagerGroupName = (groupName) =>
    groupName === OPERATIVE_MANAGERS_GOOGLE_GROUPNAME

  const groupNames = authServiceGroups.filter((groupName) =>
    isOperativeManagerGroupName(groupName)
  )

  const roles = rolesFromGroups(groupNames)

  const hasRole = (r) => roles.includes(r)

  return {
    name: name,
    email: email,
    roles: roles,
    hasRole: hasRole,
    hasOperativeManagerPermissions: hasRole(OPERATIVE_MANAGER_ROLE),
    hasAnyPermissions: roles.length > 0,
  }
}
