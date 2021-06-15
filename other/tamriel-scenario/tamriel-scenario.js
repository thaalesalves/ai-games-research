fs = require(`fs`);
rl = require('readline-sync');
characterCreator = require('./create-character.js');
promptGenerator = require('./prompt-generator.js');

let status;
let menuOptions = [
  `Create character`,
  `Create character (and write your own prompt)`,
  `Random character`
];

const printMenu = () => {
  console.clear();
  console.log(status ? `Message: ${status}` : '');
  console.log(`========================= TAMRIEL: THE THIRD ERA =========================`);
  menuOptions.forEach((menuOption, i) => console.log(`${i + 1}. ${menuOption}`));
  console.log(`0. Exit`);
  console.log(`==========================================================================`);
  return rl.question(`Choose an option: `);
}

const getDateString = () => {
  const date = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}${month}${day}`
}

const saveAdventure = (adventure, character) => {
  let input = rl.question(`Type your adventure's name (defaults to ${character.name}): `);
  let storyTitle = input ? input : character.name;
  const defaultOutputFile = `stories/${storyTitle ? storyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${getDateString()}.json`;
  let customOutputFile = rl.question(`Path to where the story should be saved (defaults to ${defaultOutputFile}): `);
  const outputFile = customOutputFile ? customOutputFile : defaultOutputFile;
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
  switch (option) {
    case `0`:
      process.exit(1);
    case `1`:
      charSheet = characterCreator.create();
      charSheet.prompt = promptGenerator.customCharacterPrompt(charSheet);
      break;
    case `2`:
      charSheet = characterCreator.createCustomPrompt();
      break;
    case `3`:
      charSheet = characterCreator.generateCharacter();
      break;
    default:
      status = `Invalid option chosen: ${option}.`;
      main();
  }

  worldInfo.push(characterCreator.buildWorldInfo(charSheet));
  console.log(`\n======== CHARACTER DESCRIPTION ========`);
  console.log(JSON.stringify(charSheet, null, 2));
  console.log(`\n=======================================\n`);
  saveAdventure(buildAdventure(worldInfo, charSheet.prompt, getAuthorsNote()), charSheet);
}

main();