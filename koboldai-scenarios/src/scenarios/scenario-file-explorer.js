const rl = require('readline-sync');
const fs = require("fs");
const path = require('path');
const options = require('../app/options.js');
const menu = require('../app/menu.js');

let message;
let basedir = path.resolve(__dirname, '../..');
let files = [];
const scenariosDir = `${basedir}/scenarios/`;

const listScenarioFiles = () => {
  console.log(`0. Back`);
  files = fs.readdirSync(scenariosDir);
  files.filter((file) => file.match(/.*\.(json)/ig))
    .forEach((file, i) => console.log(`${i + 1}. ${file}`));
  console.log(`${files.length}. Open from specific file`);
}

const printMenu = () => {
  console.clear();
  console.log(message ? `Message: ${message}` : '');
  console.log(`========================= SELECT A SCENARIO FILE =========================`);
  listScenarioFiles();
  console.log(`==========================================================================`);
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
        file = fs.readFileSync(rl.question(`Type the full path and file name to the scenario file: `), 'utf8');
      } else {
        file = fs.readFileSync(`${scenariosDir}/${files[option]}`, 'utf8');
      }

      options.execute(JSON.parse(file), 'scenario');
      return;
    }

    menu.showMenu("Back from scenario file selection.");
  }
}

module.exports.execute = execute;