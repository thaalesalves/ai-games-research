const rl = require('readline-sync');
const fs = require("fs");
const path = require('path');
const scenarios = require('./scenarios-options.js');

let basedir = path.resolve(__dirname, '..');
let files = [];
const scenariosDir = `${basedir}/scenarios/`;

const listScenarioFiles = () => {
  files = fs.readdirSync(scenariosDir);
  files.forEach((file, i) => console.log(`${i}. ${file}`));
}

const printMenu = () => {
  console.clear();
  console.log(`========================= SELECT A SCENARIO FILE =========================`);
  listScenarioFiles();
  console.log(`==========================================================================`);
  return rl.question(`Choose an option: `);
}

module.exports = {
  execute: () => {
    const fileOption = printMenu();
    const file = fs.readFileSync(`${scenariosDir}/${files[fileOption]}`, 'utf8');
    scenarios.execute(JSON.parse(file));
    process.exit(0);
  }
}