const rl = require('readline-sync');
const scn = require('./scenario.js');
const menu = require('./menu.js');

const listScenarios = (scenarios) => {
  scenarios.forEach((scenario, i) => console.log(`${i + 1}. ${scenario.title}`));
}

const printMenu = (scenarios) => {
  console.clear();
  console.log(`========================= CHOOSE A SCENARIO TO PLAY =========================`);
  console.log(`0. Back`);
  listScenarios(scenarios);
  console.log(`=============================================================================`);
  return rl.question(`Choose an option: `);
}

const execute = (scenarios) => {
  const scenarioOption = printMenu(scenarios);
  if (scenarioOption != "0") {
    const scenario = scenarios[scenarioOption];
    scn.execute(scenario);
    return;
  }

  menu.showMenu("Back from scenario selection.")
}

module.exports.execute = execute;