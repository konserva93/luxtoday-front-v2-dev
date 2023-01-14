import { PortableText } from '@portabletext/react'
import cn from 'classnames'
import marks from './marks'
import s from './components.module.scss'

interface HighlightProps {
  value: {
    text: any
    _type:
      | 'interviewBlueHighlight'
      | 'interviewYellow'
      | 'interviewYellowLamp'
      | 'guideArticleImportant'
  }
}

const highlight = ({ value }: HighlightProps) => {
  const { text, _type } = value
  return (
    <div className={cn(s.highlight, s[`highlight_${_type}`])}>
      <PortableText value={text} components={{ marks }} />
    </div>
  )
}

export default highlight
