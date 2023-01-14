import { PortableText } from '@portabletext/react'
import cn from 'classnames'
import Svg from '@/components/Svg'
import marks from './marks'
import s from './components.module.scss'

interface QuoteProps {
  value: {
    text: any
    url?: string
    _type:
      | 'interviewWhiteQuote'
      | 'interviewBlueQuote'
      | 'guideArticleQuoteWithLink'
      | 'guideArticleBlueQuote'
  }
}

const quote = ({ value }: QuoteProps) => {
  const { text, _type, url } = value

  return (
    <div className={cn(s.quote, s[`quote_${_type}`])}>
      <Svg name="quote" size={20} className={s.quote__icon} />
      <PortableText value={text} components={{ marks }} />
      <Svg name="quote" size={20} className={s.quote__icon} />
      {url && (
        <div className={s.quote__link}>
          <a href={url} rel="nofolow noreferrer" target="_blank">
            {url}
          </a>
        </div>
      )}
    </div>
  )
}

export default quote
