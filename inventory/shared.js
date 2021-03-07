const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;
const WEAPONS = [
  'sword', 'knife', 'spear', 'hammer', 'axe', 'battleaxe', 'sledgehammer', 'longsword',
];

const CLOTHING = [
  'rags', 'armor', 'dress', 'kilt', 'skirt', 'jerkin', 'shirt', 'clothes', 'robes', 'leathers', 'hooded'
];

/**
 * Simple frunction to capitalize the first letter of a string
 * 
 * @param {string} string 
 */
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Finds an item in the player's inventory
 * @param {string} itemName 
 */
const findItemInInventory = (itemName) => {
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  return getInventory().find(item => {
    return item.name == loweredName;
  });
}

/**
 * Removes an item from player's inventory
 * 
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
const removeFromInventory = (itemName, itemQuantity) => {
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let item = findItemInInventory(loweredName);
  if (!(item.quantity == itemQuantity) && (item.quantity > 1 && item.quantity >= itemQuantity)) {
    item.quantity -= itemQuantity;
    return `\nYou have removed ${itemQuantity} ${loweredName} from your inventory.`;
  }

  let index = getInventory().indexOf(item);
  getInventory().splice(index, 1);
  return `\nYou have removed all ${loweredName} from your inventory.`;
}

/**
 * Checks player's inventory and returns what's inside
 */
const checkInventory = () => {

  if (getInventory().length > 0) {
    let items = Object.keys(getInventory()).map((k) => {
      return `${getInventory()[k].name} (${getInventory()[k].quantity}x)`;
    }).join(', ');

    let itemsWorn = Object.keys(getInventory().filter((item) => {
      return item.status == 'worn';
    })).map((k) => {
      return getInventory()[k].name;
    }).join(', ');

    return `\nYour inventory contains: ${items}. Items equipped: ${itemsWorn}.`;
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

  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let item = findItemInInventory(loweredName);
  if (typeof item == 'undefined') {
    item = {
      name: loweredName,
      quantity: itemQuantity,
      status: 'in inventory',
      type: getType(itemName)
    };

    state.inventory.push(item);
  } else {
    item.quantity = item.quantity + itemQuantity;
  }

  return `\nYou have added ${itemQuantity} ${loweredName} to your inventory.`;
}

/**
 * Simple function to make the player equip something.
 * 
 * @param {string} itemName 
 */
const equipItem = (itemName) => {
  const itemNameLowerCase = itemName.toLowerCase();
  let item = findItemInInventory(itemNameLowerCase);
  if (typeof item != 'undefined') {
    if (item.type != 'weapon' && item.type != 'clothing') {
      return `\n${capitalize(itemNameLowerCase)} is not an equippable item.`;
    }

    const wiRegex = new RegExp(`(?<=WORN<${state.character.name}>:)(.*)(?=;)`);
    let playerWorldInfo = getPlayerWi();
    let itemsWorn = playerWorldInfo.entry.match(wiRegex)[0];
    let oldItem = getInventory().find(oldItem => oldItem.status == 'worn' && oldItem.type == item.type);
    if (typeof oldItem != 'undefined') {
      itemsWorn.replace(oldItem.name.toLowerCase(), '');
      console.log(`Removing worn status from ${oldItem.name}.`);
      oldItem.status = 'in inventory';
      state.memory.context.replace(` The player is ${oldItem.type == 'weapon' ? 'wielding' : 'wearing'} ${oldItem.name}. `, '');
    }

    console.log(`Removing worn status from ${item.name}.`);
    item.status = 'worn';
    state.memory.context += ` The player is ${item.type == 'weapon' ? 'wielding' : 'wearing'} ${item.name}. `;
    itemsWorn = Object.keys(getInventory().filter((item) => {
      return item.status == 'worn';
    })).map((k) => {
      return getInventory()[k].name;
    }).join('/');

    playerWorldInfo.entry = playerWorldInfo.entry.replace(wiRegex, itemsWorn);
    updateWorldEntry(
      state.character.worldInfoIndex,
      playerWorldInfo.keys,
      playerWorldInfo.entry,
      false
    );

    return `\nYou are now ${item.type == 'weapon' ? 'wielding' : 'wearing'} ${item.name}.`;
  }
}

/**
 * Function to determine item type
 * 
 * @param {string} itemType
 */
const getType = (itemName) => {
  const checker = (input) => {
    return WEAPONS.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'weapon' :
      CLOTHING.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'clothing' : 'misc';
  }

  return checker(itemName);
}
