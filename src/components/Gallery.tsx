import Slider from 'react-slick'
import Image from 'next/image'
import type { Settings } from 'react-slick'
import Svg from './Svg'
import type { MouseEventHandler } from 'react'

interface Image {
  url: string
  width: number
  height: number
  alt: string
}

export interface GalleryProps {
  images: Image[]
  settings?: Settings
  styles: {
    wrapper: string
    image: string
    image__caption: string
    next: string
    prev: string
  }
}

interface ArrowProps {
  onClick?: MouseEventHandler
  variant: string
}

const Arrow = ({ onClick, variant }: ArrowProps) => (
  <button className={variant} onClick={onClick}>
    <Svg name="arrow" size={48} />
  </button>
)

const Gallery = (props: GalleryProps) => {
  const { images, styles: s, settings } = props
  const defaultSettings: Settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    prevArrow: <Arrow variant={s.prev} />,
    nextArrow: <Arrow variant={s.next} />,
    dots: false,
  }

  return (
    <div className={s.wrapper}>
      <Slider {...defaultSettings} {...settings}>
        {images.map(({ url, width, height, alt }) => (
          <div key={url} className={s.image}>
            <Image src={url} width={width} height={height} alt={alt} />
            <div className={s.image__caption}>{alt}</div>
          </div>
        ))}
      </Slider>
      <style global jsx>{`
        .slick-list,
        .slick-slider,
        .slick-track {
          position: relative;
          display: block;
        }
        .slick-loading .slick-slide,
        .slick-loading .slick-track {
          visibility: hidden;
        }
        .slick-slider {
          box-sizing: border-box;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -khtml-user-select: none;
          -ms-touch-action: pan-y;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
        }
        .slick-list {
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        .slick-list:focus {
          outline: 0;
        }
        .slick-list.dragging {
          cursor: pointer;
          cursor: hand;
        }
        .slick-slider .slick-list,
        .slick-slider .slick-track {
          -webkit-transform: translate3d(0, 0, 0);
          -moz-transform: translate3d(0, 0, 0);
          -ms-transform: translate3d(0, 0, 0);
          -o-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }
        .slick-track {
          top: 0;
          left: 0;
        }
        .slick-track:after,
        .slick-track:before {
          display: table;
          content: '';
        }
        .slick-track:after {
          clear: both;
        }
        .slick-slide {
          display: none;
          float: left;
          height: 100%;
          min-height: 1px;
        }
        [dir='rtl'] .slick-slide {
          float: right;
        }
        .slick-slide img {
          display: block;
        }
        .slick-slide.slick-loading img {
          display: none;
        }
        .slick-slide.dragging img {
          pointer-events: none;
        }
        .slick-initialized .slick-slide {
          display: block;
        }
        .slick-vertical .slick-slide {
          overflow: hidden;
          display: block;
          height: auto;
          border: 1px solid transparent;
        }
        .slick-arrow.slick-hidden {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Gallery
