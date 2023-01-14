import { useState, useEffect } from 'react'
import cn from 'classnames'
import { useTranslation } from 'next-i18next'
import Svg from '@/components/Svg'
import CopyButton from '@/components/CopyButton'
import commonStyles from '@/styles/common.module.scss'
import { button } from '@/themes/default'
import Source, { SourceProps } from '../Source'
import s from './postFooter.module.scss'

interface InfoItem extends SourceProps {
  label: string
  url?: string
}

interface PostFooterProps {
  info: InfoItem[]
}

const PostFooter = ({ info }: PostFooterProps) => {
  const { t } = useTranslation()
  const [copyUrl, setCopyUrl] = useState('')

  useEffect(() => {
    setCopyUrl(window.location.href)
  }, [])

  const handleShareClick = (name: string) => {
    const utmMedium = window.location.pathname.startsWith('/guide/') ? 'article' : 'news'
    let url
    switch (name) {
      case 'facebook':
        url = `https://www.facebook.com/sharer.php?u=${encodeURI(
          window.location.href + `?utm_medium=${utmMedium}&utm_source=Social_FB&utm_content=share`
        )}`
        break
      case 'telegram':
        url = `https://telegram.me/share/url?url=${encodeURI(window.location.href+`?utm_medium=${utmMedium}&utm_source=Social_TG&utm_content=share`)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURI(window.location.href)}`
        break
    }
    window.open(url, '', 'width=730,height=560')
  }

  return (
    <div className={s.wrapper}>
      <div className={s.share}>
        <div className={s.share__links}>
          <span>{t('share')}:</span>
          <button onClick={handleShareClick.bind(null, 'facebook')}>
            <Svg name="facebook" size={24} className={commonStyles.facebook} />
          </button>
          <button onClick={handleShareClick.bind(null, 'telegram')}>
            <Svg name="telegram" size={24} className={commonStyles.telegram} />
          </button>
          {/* <button>
            <Svg name="instagram" size={24} className={commonStyles.instagram} />
          </button> */}
          <button onClick={handleShareClick.bind(null, 'twitter')}>
            <Svg name="twitter" size={24} className={commonStyles.twitter} />
          </button>
        </div>
        <CopyButton
          text={copyUrl}
          styles={{
            wrapper: cn(button.primary, button.primary_small),
            icon: button.icon_left,
          }}
        >
          {t('copyLink')}
        </CopyButton>
      </div>
      <ul className={s.info}>
        {info.map((item, i) => (
          <li key={i}>
            <div className={s.infoLabel}>{t(item.label)}:</div>
            {item.url ? (
              <a href={item.url} target="_blank" rel="nofollow noreferrer">
                <Source {...item} />
              </a>
            ) : (
              <Source {...item} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PostFooter
