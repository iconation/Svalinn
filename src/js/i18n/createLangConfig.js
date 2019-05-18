/////////////////////////////////////////////////
//this file is for the update and creation of  //
//of the lang-config.json file. When new 'keys'//
//are added to the string-rel.json file,       //
//execute this file to update the              //
//lang-config.json file acordingly.            //
/////////////////////////////////////////////////
const stringRel = require("./string-rel.json");
const langConfig = require("./lang-config.json");
const fs = require("fs");

langConfig['keys'] = Object.keys(stringRel);

let langConfigJSON = JSON.stringify(langConfig);

// a new temp.json file is created, delete the old
// lang-config.json and rename the temp.json file 
// to lang-config.json file to use it in the app.
fs.writeFile("temp.json", langConfigJSON, (err) => {
  if (err) {console.log(err)};
  console.log("temp.json created");
});

