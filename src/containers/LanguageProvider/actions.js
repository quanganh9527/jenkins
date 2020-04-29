import {
  CHANGE_LOCALE, RECEIVE_LOCALE
} from './constants';

export const languageActions = {
  setLocale,
  changeLocale,
};

function setLocale(locale) {
  return { type: RECEIVE_LOCALE, data: locale };
}

function changeLocale(locale) {
  return { type: CHANGE_LOCALE, locale };
}