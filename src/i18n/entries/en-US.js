import enMessages from "../locales/en_US.json";

//test

// Object.keys(enMessages).map(key => {
//   enMessages[key] = "## " + enMessages[key];
// });

//end Test


const EnLang = {
  messages: {
    ...enMessages
  },
  locale: "en-US"
};

export default EnLang;
