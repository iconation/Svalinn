const langInfo = require("./lang-list");
const stringRel = require("./string-rel.json");
const englishJSON = require("./lang/english.json");
const spanishJSON = require("./lang/spanish.json");

function expandLangJSON(lang) {
  let expandedLang = {};
  for (let entry of Object.keys(lang)) {
    if (lang[entry].slice(0,7) === "STRING-") {
      expandedLang[entry] = lang[lang[entry]];
    } else {
      expandedLang[entry] = lang[entry];
    }
  }
  return expandedLang;
}

function createLangDict(base, langData) {
  // Creates language dictionary
  let dict = {};
  for (let entry of Object.keys(base)) {
    dict[entry] = {};
    for (let tag of Object.keys(base[entry])) {
      if (base[entry][tag]) {
      dict[entry][tag] = langData[base[entry][tag]];
      }
    }
  }
  return dict;
}

// TESTING
if (typeof require != 'undefined' && require.main == module) {
  let englishExpanded = expandLangJSON(englishJSON);
  let spanishExpanded = expandLangJSON(spanishJSON);
  let englishDict = createLangDict(stringRel, englishExpanded);
  let spanishDict = createLangDict(stringRel, spanishExpanded);
  console.log(englishDict);
  console.log("#########################################");
  console.log(spanishDict);
}

