import { PortableText } from '@portabletext/react'
import s from './bodyContent.module.scss'
import components from './components'

interface BodyContentProps {
  content: any
  children?: React.ReactNode
}

const BodyContent = ({ content, children }: BodyContentProps) => {
  return (
    <div className={s.wrapper}>
      {children || <PortableText value={content} components={components} />}
    </div>
  )
}

export default BodyContent
