import { Fragment } from 'react'
import Tooltip from '@/themes/default/styled/Tooltip'

const placeholder = (props: any) => (
  <Fragment>
    <Tooltip eventType="click" text={props.value.text}>{props.children}</Tooltip>{' '}
  </Fragment>
)

const link = ({ value, text }: any) => (
  <a href={value.href} rel="nofollow noreferrer">
    {text}
  </a>
)

const marks = {
  placeholder,
  link,
}

export default marks
