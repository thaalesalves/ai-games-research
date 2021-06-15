fs = require("fs");
rl = require('readline-sync');
characterCreator = require('./create-character.js');
promptGenerator = require('./prompt-generator.js');

const printMenu = () => {
  console.clear();
  console.log("========================= TAMRIEL: THE THIRD ERA =========================");
  console.log("1. Create character");
  console.log("2. Create character (and write your own prompt)");
  console.log("3. Random character");
  console.log("0. Exit");
  console.log("==========================================================================");
  return rl.question("Choose an option: ");
}

const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}${month}${day}`
}

const saveAdventure = (adventure) => {
  storyTitle = rl.question("Type your adventure's name: ");
  const outputFile = `stories/${storyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${getDateString()}.json`;
  fs.writeFile(`${outputFile}`, JSON.stringify(adventure), 'utf8', (err) => {
    if (err) {
      return console.error(err);
    }

    console.log(`Story generated.`);
    process.exit(0);
  });
}

const buildAdventure = (worldInfo, prompt) => {
  return {
    gamestarted: false,
    prompt: prompt,
    memory: '',
    authorsnote: '',
    actions: [],
    worldinfo: worldInfo,
  };
}

const main = () => {
  let option = printMenu();
  let worldInfo = JSON.parse(fs.readFileSync('./tamriel-world-info.json', 'utf8'));
  let prompt;
  let charSheet;
  switch (option) {
    case "0":
      process.exit(1);
    case "1":
      charSheet = characterCreator.create();
      prompt = promptGenerator.customCharacterPrompt(charSheet);
      break;
    case "2":
      charSheet = characterCreator.createCustomPrompt();
      prompt = charSheet.prompt;
      break;
    case "3":
      charSheet = characterCreator.generateCharacter();
      prompt = charSheet.prompt;
      break;
    default:
      console.log("Invalid option chosen.")
      main();
  }

  worldInfo.push(characterCreator.buildWorldInfo(charSheet));
  saveAdventure(buildAdventure(worldInfo, prompt));
}

main();