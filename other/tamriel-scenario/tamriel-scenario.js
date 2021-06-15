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

const getAuthorsNote = () => {
  const defaultAuthorsNote = '[Writing style: elegant, dramatic, vivid] [Genre: Fantasy]';
  const authorsNote = rl.question(`Write your author's note (defaults to ${defaultAuthorsNote} if left empty): `);
  return authorsNote ? authorsNote : defaultAuthorsNote;
}

const main = () => {
  let option = printMenu();
  let worldInfo = JSON.parse(fs.readFileSync('./tamriel-world-info.json', 'utf8'));
  let prompt;
  let charSheet;
  let authorsNote = getAuthorsNote();
  switch (option) {
    case "0":
      process.exit(1);
    case "1":
      charSheet = characterCreator.create();
      charSheet.prompt = promptGenerator.customCharacterPrompt(charSheet);
      break;
    case "2":
      charSheet = characterCreator.createCustomPrompt();
      break;
    case "3":
      charSheet = characterCreator.generateCharacter();
      break;
    default:
      console.log("Invalid option chosen.")
      main();
  }

  worldInfo.push(characterCreator.buildWorldInfo(charSheet));
  console.log("\n======== CHARACTER DESCRIPTION ========");
  console.log(JSON.stringify(charSheet, null, 2));
  console.log("\n=======================================\n");
  saveAdventure(buildAdventure(worldInfo, charSheet.prompt, authorsNote));
}

main();