import cn from 'classnames'
import Image from 'next/image'
import { imageBuilder } from '@/api/sanity'
import { getImageDimensions } from '@/utils/helpers'
import gallery from '@/themes/default/styled/Gallery/gallery.module.scss'
import s from './components.module.scss'

interface ImageProps {
  value: {
    asset?: any
    image?: any
    alt?: string
    caption?: string
    _type: 'interviewInlineImage' | 'image'
  }
}

const image = ({ value }: ImageProps) => {
  const asset = value.asset || value.image?.asset
  if(!asset) {
    return null
  }
  const imageId = asset._ref
  const { aspectRatio } = getImageDimensions(imageId)

  switch (value._type) {
    case 'interviewInlineImage':
      return (
        <Image
          src={imageBuilder.image(imageId).url()}
          width={420}
          height={420 / aspectRatio}
          alt={value.image.alt}
          className={cn(s.image, s.image_left)}
        />
      )
    default:
      const { alt, caption } = value
      return (
        <div className={cn(gallery.image, s.image)}>
          <Image
            src={imageBuilder.image(imageId).url()}
            width={860}
            height={860 / aspectRatio}
            alt={alt || caption || ''}
          />
          {caption ? <div className={gallery.image__caption}>{caption}</div> : null}
        </div>
      )
  }
}

export default image
