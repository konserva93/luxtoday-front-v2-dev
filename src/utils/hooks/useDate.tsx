import { Fragment } from 'react'
import moment from 'moment'
import useMedia from '@/utils/hooks/useMedia'

type DateFormat = 'default' | 'day' | 'fromNow' | 'full'

const useDate = () => {
  const isMobile = useMedia({ maxWidth: 768 })

  const format = (rawDate: string | Date, format: DateFormat = 'default') => {
    const date = moment(rawDate).utcOffset(60)
    switch (format) {
      case 'day':
        return (
          <Fragment>
            {date.format('D MMMM')}, <span>{date.format('dddd')}</span>
          </Fragment>
        )
      case 'full': 
          return date.format(`D MMM${isMobile ? '' : 'M'} YYYY, HH:mm`)
      case 'fromNow':
        return moment().diff(date, 'hours') > 20
          ? date.format(`D MMM${isMobile ? '' : 'M'} YYYY, HH:mm`)
          : date.fromNow()
      case 'default':
        return date.format('D MMMM YYYY')
      default:
        const unknownFormat: never = format
        throw new Error(`Unknown date format ${unknownFormat}`)
    }
  }

  return format
}

export default useDate
