import CookiesJS, { CookieAttributes } from 'js-cookie'
import Cookies from 'cookies'
import { IncomingMessage, ServerResponse } from 'http'

export const getCookieDomain = () => {
  if (
    process.env.NODE_ENV !== 'production' ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  ) {
    return undefined
  }
  return `.${process.env.HOSTNAME}`
}

export const setCookie = (name: string, value: string, options?: CookieAttributes) => {
  CookiesJS.set(name, value, {
    domain: getCookieDomain(),
    ...options,
  })
}

export const getCookie = (name: string, req?: IncomingMessage, res?: ServerResponse) => {
  if (req && res) {
    const cookies = new Cookies(req, res)
    return cookies.get(name)
  }
  const value = CookiesJS.get(name)
  return value === 'undefined' ? undefined : value
}

export const removeCookie = (name: string, req?: IncomingMessage, res?: ServerResponse) => {
  if (req && res) {
    const cookies = new Cookies(req, res)
    return cookies.set(name)
  } else {
    CookiesJS.remove(name, { domain: getCookieDomain() })
  }
}

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

export const random = (min: number, max: number): number => {
  const rand = min + Math.random() * (max + 1 - min)
  return Math.floor(rand)
}

export const formatPrice = (value: number) =>
  `${Math.round(value)}`.replace(/\d(?=(\d{3})+$)/g, '$& ')

export const scrollTo = (
  position: number | string,
  offset = 20,
  behavior: ScrollBehavior = 'smooth'
) => {
  let top
  switch (typeof position) {
    case 'number':
      top = position
      break
    case 'string':
      const element = document.querySelector(position) as HTMLElement
      top = element.getBoundingClientRect().top + window.pageYOffset
      break
    default:
      return
  }
  top -= offset
  window.scrollTo({ top, behavior })
}

export const makeLinkMirror = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  const buttonEl = document.getElementById(id) as HTMLButtonElement
  buttonEl.click()
}

export const getImageDimensions = (
  id: string
): { width: number; height: number; aspectRatio: number } => {
  const dimensions = id.split('-')[2]

  const [width, height] = dimensions.split('x').map((num: string) => parseInt(num, 10))
  const aspectRatio = width / height

  return { width, height, aspectRatio }
}

export const truncate = (text: string, n: number, withEllipsis: boolean = true) => {
  if (!text || text.length <= n) {
    return text
  }
  const subString = text.slice(0, n - 1)
  return subString.slice(0, subString.lastIndexOf(' ')) + (withEllipsis ? '...' : '')
}

export const getImageSize = (width: number, dimensions: { width: number; height: number }) => ({
  width,
  height: Math.round((dimensions.width / dimensions.height) * width),
})