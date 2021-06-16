const rl = require('readline-sync');
const fs = require("fs");
const path = require('path');
const scenarios = require('../app/options.js');
const menu = require('../app/menu.js');

let basedir = path.resolve(__dirname, '../..');
let files = [];
const storiesInputDir = `${basedir}/stories/input/`;

const listStoryFiles = () => {
  console.log(`0. Back`);
  files = fs.readdirSync(storiesInputDir);
  files.filter((file) => file.match(/.*\.(json)/ig))
    .forEach((file, i) => console.log(`${i + 1}. ${file}`));
}

const printMenu = () => {
  console.clear();
  console.log(`========================= SELECT A STORY FILE =========================`);
  listStoryFiles();
  console.log(`=======================================================================`);
  return rl.question(`Choose an option: `);
}

const execute = () => {
  const option = printMenu();
  if (option != "0") {
    const file = fs.readFileSync(`${storiesInputDir}/${files[option]}`, 'utf8');
    scenarios.execute(JSON.parse(file), 'story');
    return;
  }

  menu.showMenu("Back from story file selection.")
}

module.exports.execute = execute;