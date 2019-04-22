const langInfo = require("./lang-list");
const englishJSON = require("./lang/english.json");
const langList = [englishJSON];

// the following is a relation object for the text strings in the app
const dataTemplate = {
  // src/html/welcome.html
  "#welcome-text-1": {
    "text": "STRING-101", 
    "tag": false,
  },
  "#welcome-text-2": {
    "text": "STRING-102", 
    "tag": false,
  },
  "#welcome-text-3": {
    "text": "STRING-103", 
    "tag": true,
    "title": "STRING-104"
  },
  "#welcome-text-4": {
    "text": "STRING-105",
    "tag": true,
    "title": "STRING-106"
  },
  "#welcome-text-5": {
    "text": "STRING-107",
    "tag": true,
    "title": "STRING-108"
  },
  // src/html/about.html
  "#about-text-1": {
    "text": "STRING-109",
    "tag": false
  },
  "#about-text-2": {
    "text": "STRING-110",
    "tag": false
  },
  "#about-text-3": {
    "text": false,
    "tag": true,
    "title": "STRING-111"
  },
  "#about-text-4": {
    "text": "STRING-112",
    "tag": false
  },
  // src/html/address_book_add.html
  "#address-add-text-1": {
    "text": "STRING-113", 
    "tag": false
  },
  "#address-add-text-2": {
    "text": "STRING-114",
    "tag": false
  },
  "#address-add-text-3": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-115", 
  },
  "#address-add-text-4": {
    "text": "STRING-116",
    "tag": false
  },
  "#address-add-text-5": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-117",
  },
  "#address-add-text-6": {
    "text": "STRING-118",
    "tag": false
  },
  "#address-add-text-7": {
    "text": "STRING-119",
    "tag": false
  },
  // src/html/address_book.html
  "#address-book-text-1": {
    "text": "STRING-120",
    "tag": false
  },
  "#address-book-text-2": {
    "text": "STRING-121",
    "tag": false
  },
  "#address-book-text-3": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-122"
  },
  "#address-book-text-4": {
    "text": "STRING-123",
    "tag": false
  },
  "#address-book-text-5": {
    "text": "STRING-124",
    "tag": false
  },
  "#address-book-text-6": {
    "text": false,
    "tag": true,
    "title": "STRING-125"
  },
  "#address-book-text-7": {
    "text": "STRING-126",
    "tag": false
  },
  "#address-book-text-8": {
    "text": "STRING-127",
    "tag": false,
  },
  // src/html/create_transaction.html
  "#create-text-1": {
    "text": "STRING-128",
    "tag": false
  },
  "#create-text-2": {
    "text": "STRING-129",
    "tag": false
  },
  "#create-text-3": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-130"
  },
  "#create-text-4": {
    "text": "STRING-131",
    "tag": false
  },
  "#create-text-5": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-132"
  },
  "#create-text-6": {
    "text": "STRING-133",
    "tag": false
  },
  "#create-text-7": {
    "text": "STRING-134", 
    "tag": false
  },
  "create-text-8": {
    "text": false,
    "tag": true,
    "title": "STRING-135" 
  },
  "#create-text-9": {
    "text": "STRING-136", 
    "tag": false
  },
  "#create-text-10": {
    "text": false,
    "tag": true,
    "title": "STRING-137"
  },
  "#create-text-11": {
    "text": "STRING-138",
    "tag": false
  },
  "#create-text-12": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-139"
  },
  "#create-text-13": {
    "text": "STRING-140",
    "tag": false
  },
  "#create-text-14": {
    "text": "STRING-141",
    "tag": false
  },
  "#create-text-15": {
    "text": "STRING-142",
    "tag": false
  },
  "#create-text-16": {
    "text": "STRING-143",
    "tag": false
  },
  "#create-text-17": {
    "text": "STRING-144", 
    "tag": false
  },
  "#create-text-18": {
    "text": "STRING-145",
    "tag": false
  },
  // src/html/index.html
  "#index-text-1": {
    "text": "STRING-146", 
    "tag": false
  },
  "#index-text-2": {
    "text": false,
    "tag": true,
    "title": "STRING-147"
  },
  "#index-text-2-1": {
    "text": "STRING-148",
    "tag": false
  },
  "#index-text-3": {
    "text": false,
    "tag": true,
    "title": "STRING-149"
  },
  "#index-text-4": {
    "text": "STRING-150",
    "tag": false
  },
  "#index-text-5": {
    "text": false,
    "tag": true,
    "title": "STRING-151"
  },
  "#index-text-6": {
    "text": "STRING-152",
    "tag": false
  },
  "#index-text-7": {
    "text": false,
    "tag": true,
    "title": "STRING-153"
  },
  "#index-text-8": {
    "text": "STRING-154",
    "tag": false
  },
  "#index-text-9": {
    "text": false,
    "tag": true,
    "title": "STRING-155"
  },
  "#index-text-10": {
    "text": false,
    "tag": true,
    "title": "STRING-156"
  },
  "#index-text-11": {
    "text": false,
    "tag": true,
    "title": "STRING-157"
  },
  "#index-text-12": {
    "text": false,
    "tag": true,
    "title": "STRING-158"
  },
  // src/html/overview_create.html
  "#overview-create-text-1": {
    "text": "STRING-159",
    "tag": false
  },
  "#overview-create-text-2": {
    "text": "STRING-160",
    "tag": false
  },
  "#overview-create-text-3": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-161"
  },
  "#overview-create-text-4": {
    "text": "STRING-162",
    "tag": false
  },
  "#overview-create-text-5": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-163"
  },
  "#overview-create-text-6": {
    "text": "STRING-164",
    "tag": false
  },
  "#overview-create-text-7": {
    "text": "STRING-165",
    "tag": false
  },
  // src/html/overview.html
  "#overview-text-1": {
    "text": "STRING-166",
    "tag": false
  },
  "#overview-text-2": {
    "text": false,
    "tag": true,
    "title": "STRING-167"
  },
  "#overview-text-3": {
    "text": "STRING-168",
    "tag": false
  },
  "#overview-text-4": {
    "text": false,
    "tag": true,
    "title": "STRING-169"
  },
  "#overview-text-5": {
    "text": "STRING-170", 
    "tag": false
  },
  "#overview-text-6": {
    "text": "STRING-171",
    "tag": false
  },
  "#overview-text-7": {
    "text": "STRING-172",
    "tag": false
  },
  "#overview-text-8": {
    "text": "STRING-173",
    "tag": false
  },
  "#overview-text-9": {
    "text": "STRING-174",
    "tag": true,
    "title": "STRING-175"
  },
  "#overview-text-10": {
    "text": "STRING-176",
    "tag": true,
    "title": "STRING-177"
  },
  // src/html/overview_import_key.html
  "#overview-import-text-1": {
    "text": "STRING-178",
    "tag": false
  },
  "#overview-import-text-2": {
    "text": "STRING-179",
    "tag": false
  },
  "#overview-import-text-3": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-180"
  },
  "#overview-import-text-4": {
    "text": "STRING-181",
    "tag": false
  },
  "#overview-import-text-5": {
    "text": false,
    "tag": true,
    "title": "STRING-182",
    "placeholder": "STRING-183"
  },
  "#overview-import-text-6": {
    "text": "STRING-184",
    "tag": false
  },
  "#overview-import-text-7": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-185"
  },
  "#overview-import-text-8": {
    "text": "STRING-186",
    "tag": false
  },
  "#overview-import-text-9": {
    "text": "STRING-187",
    "tag": false
  },
  // src/html/overview_load.html
  "#overview-load-text-1": {
    "text": "STRING-188",
    "tag": false
  },
  "#overview-load-text-2": {
    "text": "STRING-189",
    "tag": false
  },
  "#overview-load-text-3": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-190"
  },
  "#overview-load-text-4": {
    "text": "STRING-191",
    "tag": false
  },
  "#overview-load-text-5": {
    "text": "STRING-192",
    "tag": false
  },
  // src/html/overview_show.html
  "#overview-show-text-1": {
    "text": "STRING-193",
    "tag": false
  },
  "#overview-show-text-2": {
    "text": "STRING-194",
    "tag": false
  },
  "#overview-show-text-3": {
    "text": "STRING-195",
    "tag": false
  },
  "#overview-show-text-4": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-196"
  },
  "#overview-show-text-5": {
    "text": "STRING-197",
    "tag": false
  },
  "#overview-show-text-6": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-198"
  },
  "#overview-show-text-7": {
    "text": "STRING-199",
    "tag": false
  },
  "#overview-show-text-8": {
    "text": "STRING-200",
    "tag": false
  },
  "#overview-show-text-9": {
    "text": "STRING-201",
    "tag": false
  },
  // src/html/send_transaction.html
  "#send-text-1": {
    "text": "STRING-202",
    "tag": false
  },
  "#send-text-2": {
    "text": "STRING-203",
    "tag": false
  },
  "#send-text-3": {
    "text": false,
    "tag": true,
    "placeholder": "STRING-204"
  },
  "#send-text-4": {
    "text": "STRING-205", 
    "tag": false
  },
  "#send-text-5": {
    "text": false,
    "tag": true,
    "title": "STRING-206"
  },
  "#send-text-6": {
    "text": "STRING-207",
    "tag": false
  },
  "#send-text-7": {
    "text": "STRING-208",
    "tag": false
  },
  // src/html/shortcuts.html
  "#shortcuts-text-1": { 
    "text": "STRING-209", 
    "tag": false
  },
  "#shortcuts-text-2": { 
    "text": "STRING-210", 
    "tag": false
  },
  "#shortcuts-text-3": { 
    "text": "STRING-211", 
    "tag": false
  },
  "#shortcuts-text-4": { 
    "text": "STRING-212", 
    "tag": false
  },
  "#shortcuts-text-5": { 
    "text": "STRING-213", 
    "tag": false
  },
  "#shortcuts-text-6": { 
    "text": "STRING-214", 
    "tag": false
  },
  "#shortcuts-text-7": { 
    "text": "STRING-215", 
    "tag": false
  },
  "#shortcuts-text-8": { 
    "text": "STRING-216", 
    "tag": false
  },
  "#shortcuts-text-9": { 
    "text": "STRING-217", 
    "tag": false
  },
  "#shortcuts-text-10": { 
    "text": "STRING-218",
    "tag": false
  },
  "#shortcuts-text-11": { 
    "text": "STRING-219", 
    "tag": false
  },
  "#shortcuts-text-12": { 
    "text": "STRING-220", 
    "tag": false
  },
  "#shortcuts-text-13": { 
    "text": "STRING-221",
    "tag": false
  },
  "#shortcuts-text-14": { 
    "text": "STRING-222",
    "tag": false
  }
}

function createDictionary(langInfo, langList){
  // In order to not repeat the language objects info over and over, this functions creates the dictionary that is going to be exported
  let dictList = [];

  for (lang of langList) {
    // Language order:
    // [english, spanish, french]
    //let tempDict
    for (entry of Object.keys(dataTemplate)) {
      // from the data template, creating the dictionary of each language

    }
  }
}

// TESTING
if (typeof require != 'undefined' && require.main == module) {
  console.log(langInfo);
  console.log(langList);
}

