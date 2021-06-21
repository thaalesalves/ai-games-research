const rl = require('readline-sync');
const scenarios = require('../aidungeon/aid-scenarios.js');
const stories = require('../aidungeon/aid-stories.js');

let message;
let menuOptions = [
  {
    text: `Exit`,
    execute: () => {
      process.exit(0);
    }
  },
  {
    text: `Convert story from AI Dungeon`,
    execute: (username, userToken) => {
      stories.execute(username, userToken);
    }
  },
  {
    text: `Convert scenario from AI Dungeon (from your own scenarios)`,
    execute: (username, userToken) => {
      scenarios.execute(username, userToken, false);
    }
  },
  {
    text: `Convert scenario from AI Dungeon (from your favorite scenarios)`,
    execute: (username, userToken) => {
      scenarios.execute(username, userToken, true);
    }
  }
];

const printMenu = () => {
  console.clear();
  console.log(message ? `Message: ${message}` : '');
  console.log(`========================= SELECT AN OPERATION =========================`);
  menuOptions.forEach((menuOption, i) => console.log(`${i}. ${menuOption.text}`));
  console.log(`=======================================================================`);
  return rl.question(`Choose an option: `);
}

const execute = (username, userToken) => {
  let option;
  while (!option) {
    option = printMenu();
    if (!option) {
      message = "Please choose an option.";
      execute();
    } else if (option != "0") {
      menuOptions[option].execute(username, userToken);
      return;
    }

    menu.showMenu("Back from scenario file selection.");
  }
}

module.exports.execute = execute;