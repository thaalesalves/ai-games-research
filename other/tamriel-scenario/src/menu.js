const promptGenerator = require('./prompt-generator.js');
const rl = require('readline-sync');
const characterCreator = require('./create-character.js');

let charSheet;
let status;
let menuOptions = [
  {
    text: `Exit`,
    execute: () => {
      process.exit(0);
    }
  },
  {
    text: `Scenario sinopsis`,
    execute: () => {
      console.clear();
      status = "Returning from sinopsis.";
      return `========================= TAMRIEL: THE REIGN OF KATARIAH =========================\n` +
      `The year is 3E 153, and Katariah Ra'athim is Empress of Tamriel.\n` +
      `The Empire is in peace under her rule, after decades of wars and schisms.\n` +
      `Potema, Kintyra II, Uriel III, Pelagius the Mad are all gone, and under Pelagius' wife, the Empire has a chance for stability.\n` +
      `==================================================================================`;
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
    if (menuOptions[option]) {
      return menuOptions[option].execute();
    }
    
    status = `Invalid option chosen: ${option}`;
    printMenu();
  },
  charSheet: charSheet
}