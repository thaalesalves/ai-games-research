const rl = require('readline-sync');
const scn = require('../scenarios/scenario.js');
const str = require('../stories/story.js');
const menu = require('./menu.js');
const util = require('./utils.js');
const subscn = require('./sub-options.js');

let lastIndex;
const listItems = (items) => {
  lastIndex = items.length + 1;
  items.forEach((item, i) => console.log(`${i + 1}. ${item.title}`));
}

const printMenu = (items) => {
  console.clear();
  console.log(`========================= YOUR AI DUNGEON SCENARIOS =========================`);
  console.log(`0. Back`);
  listItems(items);
  console.log(`${lastIndex}. Save all`);
  console.log(`=============================================================================`);
  return rl.question(`Choose an option: `);
}

const execute = (items, type) => {
  const extracted = items.data.user.search;
  const option = printMenu(extracted);
  if (option == lastIndex) {
    util.saveStory(extracted, `extracted_${type}s`, type);
    return;
  } else if (option != "0") {
    if (type == 'scenario') {
      const itemSelected = extracted[parseInt(option) - 1];
      if (!itemSelected.options[0]?.prompt) {
        scn.execute(itemSelected);
        return;
      }

      subscn.execute(itemSelected, itemSelected.options);
    } else if (type == 'story') {
      const itemSelected = extracted[option];
      str.execute(itemSelected);
    }
    return;
  }

  menu.showMenu("Back from scenario selection.");
}

module.exports.execute = execute;