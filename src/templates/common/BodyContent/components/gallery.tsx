import Gallery from '@/themes/default/styled/Gallery'
import { imageBuilder } from '@/api/sanity'

const gallery = ({ value }: any) => {
  const images = value.images.map(({ alt, asset: { _ref: id } }: any) => ({
    url: imageBuilder.image(id).width(860*2).height(448*2).url(),
    width: 860,
    height: 448,
    alt,
  }))
  return <Gallery images={images} />
}

export default gallery