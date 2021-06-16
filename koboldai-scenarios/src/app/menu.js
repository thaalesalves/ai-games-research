const rl = require('readline-sync');
const scenarios = require('../scenarios/scenario-file-explorer.js');
const stories = require('../stories/story-file-explorer.js')

let status;
let menuOptions = [
  {
    text: `Exit`,
    execute: () => {
      process.exit(0);
    }
  },
  {
    text: `Javaman's scenarios (not implemented yet)`,
    execute: () => {
      scenarios.execute();
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
  let option = printMenu();
  if (menuOptions[option]) {
    return menuOptions[option].execute();
  }

  status = `Invalid option chosen: ${option}`;
  printMenu();
}

module.exports.showMenu = showMenu;