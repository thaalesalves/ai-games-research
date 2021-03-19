const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const BRACKETED = /\[(.*?)\]/g;
const BRACKETS = /\[|\]/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;
const WEAPONS = [
  'sword', 'knife', 'spear', 'hammer', 'axe', 'battleaxe', 'sledgehammer', 'longsword', 'bow', 'pickaxe'
];

const CLOTHING = [
  'rags', 'armor', 'dress', 'kilt', 'skirt', 'jerkin', 'shirt', 'clothes', 'robes', 'leathers', 'hooded', 'cuirass', 'chainmail', 'gauntlets', 'vambraces', 'tights'
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
  console.log(`START findItemInInventory(): Looking for item "${item.name}" in player's inventory.`);
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  return getInventory().find(item => {
    console.log(`END findItemInInventory(): Item "${item.name}" found. Returning it.`);
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
  console.log(`START removeFromInventory(): Removing ${itemQuantity} instances of "${itemName}" from player's inventory.`);
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let item = findItemInInventory(loweredName);
  if (!(item.quantity == itemQuantity) && (item.quantity > 1 && item.quantity >= itemQuantity)) {
    console.log(`END removeFromInventory(): Found ${item.quantity} instances of "${itemName}" in player's inventory. Removing ${itemQuantity} instances of it.`);
    item.quantity -= itemQuantity;
    return `\nYou have removed ${itemQuantity} ${loweredName} from your inventory.`;
  }

  console.log(`END removeFromInventory(): Found ${item.quantity} instances of "${itemName}" in player's inventory. Removing ${itemQuantity} instances of it.`);
  let index = getInventory().indexOf(item);
  getInventory().splice(index, 1);
  return `\nYou have removed all ${loweredName} from your inventory.`;
}

/**
 * Checks player's inventory and returns what's inside
 */
const checkInventory = () => {

  console.log(`START checkInventory(): Checking player's inventory.`);
  if (getInventory().length > 0) {
    let items = Object.keys(getInventory()).map((k) => {
      return `${getInventory()[k].name} (${getInventory()[k].quantity}x)`;
    }).join(', ');

    let itemsWorn = Object.keys(getInventory().filter((item) => {
      return item.status == 'worn';
    })).map((k) => {
      return getInventory()[k].name;
    }).join(', ');

    console.log(`END checkInventory(): Player's inventory contains: ${items}.`);
    return `\nYour inventory contains: ${items}. Items equipped: ${itemsWorn}.`;
  }

  console.log(`END checkInventory(): Player's inventory is empty.`);
  return `\nYour inventory is empty.`;
}

/**
 * Returns player's inventory. If the array in undefined, define it
 */
const getInventory = () => {
  console.log(`START getInventory(): verifying player's inventory.`);
  if (typeof state.inventory == 'undefined') {
    console.log(`Inventory array is undefined. Declaring it with an empty array.`);
    state.inventory = [];
  }

  console.log(`END getInventory(): player's inventory is not empty. Returning it's contents.`);
  return state.inventory;
}

/**
 * Adds item to player's inventory
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
const addToInventory = (itemName, itemQuantity) => {

  console.log(`START addToInventory(): adding ${itemQuantity} instances of "${itemName}" to player's inventory.`);
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let item = findItemInInventory(loweredName);
  if (typeof item == 'undefined') {
    console.log(`Player has no other instances of this item in their inventory. Adding these.`);
    item = {
      name: loweredName,
      quantity: itemQuantity,
      status: 'in inventory',
      type: getType(itemName)
    };

    state.inventory.push(item);
  } else {
    console.log(`Player already has other instances of this item in their inventory. Incrementing the quantity by ${itemQuantity}.`);
    item.quantity = item.quantity + itemQuantity;
  }

  console.log(`END addToInventory(): ${itemQuantity} instances of "${itemName}" added to player's inventory.`);
  return `\nYou have added ${itemQuantity} ${loweredName} to your inventory.`;
}

/**
 * Simple function to make the player equip something.
 * 
 * @param {string} itemName 
 */
const equipItem = (itemName) => {
  console.log(`START equipItem(): equipping ${itemName}`);
  const itemNameLowerCase = itemName.toLowerCase();
  let item = findItemInInventory(itemNameLowerCase);
  if (typeof item != 'undefined') {
    console.log(`Item exists in player's inventory`);
    if (item.type != 'weapon' && item.type != 'clothing') {
      console.log(`END equipItem(): item is not equippable.`);
      return `\n${capitalize(itemNameLowerCase)} is not an equippable item.`;
    }

    const wiRegex = new RegExp(`(?<=WORN: )(.*)(?=;)`);
    let playerWorldInfo = worldEntries[state.character.worldInfoIndex];
    let itemsWorn = playerWorldInfo.entry.match(wiRegex)[0];
    let oldItem = getInventory().find(oldItem => oldItem.status == 'worn' && oldItem.type == item.type);
    if (typeof oldItem != 'undefined') {
      console.log(`Player has another item of the same type equipped. Unequipping old item.`);
      itemsWorn.replace(oldItem.name.toLowerCase(), '');
      console.log(`Removing worn status from ${oldItem.name}.`);
      oldItem.status = 'in inventory';
    }

    console.log(`Removing worn status from ${item.name}.`);
    item.status = 'worn';
    itemsWorn = Object.keys(getInventory().filter((item) => {
      console.log(`Updating player WI with worn items`);
      return item.status == 'worn';
    })).map((k) => {
      return getInventory()[k].name;
    }).join('/ ');

    playerWorldInfo.entry = playerWorldInfo.entry.replace(wiRegex, itemsWorn);
    updateWorldEntry(
      state.character.worldInfoIndex,
      playerWorldInfo.keys,
      playerWorldInfo.entry,
      false
    );

    console.log(`END equipItem(): ${item.name} has been equipped.`);
    return `\nYou are now ${item.type == 'weapon' ? 'wielding' : 'wearing'} ${item.name}.`;
  }

  console.log(`END equipItem(): Player does not have ${item.name} in their inventory.`);
  return `\nYou do not have \"${itemNameLowerCase}\" in your inventory.`;
}

/**
 * Debugs your inventory and corrects the player's WI in case it fails
 */
const debugInventory = () => {
  console.log(`START debugInventory(): debugging player's inventory`);
  state.character.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes(state.character.name));
  let playerWorldInfo = worldEntries[state.character.worldInfoIndex];
  const wornRegex = new RegExp(`(?<=WORN: )(.*)(?=;)`);
  const invRegex = new RegExp(`(?<=INV: )(.*)(?=;)`);

  let itemsWorn = playerWorldInfo.entry.match(wornRegex)[0];
  let itemsInInventory = playerWorldInfo.entry.match(invRegex)[0];

  itemsWorn = Object.keys(getInventory().filter((item) => {
    console.log(`Updating player WI with worn items`);
    return item.status == 'worn';
  })).map((k) => {
    return getInventory()[k].name;
  }).join('/ ');

  itemsInInventory = getInventory().map((k) => {
    console.log(`Updating player WI with inventory items`);
    return `${k.name}< quantity: ${k.quantity}>`;
  }).join('/ ');

  playerWorldInfo.entry = playerWorldInfo.entry.replace(wornRegex, itemsWorn);
  playerWorldInfo.entry = playerWorldInfo.entry.replace(invRegex, itemsInInventory);

  updateWorldEntry(
    state.character.worldInfoIndex,
    playerWorldInfo.keys,
    playerWorldInfo.entry,
    false
  );

  console.log("Fixed player WI with inventory's items.");
  console.log(`END debugInventory(): Player's WI saved at index ${state.character.worldInfoIndex}.`);
}

/**
 * Updates the player's inventory and corrects the WI
 */
const updateInventory = () => {
  console.log(`START updateInventory(): updating player's inventory and WI with current items`);
  const wiRegex = new RegExp(`(?<=INV: )(.*)(?=;)`);
  let playerWorldInfo = worldEntries[state.character.worldInfoIndex];
  let itemsInInventory = playerWorldInfo.entry.match(wiRegex)[0];
  itemsInInventory = getInventory().map((k) => {
    console.log(`Sorting inventory items and quantities into player WI`);
    return `${k.name}< quantity: ${k.quantity}>`;
  }).join('/ ');

  playerWorldInfo.entry = playerWorldInfo.entry.replace(wiRegex, itemsInInventory);
  updateWorldEntry(
    state.character.worldInfoIndex,
    playerWorldInfo.keys,
    playerWorldInfo.entry,
    false
  );

  console.log(`END updateInventory(): updated player's inventory and WI with current items`);
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

/**
 * Bracket handler by Gnurro.
 * 
 * Removes backets from input text to handle them as placeholders
 * 
 * @param {string} text
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