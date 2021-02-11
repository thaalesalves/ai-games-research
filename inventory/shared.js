const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const BRACKETED = /\[(.*?)\]/g;
const BRACKETS = /\[|\]/g;

/**
 * Bracker handler by Gnurro.
 * 
 * Removes backets from input text to handle them as placeholders
 */
const grabAllBrackets = (text) => {
  for (entry of text.match(BRACKETED)) {
    entry = entry.replace(BRACKETS, '');
    if (!state.placeholders) {
      state.placeholders = new Array();
    }

    state.placeholders.push(entry);
  }

  console.log(state.placeholders);
}

/**
 * Function that parses the character's race when they're created
 * 
 * @param {string} race
 */
const parseRace = (race) => {
  let returnText = ' ';
  if (race.toLowerCase().includes("altmer") || race.toLowerCase().includes("high elf")) {
    addToInventory('Apprentice Mage Robes', 1);
    addToInventory('Apprentice Mage Boots', 1);
    addToInventory('Apprentice Mage Hood', 1);

    possibleLines = [
      '\"What do you want here, elf? Here to enslave us simple Nord folks and make us kneel to your Dominion?\"\n',
      '\"Another elf? Your kind is not welcome here. Skyrim belongs to the Nords!\"\n',
      '\"Haran, hide Eirid. There\'s an elf coming in.\"\n',
      '\"You may stay, but I\'m watchng you, damn elf. One false movement and I\'ll have you thrown in the Sea of Ghosts!\"\n',
    ]

    returnText += possibleLines[Math.floor(Math.random() * possibleLines.length)];
  }

  return returnText;
}

/**
 * Simple frunction to capitalize the first letter of a string
 * 
 * @param {string} string 
 */
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Finds an item in the player's inventory
 * @param {string} itemName 
 */
const findItemInInventory = (itemName) => {
  return getInventory().find(item => {
    return item.name == itemName;
  });
}

/**
 * Removes an item from player's inventory
 * 
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
const removeFromInventory = (itemName, itemQuantity) => {
  let item = findItemInInventory(itemName);
  if (!(item.quantity == itemQuantity) && (item.quantity > 1 && item.quantity >= itemQuantity)) {
    item.quantity -= itemQuantity;
    return `\nYou have removed ${itemQuantity} ${itemName} from your inventory.`;
  }

  let index = getInventory().indexOf(item);
  getInventory().splice(index, 1);
  return `\nYou have removed all ${itemName} from your inventory.`;
}

/**
 * Checks player's inventory and returns what's inside
 */
const checkInventory = () => {

  if (getInventory().length > 0) {
    return `\nYour inventory contains: ` + getInventory().join(', ');
  }

  return `\nYour inventory is empty.`;
}

/**
 * Returns player's inventory. If the array in undefined, define it
 */
const getInventory = () => {
  if (typeof state.inventory == 'undefined') {
    state.inventory = [];
  }

  return state.inventory;
}

/**
 * Adds item to player's inventory
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
const addToInventory = (itemName, itemQuantity) => {

  let item = findItemInInventory(itemName);
  if (typeof item == 'undefined') {
    item = {
      name: itemName,
      quantity: itemQuantity
    };

    state.inventory.push(item);
  } else {
    item.quantity = item.quantity + itemQuantity;
  }

  return `\nYou have added ${itemQuantity} ${itemName} to your inventory.`;
}