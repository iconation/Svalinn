const englishJSON = require('./english.json');

//the following is for testing when the filed is called from node
if (typeof require != 'undefined' && require.main == module) {
  let dataList = Object.keys(englishJSON).sort();
  console.log(dataList.length);
}

