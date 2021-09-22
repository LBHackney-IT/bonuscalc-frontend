import { Factory } from 'fishery'

const operativeManagerUserFactory = Factory.define(() => ({
  name: 'An Operative Manager',
  email: 'an.operative_manager@hackney.gov.uk',
  roles: ['operative_manager'],
  hasRole: true,
  hasOperativeManagerPermissions: true,
}))

export const operativeManager = operativeManagerUserFactory.build()
