const rl = require('readline-sync');
const fs = require(`fs`);

const getDateString = () => {
  const date = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}${month}${day}`
}

const grabPlaceholders = (text) => {
  let withoutBrackets = text.replace(/\[|\]/g, '');
  const placeholdersFound = withoutBrackets.match(/\$\{(.*?)\}/g);
  if (placeholdersFound) {
    for (let entry of placeholdersFound) {
      let placeholders = new Array();
      placeholders.push(entry.replace(/\$\{|\}/g, ''));
      return placeholders;
    }
  }
}

const saveStory = (adventure, title, type) => {
  let input = rl.question(`Type your ${type ? type : 'adventure'}'s name (defaults to ${title}): `);
  let storyTitle = input ? input : title;
  const defaultOutputFile = `${type ? type : 'storie'}s/${storyTitle ? storyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${getDateString()}.json`;
  let customOutputFile = rl.question(`Path to where the story should be saved (defaults to ${defaultOutputFile}): `);
  const outputFile = customOutputFile ? customOutputFile : defaultOutputFile;
  fs.writeFileSync(`${outputFile}`, JSON.stringify(adventure), 'utf8');
  console.log(`Story generated from scenario. Saved in: ${outputFile}`);
  process.exit(0);
}

const formatWorldInfo = (originalWi) => {
  let formattedWi = [];
  originalWi.forEach(wi => {
    formattedWi.push({
      key: wi.keys,
      content: wi.entry
    });
  });

  return formattedWi;
}

const getAuthorsNote = (originalAuthorsNote) => {
  const defaultAuthorsNote = originalAuthorsNote ? originalAuthorsNote : '[Writing style: elegant, dramatic, vivid] [Genre: Fantasy]';
  const authorsNote = rl.question(`Write your author's note (defaults to "${defaultAuthorsNote}" if left empty): `);
  return authorsNote ? authorsNote : defaultAuthorsNote;
}

const removeAccents = (str) => {
  const map = {
    '-': ' ',
    '-': '_',
    'a': 'á|à|ã|â|ä',
    'e': 'é|è|ê|ë',
    'i': 'í|ì|î|ï',
    'o': 'ó|ò|ô|õ|ö',
    'u': 'ú|ù|û|ü',
    'c': 'ç',
    'n': 'ñ',
    'A': 'À|Á|Ã|Â|Ä',
    'E': 'É|È|Ê|Ë',
    'I': 'Í|Ì|Î|Ï',
    'O': 'Ó|Ò|Ô|Õ|Ö',
    'U': 'Ú|Ù|Û|Ü',
    'C': 'Ç',
    'N': 'Ñ'
  };

  for (var pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  }

  return str;
}

module.exports = {
  removeAccents: removeAccents,
  formatWorldInfo: formatWorldInfo,
  saveStory: saveStory,
  getAuthorsNote: getAuthorsNote,
  grabPlaceholders: grabPlaceholders
}