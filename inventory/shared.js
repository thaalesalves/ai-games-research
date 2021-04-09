const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;
const WEAPON_REGEX = new RegExp(/(crossbow|bow)/i);
const WORN_REGEX = new RegExp(`(?<=WORN<you>:)(.*)(?=;)`);
const INVENTORY_REGEX = new RegExp(`(?<=INV<you>:)(.*)(?=.)`);

const WEAPONS = [
  "dagger", "knife", "shuriken", "chakhram", "sword", "claymore", "zweihander", "rapier",
  "epee", "kukri", "trident", "katana", "cutlass", "scimitar", "nodachi", "tanto", "naginata",
  "spear", "pike", "axe", "halberd", "mace", "flail", "hammer", "pickaxe", "stiletto", "bow"
];

const CLOTHING = [
  "tunic", "breeches", "loincloth", "doublet", "cloak", "robe", "surcoat", "tabard",
  "trousers", "skirt", "dress", "gown", "socks", "gloves", "top hat", "waistcoat", "kilt",
  "cummerbund", "bowtie", "necktie", "tuxedo", "kimono", "karate gi", "toe socks", "sarong",
  "scarf", "legwarmers", "trenchcoat", "jacket", "shorts", "leggings", "blouse", "sweater",
  "cardigan", "wizard's hat", "feathered hat", "tutu", "rags", "armor", "jerkin", "shirt",
  "clothes", "leathers", "hood", "cuirass", "chainmail", "gauntlets", "vambraces", "bracers", "tights"
];

/**
 * Simple frunction to capitalize the first letter of a string
 * 
 * @param {string} string 
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Finds an item in the player's inventory
 * @param {string} itemName 
 */
function findItemInInventory(itemName) {
  console.log(`START findItemInInventory(): Looking for item "${itemName}" in player's inventory.`);
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let itemFound = getInventory().find((item) => {
    return item.name == loweredName;
  });

  if (typeof itemFound != 'undefined') {
    console.log(`END findItemInInventory(): Item "${itemName}" found. Returning it.`);
    return itemFound;
  }

  console.log(`END findItemInInventory(): Item "${itemName}" not found in inventory.`);
  return undefined;
}

/**
 * Removes an item from player's inventory
 * 
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
function removeFromInventory(itemName, itemQuantity) {
  console.log(`START removeFromInventory(): Removing ${itemQuantity} instances of "${itemName}" from player's inventory.`);
  let loweredName = singularize(itemName.toLowerCase().replace(PUNCTUATION_REMOVE, ''));
  let item = findItemInInventory(loweredName);
  if (typeof item == 'undefined') {
    console.log(`END removeFromInventory(): Did not find ${itemName} in player's inventory.`);
    return `\nYou do not have ${itemName} in your inventory.`;
  } else if (!(item.quantity == itemQuantity) && (item.quantity > 1 && item.quantity >= itemQuantity)) {
    console.log(`END removeFromInventory(): Found ${item.quantity} instances of "${itemName}" in player's inventory. Removing ${itemQuantity} instances of it.`);
    item.quantity -= itemQuantity;
    return `\nYou have removed ${itemQuantity} ${loweredName} from your inventory.`;
  }

  let index = getInventory().indexOf(item);
  getInventory().splice(index, 1);
  updateInventory();
  console.log(`END removeFromInventory(): Removed all instances of ${itemName} from player's inventory.`);
  return `\nYou have removed all ${loweredName} from your inventory.`;
}

/**
 * Checks player's inventory and returns what's inside
 */
function checkInventory() {

  console.log(`START checkInventory(): Checking player's inventory.`);
  if (getInventory().length > 0) {
    let items = getInventory().map((item) => item.name).join(', ');
    let itemsWorn = getInventory().filter((item) => item.status == 'worn').map((item) => item.name).join(', ');
    console.log(`END checkInventory(): Player's inventory contains: ${items}.`);
    return `\nYour inventory contains: ${items}. Items equipped: ${itemsWorn}.`;
  }

  console.log(`END checkInventory(): Player's inventory is empty.`);
  return `\nYour inventory is empty.`;
}

/**
 * Returns player's inventory. If the array in undefined, define it
 */
function getInventory() {
  console.log(`START getInventory(): verifying player's inventory.`);
  if (typeof state.inventory == 'undefined') {
    console.log(`INSIDE getInventory(): Inventory array is undefined. Declaring it with an empty array.`);
    state.inventory = [];
  }

  console.log(`END getInventory(): player's inventory exists. Returning its contents.`);
  return state.inventory;
}

/**
 * Adds item to player's inventory
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
function addToInventory(itemName, itemQuantity) {

  console.log(`START addToInventory(): adding ${itemQuantity} instances of "${itemName}" to player's inventory.`);
  let loweredName = singularize(itemName.toLowerCase().replace(PUNCTUATION_REMOVE, ''));
  let item = findItemInInventory(loweredName);
  if (typeof item == 'undefined') {
    console.log(`INSIDE addToInventory(): Player has no other instances of this item in their inventory. Adding these.`);
    item = {
      name: loweredName,
      quantity: itemQuantity,
      status: 'in inventory',
      type: getType(itemName)
    };

    state.inventory.push(item);
  } else {
    console.log(`INSIDE addToInventory(): Player already has other instances of this item in their inventory. Incrementing the quantity by ${itemQuantity}.`);
    item.quantity = item.quantity + itemQuantity;
  }

  updateInventory();
  console.log(`END addToInventory(): ${itemQuantity} instances of "${itemName}" added to player's inventory.`);
  return `\nYou have added ${itemQuantity} ${loweredName} to your inventory.`;
}

/**
 * Simple function to make the player equip something.
 * 
 * @param {string} itemName 
 */
