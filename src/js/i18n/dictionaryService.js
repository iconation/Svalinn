//////////////////////////////////////////////////////////////
// This file is for the creation of the language dictionary.//
// Once a new language file is added to the 'lang' folder   //
// this file should be modified to add said language and    //
// create the new language dictionary for the app.          //
//////////////////////////////////////////////////////////////
const fs = require("fs");
const langConfig = require("./lang-config.json");
const stringRel = require("./string-rel.json");
const englishJSON = require("./lang/english.json");
const spanishJSON = require("./lang/spanish.json");
const frenchJSON = require("./lang/french.json");
const langOrder = langConfig["order"];

// const filePath = "./lang/";

let _DICT_EXIST = false;

// Check if dictionary is already created
if (fs.existsSync("./src/js/i18n/dictionary.json")) {
  _DICT_EXIST = true;
}

let englishExpanded = expandLangJSON(englishJSON);
let spanishExpanded = expandLangJSON(spanishJSON);
let frenchExpanded = expandLangJSON(frenchJSON);
let englishDict = createLangDict(stringRel, englishExpanded);
let spanishDict = createLangDict(stringRel, spanishExpanded);
let frenchDict = createLangDict(stringRel, frenchExpanded);

// List with all the individual language dictionaries
// Modify this to add more languages to the dictionary
// the languages needs to be added in the order that appears
// in langOrder
let languageList = [englishDict, spanishDict, frenchDict];

// create language dictionary
let i18nDict = createDictionary(languageList);

// saving dictionary as a json file
fs.writeFile("./src/js/i18n/dictionary.json", i18nDict, (err) => {
  if (err) {console.log(err)};
  console.log("dictionary saved to file");
//let langOrder = ["English", "Espa\u00F1ol"];
});

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

