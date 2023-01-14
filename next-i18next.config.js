const path = require('path')

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
  },
  fallbackLng: {},
  localePath: path.resolve('./locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
