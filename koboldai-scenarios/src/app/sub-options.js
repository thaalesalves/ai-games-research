const rl = require('readline-sync');
const scn = require('../scenarios/scenario.js');
const str = require('../stories/story.js');
const menu = require('./menu.js');
const util = require('./utils.js');

const listItems = (items) => {
  items.forEach((item, i) => console.log(`${i + 1}. ${item.title}`));
}

const printMenu = (parent, items) => {
  console.clear();
  let title = `========================= SUBSCENARIOS IN: ${parent.title.toUpperCase()} =========================`
  console.log(title);
  let bottom = Array(title.length + 1).join("=");
  console.log(parent.description.replace(/(\S+\s*){1,10}/g, "$&\n"));
  console.log(`0. Back`);
  listItems(items);
  console.log(bottom);
  return rl.question(`Choose an option: `);
}

const execute = (parent, extracted) => {
  const option = printMenu(parent, extracted);
  if (option != "0") {
    const itemSelected = extracted[parseInt(option) - 1];
    if (!itemSelected.options[0]?.prompt) {
      scn.execute(itemSelected);
      return;
    }

    execute(itemSelected, itemSelected.options);
    return;
  }

  menu.showMenu("Back from sub-scenario selection.");
}

module.exports.execute = execute;