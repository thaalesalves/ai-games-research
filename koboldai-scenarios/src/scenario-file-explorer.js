const rl = require('readline-sync');
const fs = require("fs");
const path = require('path');
const scenarios = require('./options.js');
const menu = require('./menu.js');

let basedir = path.resolve(__dirname, '..');
let files = [];
const scenariosDir = `${basedir}/scenarios/`;

const listScenarioFiles = () => {
  console.log(`0. Back`);
  files = fs.readdirSync(scenariosDir);
  files.filter((file) => file.match(/.*\.(json)/ig))
    .forEach((file, i) => console.log(`${i + 1}. ${file}`));
}

const printMenu = () => {
  console.clear();
  console.log(`========================= SELECT A SCENARIO FILE =========================`);
  listScenarioFiles();
  console.log(`==========================================================================`);
  return rl.question(`Choose an option: `);
}

const execute = () => {
  const fileOption = printMenu();
  if (fileOption != "0") {
    const file = fs.readFileSync(`${scenariosDir}/${files[fileOption]}`, 'utf8');
    scenarios.execute(JSON.parse(file), 'scenario');
    return;
  }

  menu.showMenu("Back from scenario file selection.")
}

module.exports.execute = execute;