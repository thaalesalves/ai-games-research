const rl = require('readline-sync');
const fs = require(`fs`);

let placeholders = [];
let placeholderAnswers = [];

const grabPlaceholders = (text) => {
  for (entry of text.match(/\[(\$\{|)(.*?)(\}|)\]/g)) {
    entry = entry.replace(/\[(\$\{|)|(\}|)\]/g, '');
    if (!placeholders) {
      placeholders = new Array();
    }

    placeholders.push(entry);
  }
}

const answerQuestions = () => {
  placeholders.forEach((question) => {
    placeholderAnswers.push(rl.question(`${question}: `));
  });
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

const buildStory = (scenario) => {
  return {
    gamestarted: true,
    prompt: scenario.prompt,
    memory: '',
    authorsnote: scenario.authorsNote,
    actions: [],
    worldinfo: formatWorldInfo(scenario.worldInfo),
  }
}

const printMenu = (scenario) => {
  console.clear();
  let title = `========================= ${scenario.title.toUpperCase()} =========================`;
  let bottom = Array(title.length + 1).join("=");
  console.log(title);
  console.log(scenario.description.replace(/(\S+\s*){1,10}/g, "$&\n"))
  console.log(bottom);
  grabPlaceholders(scenario.prompt);
  answerQuestions();
}

const getDateString = () => {
  const date = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}${month}${day}`
}

const saveStory = (adventure, title) => {
  console.log(`DEBUG: adventure -> ${JSON.stringify(adventure)}`);
  let input = rl.question(`Type your adventure's name (defaults to ${title}): `);
  let storyTitle = input ? input : title;
  const defaultOutputFile = `stories/${storyTitle ? storyTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${getDateString()}.json`;
  let customOutputFile = rl.question(`Path to where the story should be saved (defaults to ${defaultOutputFile}): `);
  const outputFile = customOutputFile ? customOutputFile : defaultOutputFile;
  fs.writeFileSync(`${outputFile}`, JSON.stringify(adventure), 'utf8');
  console.log(`Story generated from scenario. Saved in: ${outputFile}`);
  process.exit(0);
}

module.exports = {
  execute: (scenario) => {
    printMenu(scenario);
    placeholderAnswers.forEach((answer, i) => {
      scenario.prompt = scenario.prompt.replace(placeholders[i], answer).replace(/\[(\$\{|)|(\}|)\]/g, '');
    });

    let story = buildStory(scenario);
    saveStory(story, scenario.title);
  }
}