const rl = require('readline-sync');
const scn = require('./scenario.js');

const listScenarios = (scenarios) => {
  scenarios.forEach((scenario, i) => console.log(`${i}. ${scenario.title}`));
}

const printMenu = (scenarios) => {
  console.clear();
  console.log(`========================= CHOOSE A SCENARIO TO PLAY =========================`);
  listScenarios(scenarios);
  console.log(`=============================================================================`);
  return rl.question(`Choose an option: `);
}

module.exports = {
  execute: (scenarios) => {
    const scenarioOption = printMenu(scenarios);
    const scenario = scenarios[scenarioOption];
    scn.execute(scenario);
  }
}