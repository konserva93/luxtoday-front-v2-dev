import sprite from 'svg-sprite-loader/runtime/sprite.build'

type SvgProps = React.SVGProps<SVGSVGElement> & {
  name: string,
  size?: number,
}

const Svg: React.FC<SvgProps> = props => {
  const { className, name, size, width, height, ...rest } = props
  try {
    const symbol = require(`@/images/icons/${name}.svg`)
    sprite.add(symbol.default)
    return (
      <svg
        viewBox={symbol.viewBox}
        className={className}
        width={size || width}
        height={size || height}
        {...rest}
      >
        <use xlinkHref={`#${name}`}></use>
      </svg>
    )
  } catch(e) {
    console.error(`'${name}' icon does not exist`)
    return null
  }
}

export default Svg