const fs = require("fs");
const langConfig = require("./lang-config.json");
const stringRel = require("./string-rel.json");
const englishJSON = require("./lang/english.json");
const spanishJSON = require("./lang/spanish.json");
const langOrder = langConfig["order"];

// const filePath = "./lang/";

let _DICT_EXIST = false;

// Check if dictionary is already created
if (fs.existsSync("./dictionary.json")) {
  _DICT_EXIST = true;
}

// if the dictionary doesnt exists already
if (!_DICT_EXIST) {
  let englishExpanded = expandLangJSON(englishJSON);
  let spanishExpanded = expandLangJSON(spanishJSON);
  let englishDict = createLangDict(stringRel, englishExpanded);
  let spanishDict = createLangDict(stringRel, spanishExpanded);

  // List with all the individual language dictionaries
  // Modify this to add more languages to the dictionary
  // the languages needs to be added in the order that appears
  // in langOrder
  let languageList = [englishDict, spanishDict];

  // create language dictionary
  let i18nDict = createDictionary(languageList);

  // saving dictionary as a json file
  fs.writeFile("dictionary.json", i18nDict, (err) => {
    if (err) {console.log(err)};
    console.log("dictionary saved to file");
  //let langOrder = ["English", "Espa\u00F1ol"];
  });
}

///////////////////////////////////////////////////////
// Function declarations
function createDictionary(langList) {
  // this functions takes all the individual language dictionaries
  // and puts them together
  let dictionary = {};
  for (let i = 0; i < langList.length; i++) {
    dictionary[langOrder[i]] = JSON.parse(JSON.stringify(langList[i]));
  }
  return JSON.stringify(dictionary);
}

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

/////////////////////////////////////////////////////////////////
// TESTING
// this code will only run if the file is called directly from a terminal with node
if (typeof require != 'undefined' && require.main == module) {
  console.log("file executed from console");
  console.log(langConfig.order);
}

