const rl = require('readline-sync');
const scenarios = require('./scenario-file-explorer.js');
const stories = require('./story-file-explorer.js')

let status;
let menuOptions = [
  {
    text: `Exit`,
    execute: () => {
      process.exit(0);
    }
  },
  {
    text: `Explore scenarios`,
    execute: () => {
      scenarios.execute();
    }
  },
  {
    text: `Open scenario from file (not implemented yet)`,
    execute: () => {
    }
  },
  {
    text: `Explore stories`,
    execute: () => {
      stories.execute();
    }
  },
  {
    text: `Open story from file (not implemented yet)`,
    execute: () => {
    }
  },
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