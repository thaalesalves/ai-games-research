const rl = require('readline-sync');
const menu = require('../app/menu.js');
const katariah = require('./katariah/katariah.js');
// const tamrielGen = require('./tamriel-gen.js');
// const advCall = require('./adventure-call.js');

let message;
let menuOptions = [
  {
    text: `Back`,
    execute: () => {
      menu.showMenu("Back from javaman's scenarios selection.");
    }
  },
  {
    text: `Adventure Call with Falconhoof (not implemented yet)`,
    execute: () => {
    }
  },
  {
    text: `Tamriel: the Reign of Katariah`,
    execute: () => {
      katariah.execute();
    }
  },
  {
    text: `Tamriel: Character Generators (not implemented yet)`,
    execute: () => {
    }
  },
]

const printMenu = () => {
  console.clear();
  console.log(message ? `Message: ${message}` : '');
  console.log(`========================= SELECT A SCENARIO =========================`);
  menuOptions.forEach((menuOption, i) => console.log(`${i}. ${menuOption.text}`));
  console.log(`=====================================================================`);
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
      menuOptions[option].execute();
    }
  }

  menu.showMenu("Back from javaman's scenarios selection.");
}

module.exports.execute = execute;