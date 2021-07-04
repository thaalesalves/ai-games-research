const rl = require('readline-sync');
const fs = require("fs");
const path = require('path');
const options = require('../app/options.js');
const menu = require('../app/menu.js');

let basedir = path.resolve(__dirname, '../..');
let files = [];
const storiesInputDir = `${basedir}/stories/input/`;

const listStoryFiles = () => {
  console.log(`0. Back`);
  files = fs.readdirSync(storiesInputDir);
  files.filter((file) => file.match(/.*\.(json)/ig))
    .forEach((file, i) => console.log(`${i + 1}. ${file}`));
  console.log(`${files.length}. Open from specific file`);
}

const printMenu = () => {
  console.clear();
  console.log(`========================= SELECT A STORY FILE =========================`);
  listStoryFiles();
  console.log(`=======================================================================`);
  return rl.question(`Choose an option: `);
}

const execute = () => {
  let option;
  while (!option) {
    option = printMenu();
    if (!option) {
      message = "Please choose an option.";
      execute();
    } else if (option != "0") {
      let file;
      if (option == files.length) {
        file = fs.readFileSync(rl.question(`Type the full path and file name to the story file: `), 'utf8');
      } else {
        file = fs.readFileSync(`${storiesInputDir}/${files[option]}`, 'utf8');
      }

      options.execute(JSON.parse(file), 'story');
      return;
    }

    menu.showMenu("Back from story file selection.");
  }
}

module.exports.execute = execute;