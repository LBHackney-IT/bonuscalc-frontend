import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/en-gb'

dayjs.extend(function (o, c) {
  c.prototype.toISODate = function () {
    return this.format('YYYY-MM-DD')
  }
})

dayjs.locale('en-gb')

dayjs.extend(updateLocale)
dayjs.updateLocale('en-gb', {
  weekStart: 1,
})

export default dayjs
