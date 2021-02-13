const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;

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
    let items = '';
    getInventory().forEach((item) => {
      items += item.quantity + ' ' + item.name + ', ';
    });

    return `\nYour inventory contains: ${items}`;
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
      status: 'in inventory'
    };

    state.inventory.push(item);
  } else {
    item.quantity = item.quantity + itemQuantity;
  }

  return `\nYou have added ${itemQuantity} ${loweredName} to your inventory.`;
}

/**
 * Simple function to make the player wear something.
 * 
 * @param {string} itemName 
 */
const wearItem = (itemName) => {
  let item = findItemInInventory(itemName);
  if (typeof item != 'undefined') {
    item.status = 'Worn';
    state.memory.context += `The player is wearing ${item.name}`;
    return `\nYou are now wearing/wielding ${item.name}`;
  } else {
    return `You do not have \"${itemName}\" in your inventory.`;
  }
}