import { DefaultSeo } from 'next-seo'
import { useTranslation } from 'next-i18next'

const SeoConfig = () => {
  const { t } = useTranslation()
  
  return (
    <DefaultSeo 
      titleTemplate={t('seo.template')}
      description={t('seo.description')}
      openGraph={{
        locale: t('seo.locale'),
        site_name: t('seo.siteName'),
        description: t('seo.description'),
      }}
    />
  )
}

export default SeoConfig