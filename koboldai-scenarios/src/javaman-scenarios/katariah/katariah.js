const fs = require(`fs`);
const path = require('path');
const rl = require('readline-sync');
const menu = require('../../app/menu.js');
const util = require('../../app/utils.js');
const characterCreator = require('./create-character.js');
const promptGenerator = require('./prompt-generator.js');

let message;
let menuOptions = [
  {
    text: `Back`,
    execute: () => {
      menu.showMenu("Back from javaman's scenarios selection.");
    }
  },
  {
    text: `Create character (with pre-defined prompts)`,
    execute: () => {
      charSheet = characterCreator.create();
      charSheet.prompt = promptGenerator.customCharacterPrompt(charSheet);
      return charSheet;
    }
  },
  {
    text: `Create character (and write your own prompt)`,
    execute: () => {
      return charSheet = characterCreator.createCustomPrompt();
    }
  },
  {
    text: `Random character`,
    execute: () => {
      return charSheet = characterCreator.generateCharacter();
    }
  }
]

const printMenu = () => {
  console.clear();
  console.log(message ? `Message: ${message}` : '');
  console.log(`========================= TAMRIEL: THE REIGN OF KATARIAH =========================`);
  console.log(`The year is 3E 153, and Katariah Ra'athim is Empress of Tamriel.\n` +
  `The Empire is in peace under her rule, after decades of wars and schisms.\n` +
  `Potema, Kintyra II, Uriel III, Pelagius the Mad are all gone, and under Pelagius' wife, the Empire has a chance for stability.\n`.replace(/(\S+\s*){1,10}/g, "$&\n"));
  menuOptions.forEach((menuOption, i) => console.log(`${i}. ${menuOption.text}`));
  console.log(`==================================================================================`);
  return rl.question(`Choose an option: `);
}

const buildAdventure = (worldInfo, prompt, authorsNote) => {
  return {
    gamestarted: true,
    prompt: prompt,
    memory: '',
    authorsnote: authorsNote,
    actions: [],
    worldinfo: worldInfo,
  };
}

const execute = () => {
  let option;
  while (!option) {
    option = printMenu();
    if (!option) {
      message = "Please choose an option.";
      execute();
    } else if (option != "0") {
      let worldInfoOriginal = JSON.parse(fs.readFileSync(`${path.resolve(__dirname)}/tamriel-reign-katariah.json`, 'utf8'));
      let charSheet = menuOptions[option].execute();
      let authorsNote = util.getAuthorsNote();
      let worldInfo = util.formatWorldInfo(worldInfoOriginal);
      let adventure = buildAdventure(worldInfo, charSheet.prompt, authorsNote);
      util.saveStory(adventure, charSheet.name);
    }
  }

  menu.showMenu("Back from javaman's scenarios selection.");
}

module.exports.execute = execute;