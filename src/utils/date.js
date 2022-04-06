import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isoWeek from 'dayjs/plugin/isoWeek'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import updateLocale from 'dayjs/plugin/updateLocale'
import 'dayjs/locale/en-gb'

dayjs.extend(function (o, c) {
  c.prototype.toISODate = function () {
    return this.format('YYYY-MM-DD')
  }
})

dayjs.locale('en-gb')

dayjs.extend(duration)
dayjs.extend(isoWeek)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(updateLocale)
dayjs.updateLocale('en-gb', {
  weekStart: 1,
})

export default dayjs
