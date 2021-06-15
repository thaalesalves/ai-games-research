const menu = require('./menu.js');
const fs = require(`fs`);
const rl = require('readline-sync');
const characterCreator = require('./create-character.js');
const path = require('path');

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
  const authorsNote = rl.question(`Write your author's note (defaults to "${defaultAuthorsNote}" if left empty): `);
  return authorsNote ? authorsNote : defaultAuthorsNote;
}

const main = () => {
  let charSheet = menu.showMenu();
  let basedir = path.resolve(__dirname, '..');
  let worldInfo = JSON.parse(fs.readFileSync(`${basedir}/wi/tamriel-reign-katariah.json`, 'utf8'));
  worldInfo.push(characterCreator.buildWorldInfo(charSheet));
  console.log(`\n======== CHARACTER DESCRIPTION ========`);
  console.log(JSON.stringify(charSheet, null, 2));
  console.log(`\n=======================================\n`);
  saveAdventure(buildAdventure(worldInfo, charSheet.prompt, getAuthorsNote()), charSheet);
}

main();