function equipItem(itemName) {
  console.log(`START equipItem(): equipping ${itemName}`);
  const itemNameLowerCase = itemName.toLowerCase();
  let itemToBeEquipped = findItemInInventory(itemNameLowerCase);
  if (typeof itemToBeEquipped != 'undefined') {
    const itemToBeEquippedIndex = state.inventory.findIndex(x => x.name == itemToBeEquipped.name);
    console.log(`INSIDE equipItem(): ${itemName} exists in player's inventory`);
    if (itemToBeEquipped.type != 'weapon' && itemToBeEquipped.type != 'clothing' && itemToBeEquipped.type != 'ammo') {
      console.log(`END equipItem(): item is not equippable.`);
      return `\n${capitalize(itemNameLowerCase)} is not an equippable item.`;
    }

    let playerWorldInfo = worldEntries.find(x => x.keys.includes('you'));
    let itemsWorn = playerWorldInfo.entry.match(WORN_REGEX)[0];
    let oldItem = getInventory().find(oldItem => oldItem.status == 'worn' && oldItem.type == itemToBeEquipped.type);
    if (typeof oldItem != 'undefined') {
      const oldItemIndex = state.inventory.findIndex(x => x.name == oldItem.name);
      console.log(`INSIDE equipItem(): Player has another item of the same type equipped. Unequipping old item.`);
      itemsWorn.replace(oldItem.name.toLowerCase(), '');
      console.log(`INSIDE equipItem(): Removing worn status from ${oldItem.name}.`);
      oldItem.status = 'in inventory';
      state.inventory[oldItemIndex] = oldItem;
    }

    itemToBeEquipped.status = 'worn';
    state.inventory[itemToBeEquippedIndex] = itemToBeEquipped;
    itemsWorn = getInventory().filter((x) => x.status == 'worn')
      .map((k) => {
        console.log(`INSIDE equipItem(): worn item found in inventory -> ${k.name}`);
        return k.name;
      }).join('/');

    console.log(`INSIDE equipItem(): finished building new WORN string -> ${itemsWorn}`);
    playerWorldInfo.entry = playerWorldInfo.entry.replace(WORN_REGEX, itemsWorn);

    console.log(`END equipItem(): ${itemToBeEquipped.name} has been equipped.`);
    return `\nYou are now equipping ${itemToBeEquipped.name}.`;
  }

  console.log(`END equipItem(): Player does not have "${itemNameLowerCase}" in their inventory.`);
  return `\nYou do not have "${itemNameLowerCase}" in your inventory.`;
}

/**
 * Debugs your inventory and corrects the player's WI in case it fails
 */
function debugInventory() {
  console.log(`START debugInventory(): debugging player's inventory`);
  state.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes('you'));
  let playerWorldInfo = worldEntries.find(x => x.keys.includes('you'));

  let itemsWorn = playerWorldInfo.entry.match(WORN_REGEX)[0];
  let itemsInInventory = playerWorldInfo.entry.match(INVENTORY_REGEX)[0];

  itemsWorn = getInventory().filter((x) => x.status == 'worn')
    .map((k) => {
      console.log(`INSIDE debugInventory(): Updating player WI with worn items`);
      return k.name;
    }).join('/');

  itemsInInventory = getInventory().map((k) => {
    console.log(`INSIDE debugInventory(): Updating player WI with inventory items`);
    return `${k.name}< quantity: ${k.quantity}>`;
  }).join('/');

  playerWorldInfo.entry = playerWorldInfo.entry.replace(WORN_REGEX, itemsWorn);
  playerWorldInfo.entry = playerWorldInfo.entry.replace(INVENTORY_REGEX, itemsInInventory);

  console.log("INSIDE debugInventory(): Fixed player WI with inventory's items.");
  console.log(`END debugInventory(): Player's WI saved at index ${state.worldInfoIndex}.`);
}

/**
 * Updates the player's inventory and corrects the WI
 */
function updateInventory() {
  console.log(`START updateInventory(): updating player's inventory and WI with current items`);
  let playerWorldInfo = worldEntries.find(x => x.keys.includes('you'));
  let itemsInInventory = playerWorldInfo.entry.match(INVENTORY_REGEX)[0];
  itemsInInventory = getInventory().map((k) => {
    console.log(`INSIDE updateInventory(): Sorting inventory items and quantities into player WI`);
    return `${k.name}<quantity:${k.quantity}>`;
  }).join('/');

  playerWorldInfo.entry = playerWorldInfo.entry.replace(INVENTORY_REGEX, itemsInInventory);
  console.log(`END updateInventory(): updated player's inventory and WI with current items`);
}

/**
 * Function to determine item type
 * 
 * @param {string} itemType
 */
function getType(itemName) {
  const checker = (input) => {
    return WEAPONS.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'weapon' :
      CLOTHING.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'clothing' :
        AMMO_PLURAL.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'ammo' :
          AMMO.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'ammo' : 'misc';
  }

  return checker(itemName);
}
