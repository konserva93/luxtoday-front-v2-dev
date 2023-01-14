import { ComponentType, useMemo } from 'react'

export interface ComponentStyles {
  [key: string]: string
}

function withStyles<T extends { styles: ComponentStyles }>(
  Component: ComponentType<T>,
  baseClasses: ComponentStyles
) {
  const displayName = Component.displayName || Component.name || 'Component'

  type StyledComponentProps = Omit<T, 'styles'> & {
    composeMode?: 'override' | 'merge'
    styles?: Partial<T['styles']>
  }

  const StyledComponent = ({
    composeMode = 'override',
    styles = {},
    ...props
  }: StyledComponentProps) => {
    const getTheme = () => {
      switch (composeMode) {
        case 'override':
          return { ...baseClasses, ...styles }
        case 'merge':
          return Object.keys(baseClasses).reduce<ComponentStyles>((theme, name) => {
            theme[name] = baseClasses[name] + (styles[name] ? ` ${styles[name]}` : '')
            return theme
          }, {})
      }
    }

    const theme = useMemo(getTheme, [])

    Component.displayName = `withStyles(${displayName})`

    return <Component {...(props as any)} styles={theme} />
  }

  return StyledComponent
}

export default withStyles
