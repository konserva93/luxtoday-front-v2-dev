import cn from 'classnames'
import { useState, useEffect } from 'react'
import Svg from '@/components/Svg'
import s from './cookie.module.scss'

const CookieManager = () => {
  const [settingsAreOpen, openSettings] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [advertising, setAdvertising] = useState(true)
  const [cookiesAreAccepted, acceptCookies] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('COOKIE_ACCEPTED')) {
      acceptCookies(false)
    }
  }, [])

  const sendCookieSettingsToGTM = () => {
    const { dataLayer } = window as any
    if (dataLayer) {
      dataLayer.push({
        consent: 'default',
        analytics_storage: analytics ? 'allowed' : 'denied',
        ad_storage: advertising ? 'allowed' : 'denied',
      })
    }
  }

  const handleSubmit = () => {
    localStorage.setItem('COOKIE_ACCEPTED', '1')
    localStorage.setItem('COOKIE_ACCEPTED_ANALYTICS', analytics ? '1' : '0')
    localStorage.setItem('COOKIE_ACCEPTED_ADVERTISING', advertising ? '1' : '0')
    sendCookieSettingsToGTM()
    acceptCookies(true)
  }

  if (cookiesAreAccepted) {
    return null
  }

  return (
    <section
      className={cn(s.window, settingsAreOpen && s.window_settings)}
      role="dialog"
      aria-modal="false"
    >
      {!settingsAreOpen ? (
        <div className={s.info}>
          <div className={s.title}>Cookies managing</div>
          <p className={s.text}>We use cookies to provide the best site experience.</p>
          <button className={cn(s.button, s.button_black)} onClick={handleSubmit}>
            Accept All
          </button>
          <button className={s.button} onClick={() => openSettings(true)}>
            Cookie Settings
          </button>
        </div>
      ) : (
        <>
          <div className={cn(s.back, s.block)} onClick={() => openSettings(false)}>
            <Svg name="arrow" size={20} />
            <span>Cookies managing</span>
          </div>
          <div className={s.block}>
            <div className={s.settings__title}>Cookie Settings</div>
            <p className={s.settings__text}>
              Cookies necessary for the correct operation of the site are always enabled.
              <br />
              Other cookies are configurable.
            </p>
            <div className={s.settings__block}>
              <div className={s.settings__blockTop}>
                <span>- Essential cookies</span>
                <span className={cn(s.state, s.state_enabled)}>
                  <span className={s.state__text}>Always enabled</span>
                </span>
              </div>
              <p className={s.settings__blockText}>
                Always On. These cookies are essential so that you can use the website and use its
                functions. They cannot be turned off. They`re set in response to requests made by
                you, such as setting your privacy preferences, logging in or filling in forms.
              </p>
            </div>
            <div className={s.settings__block}>
              <div className={s.settings__blockTop}>
                <span>- Analytics cookies</span>
                <span className={cn(s.state, analytics && s.state_enabled)} data-type="analytics">
                  <span className={s.state__text}>{analytics ? 'Enabled' : 'Disabled'}</span>
                  <span className={s.stateButton} onClick={() => setAnalytics(!analytics)}></span>
                </span>
              </div>
              <p className={s.settings__blockText}>
                These cookies collect information to help us understand how our Websites are being
                used or how effective our marketing campaigns are, or to help us customise our
                Websites for you. See a list of the analytics cookies we use here.
              </p>
            </div>
            <div className={s.settings__block}>
              <div className={s.settings__blockTop}>
                <span>- Advertising cookies</span>
                <span
                  className={cn(s.state, advertising && s.state_enabled)}
                  data-type="advertising"
                >
                  <span className={s.state__text}>{advertising ? 'Enabled' : 'Disabled'}</span>
                  <span
                    className={s.stateButton}
                    onClick={() => setAdvertising(!advertising)}
                  ></span>
                </span>
              </div>
              <p className={s.settings__blockText}>
                These cookies provide advertising companies with information about your online
                activity to help them deliver more relevant online advertising to you or to limit
                how many times you see an ad. This information may be shared with other advertising
                companies. See a list of the advertising cookies we use here.
              </p>
            </div>
          </div>
          <div className={cn(s.block, s.actions)} onClick={handleSubmit}>
            <button className={cn(s.button, s.button_black)}>Confirm</button>
          </div>
        </>
      )}
    </section>
  )
}

export default CookieManager
