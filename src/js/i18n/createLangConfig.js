const stringRel = require("./string-rel.json");
const langConfig = require("./lang-config.json");
const fs = require("fs");

langConfig['keys'] = Object.keys(stringRel);

let langConfigJSON = JSON.stringify(langConfig);

fs.writeFile("temp.json", langConfigJSON, (err) => {
  if (err) {console.log(err)};
  console.log("temp.json created");
});

