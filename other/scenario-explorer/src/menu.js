const rl = require('readline-sync');
const explorer = require('./explore_files.js');

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
      explorer.execute();
    }
  },
  {
    text: `Open scenario`,
    execute: () => {
    }
  },
  {
    text: `Random scenario`,
    execute: () => {
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

module.exports = {
  showMenu: (message) => {
    status = message ? message : '';
    let option = printMenu();
    if (menuOptions[option]) {
      return menuOptions[option].execute();
    }

    status = `Invalid option chosen: ${option}`;
    printMenu();
  }
}