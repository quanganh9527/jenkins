import enLang from "./entries/en-US";
import nlLang from "./entries/nl-NL";

const AppLocale = {
  EN: enLang,
  NL: nlLang
};

if (!Intl.PluralRules) {
  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/dist/locale-data/en");
  require("@formatjs/intl-pluralrules/dist/locale-data/nl");
}

if (!Intl.RelativeTimeFormat) {
  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/dist/locale-data/en");
  require("@formatjs/intl-relativetimeformat/dist/locale-data/nl");
}

export default AppLocale;
