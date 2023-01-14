import 'next-i18next';
import common from './locales/ru/common.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ns1';
    resources: {
      common: typeof common;
    };
  };
};