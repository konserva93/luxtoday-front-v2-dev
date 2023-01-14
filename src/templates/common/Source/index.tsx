import { Fragment } from 'react'
import { Asset, Image as ImageType } from '@/api/posts'
import Image from 'next/image'
import { imageBuilder } from '@/api/sanity'
import s from './source.module.scss'

export interface SourceProps {
  avatar?: string | Asset | ImageType
  logo?: string | Asset | ImageType
  logoDimensions?: { width: number; height: number }
  title?: string
  content?: React.ReactNode
}

const Source = ({ title, logo, logoDimensions, avatar, content }: SourceProps) => (
  <Fragment>
    {logo && (
      <Image
        src={imageBuilder.image(logo).height(25).url()}
        height={25}
        width={Math.round((25 * logoDimensions!.width) / logoDimensions!.height)}
        alt={title || ''}
      />
    )}

    {avatar && (
      <div className={s.avatar}>
        <Image
          src={imageBuilder.image(avatar).width(60).height(60).url()}
          width={30}
          height={30}
          alt={title || ''}
        />
      </div>
    )}

    {!logo && (title || content)}
  </Fragment>
)

export default Source
