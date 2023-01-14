import { useTranslation } from 'next-i18next'
import { useState, ReactNode, useRef, useEffect } from 'react'
import Svg from '@/components/Svg'

interface CopyButtonProps {
  children: ReactNode
  text: string
  success?: string
  error?: string
  styles: {
    wrapper: string
    icon: string
  }
}

const copyTextToClipboard = (text: string): boolean => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    return true
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  let successful
  try {
    successful = document.execCommand('copy')
  } catch (err) {
    successful = false
  }

  document.body.removeChild(textArea)
  return successful
}

const CopyButton = (props: CopyButtonProps) => {
  const { children, text, success, error, styles: s } = props
  const { t } = useTranslation()
  const [status, setStatus] = useState<string>()
  const timerId = useRef<ReturnType<typeof setTimeout>>()

  const clearTimer = () => clearTimeout(timerId.current)
  useEffect(() => clearTimer, [])

  const handleClick = () => {
    clearTimer()
    if (copyTextToClipboard(text)) {
      setStatus(success || t('copySuccess'))
    } else {
      setStatus(error || t('copyError'))
    }
    timerId.current = setTimeout(() => setStatus(undefined), 2000)
  }

  return (
    <button onClick={handleClick} className={s.wrapper}>
      <Svg name="copy" size={12} className={s.icon} />
      {status || children}
    </button>
  )
}

export default CopyButton
