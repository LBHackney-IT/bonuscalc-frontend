import { Attr, Model, SpraypaintBase } from 'spraypaint'

@Model({ baseUrl: '', apiNamespace: '/api/v1' })
class ApplicationRecord extends SpraypaintBase {}

@Model({ jsonapiType: 'operatives' })
class Operative extends ApplicationRecord {
  @Attr name
  @Attr trade
  @Attr section
  @Attr scheme
  @Attr salaryBand
  @Attr fixedBand
}

export { Operative }
