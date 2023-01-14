import { useRef, useState } from 'react'
import Svg from '@/components/Svg'
import cn from 'classnames'

export interface InputTextProps {
  preffix?: React.ReactNode
  placeholder?: string
  onChange: (value: string) => void
  value: string
  mutators?: {
    clear?: () => void
  }
  styles: {
    wrapper: string
    wrapper_isFocused: string
    button?: string
    preffix?: string
    suffix?: string
  }
}

const InputText = (props: InputTextProps) => {
  const { preffix, placeholder, value, onChange, mutators, styles: s } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setFocused] = useState<boolean>(false)

  const handleWrapperClick = (e: React.MouseEvent) => {
    if (e.target !== inputRef.current) {
      inputRef.current!.focus()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)

  const handleObBlur = () => setFocused(false)

  const handleOnFocus = () => setFocused(true)

  return (
    <div
      className={cn(s.wrapper, { [s.wrapper_isFocused]: isFocused })}
      onClick={handleWrapperClick}
    >
      {preffix && <div className={s.preffix}>{preffix}</div>}
      <input
        type="text"
        ref={inputRef}
        placeholder={placeholder}
        onFocus={handleOnFocus}
        onBlur={handleObBlur}
        onChange={handleChange}
        value={value}
      />
      {mutators?.clear && value && (
        <div className={s.suffix}>
          <div role="button" onClick={mutators.clear} className={s.button}>
            <Svg name="cross" size={20} />
          </div>
        </div>
      )}
    </div>
  )
}

export default InputText
