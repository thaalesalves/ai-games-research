const rl = require('readline-sync');
const scn = require('../scenarios//scenario.js');
const str = require('../stories/story.js');
const menu = require('./menu.js');

const listItems = (items) => {
  items.forEach((item, i) => console.log(`${i + 1}. ${item.title}`));
}

const printMenu = (items) => {
  console.clear();
  console.log(`========================= CHOOSE AN OPTION TO PLAY =========================`);
  console.log(`0. Back`);
  listItems(items);
  console.log(`============================================================================`);
  return rl.question(`Choose an option: `);
}

const execute = (items, type) => {
  const option = printMenu(items);
  if (option != "0") {
    if (type == 'scenario') {
      const itemSelected = items[parseInt(option) - 1];
      scn.execute(itemSelected);
    } else if (type == 'story') {
      const itemSelected = items[option];
      str.execute(itemSelected);
    }
    return;
  }

  menu.showMenu("Back from scenario selection.");
}

module.exports.execute = execute;