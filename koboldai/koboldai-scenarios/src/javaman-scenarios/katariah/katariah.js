const fs = require(`fs`);
const path = require('path');
const rl = require('readline-sync');
const menu = require('../../app/menu.js');
const util = require('../../app/utils.js');
const characterCreator = require('./create-character.js');
const promptGenerator = require('./prompt-generator.js');

let message;
let sinopsis = `Tamriel has gone through a lot in the last decades. Wars, schisms, battles, political fights... and instability to its citizens. After the War of the Red Diamond, between Potema, Uriel III and Kintyra II, the Empire went through a lot. Armies were deployed to fight the Wolf Queen of Solitude and her Undead Army until her son, Uriel III, died. She lived for another 10 years as Queen of Solitude, until Pelagius III succeeded her.\nIt is said that Potema's own insanity cursed the Blue Palace and its Royal Wing. Pelagius descended into complete madness while he was King of Solitude, and got even worse after he inherited the Ruby Throne, and reached a bad point. His wife, the Dunmer called Katariah Ra'athim, assumed the Throne as Empress Regent of Tamriel while Pelagius, now known as Pelagius the Mad, was in a bad state and could not execise his position as Emperor.\nNow it is the year 3E 153, and Emperor Pelagius III the Mad has died recently. Vrage assumed his place as King of Solitude, and Katariah was officially crowned Empress of Tamriel. Her reign is calm and stable, and Tamriel hasn't seen such a happy phase in decades.\n`;
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
  console.log(sinopsis.replace(/(\S+\s*){1,15}/g, "$&\n"));
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