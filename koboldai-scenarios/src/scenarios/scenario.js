const rl = require('readline-sync');
const util = require('../app/utils.js');

let placeholders = [];
let placeholderAnswers = [];

const grabPlaceholders = (text) => {
  if (text.match(/\[(\$\{|)(.*?)(\}|)\]/g)) {
    for (entry of text.match(/\[(\$\{|)(.*?)(\}|)\]/g)) {
      entry = entry.replace(/\[(\$\{|)|(\}|)\]/g, '');
      if (!placeholders) {
        placeholders = new Array();
      }

      placeholders.push(entry);
    }
  }
}

const answerQuestions = () => {
  placeholders.forEach((question) => {
    placeholderAnswers.push(rl.question(`${question}: `));
  });
}

const buildStory = (scenario) => {
  return {
    gamestarted: true,
    prompt: scenario.prompt,
    memory: '',
    authorsnote: scenario.authorsNote,
    actions: [],
    worldinfo: util.formatWorldInfo(scenario.worldInfo),
  }
}

const printMenu = (scenario) => {
  console.clear();
  let title = `========================= ${scenario.title.toUpperCase()} =========================`;
  let bottom = Array(title.length + 1).join("=");
  console.log(title);
  console.log(scenario.description.replace(/(\S+\s*){1,10}/g, "$&\n"));
  console.log(bottom);
  grabPlaceholders(scenario.prompt);
  answerQuestions();
}

const execute = (scenario) => {
  printMenu(scenario);
  placeholderAnswers.forEach((answer, i) => {
    scenario.prompt = scenario.prompt.replace(placeholders[i], answer).replace(/\[(\$\{|)|(\}|)\]/g, '');
  });

  let story = buildStory(scenario);
  util.saveStory(story, scenario.title);
}

module.exports.execute = execute;