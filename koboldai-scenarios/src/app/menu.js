const rl = require('readline-sync');
const scenarios = require('../scenarios/scenario-file-explorer.js');
const stories = require('../stories/story-file-explorer.js');
const javaScenarios = require('../javaman-scenarios/javaman-scenarios.js');
const aidungeon = require('../aidungeon/extract-scenarios.js');

let status;
let menuOptions = [
  {
    text: `Exit`,
    execute: () => {
      process.exit(0);
    }
  },
  {
    text: `Javaman's scenarios`,
    execute: () => {
      javaScenarios.execute();
    }
  },
  {
    text: `Explore scenarios`,
    execute: () => {
      scenarios.execute();
    }
  },
  {
    text: `Explore stories`,
    execute: () => {
      stories.execute();
    }
  },
  {
    text: `Convert from AI Dungeon (still under development)`,
    execute: () => {
      const userToken = rl.question("Paste your user token: ");
      aidungeon.execute(userToken);
    }
  }
];

const printMenu = () => {
  console.clear();
  console.log(status ? `Message: ${status}` : '');
  console.log(`========================= KOBOLDAI: SCENARIO EXPLORER =========================`);
  menuOptions.forEach((menuOption, i) => console.log(`${i}. ${menuOption.text}`));
  console.log(`===============================================================================`);
  return rl.question(`Choose an option: `);
}

const showMenu = (message) => {
  status = message ? message : '';
  let option;
  while (!option || option >= menuOptions.length || option < menuOptions) {
    option = printMenu();
    if (menuOptions[option]) {
      return menuOptions[option].execute();
    }

    status = option ? `Invalid option chosen: ${option}` : "Please choose an option.";
    printMenu();
  }
}

module.exports.showMenu = showMenu;