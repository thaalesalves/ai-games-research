const util = require('../app/utils.js');

const buildStory = (story) => {
  return {
    gamestarted: true,
    prompt: story.prompt,
    memory: '',
    authorsnote: util.getAuthorsNote(story.authorsNote),
    actions: extractActions(story),
    worldinfo: util.formatWorldInfo(story.worldInfo),
  }
}

const extractActions = (story) => {
    let extractedActions = [];
    story.actions.forEach(action => extractedActions.push(util.removeAccents(action.text)));
    return extractedActions;
}

const printMenu = (story) => {
  console.clear();
  let title = `========================= ${story.title.toUpperCase()} =========================`;
  let bottom = Array(title.length + 1).join("=");
  console.log(title);
  console.log(story.description.replace(/(\S+\s*){1,10}/g, "$&\n"));
  console.log(bottom);
}

const execute = (story) => {
  printMenu(story);
  let convertedStory = buildStory(story);
  util.saveStory(convertedStory, story.title);
}

module.exports.execute = execute;