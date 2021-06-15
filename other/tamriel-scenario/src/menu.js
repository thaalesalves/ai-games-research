const promptGenerator = require('./prompt-generator.js');
const rl = require('readline-sync');
const characterCreator = require('./create-character.js');

let charSheet;
let status;
let menuOptions = [
  {
    text: `Exit`,
    execute: () => {
      process.exit(1);
    }
  },
  {
    text: `Create character`,
    execute: () => {
      charSheet = characterCreator.create();
      charSheet.prompt = promptGenerator.customCharacterPrompt(charSheet);
      return charSheet;
    }
  },
  {
    text: `Create character (and write your own prompt)`,
    execute: () => {
      charSheet = characterCreator.createCustomPrompt();
      return charSheet;
    }
  },
  {
    text: `Random character`,
    execute: () => {
      charSheet = characterCreator.generateCharacter();
      return charSheet;
    }
  }
];

const printMenu = () => {
  console.clear();
  console.log(status ? `Message: ${status}` : '');
  console.log(`========================= TAMRIEL: THE REIGN OF KATARIAH =========================`);
  menuOptions.forEach((menuOption, i) => console.log(`${i}. ${menuOption.text}`));
  console.log(`==================================================================================`);
  return rl.question(`Choose an option: `);
}

module.exports = {
  showMenu: () => {
    let option = printMenu();
    return menuOptions[option].execute();
  },
  charSheet: charSheet
}