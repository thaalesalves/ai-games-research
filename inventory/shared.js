const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;
const SHOOTING_WEAPON_REGEX = new RegExp(/(crossbow|bow)/i);
const WORN_REGEX = new RegExp(`(?<=WORN<you>:)(.*)(?=;)`);
const INVENTORY_REGEX = new RegExp(`(?<=INV<you>:)(.*)(?=.)`);

const SHOOTING_WEAPONS = [
  {
    name: 'bow',
    ammo: 'arrow',
    succesfulOutcome: [
      `You aim your bow at your opponent, and let exactly one arrow go. The arrow goes out swiftly, and`,
      `You shoot one arrow at your opponent, and`,
      `You're determined to kill your foe, and so you aim your bow at them, hoping to get a clear shot in their throat`,
      `You shoot your bow aiming at your opponent's face. Your arrow goes out swiftly and`,
      `You release the string of your bow, and the arrow goes out fast as wind.`
    ],
    noAmmoOutcome: [
      "You don't have any arrows for your bow.",
      "You try to shoot your bow, but when you release the string you realize there is no arrow there. You stand there looking like an idiot.",
      "You try to shoot your bow, but then realize you don't have any arrows. Your finger gets entangled in the bow's string, and you can't untie it.",
      "You try to shoot your bow, but then realize you don't have any arrows to do so. The string goes and comes back, and smacks you in the face.",
      "You realize you don't have any arrows. You throw your bow at your opponent instead.",
      "When you ready your bow, you realize you don't have any arrows, so you wield it like a sword and charge at your enemy."
    ]
  },
  {
    name: 'crossbow',
    ammo: 'bolt',
    succesfulOutcome: [
      `You quickly put a bolt in your crossbow, and aim it at your opponent. You pull the trigger and`,
      `You aim your crossbow at your opponent, and the bolt goes fast as wind. The bolt`,
      `You shoot your cross bow aiming at your opponent's throat. The bolt goes out fast as wind and`
    ],
    noAmmoOutcome: [
      "You don't have any bolts for your crossbow.",
      "You try to shoot your crossbow, but you don't have any bolts in it. Its recoil makes you drop it, and you bend down to get it, looking like an idiot.",
      "You shoot your crossbow, but no bolt comes out of it. That's because you don't have any bolts. You realize how dumb you are and stand there like an idiot."
    ]
  }
];

const WEAPONS = [
  'sword', 'knife', 'spear', 'hammer', 'axe', 'battleaxe', 'sledgehammer', 'longsword', 'bow', 'pickaxe'
];

const CLOTHING = [
  'rags', 'armor', 'dress', 'kilt', 'skirt', 'jerkin', 'shirt', 'clothes', 'robes', 'leathers', 'hooded', 'cuirass', 'chainmail', 'gauntlets', 'vambraces', 'tights'
];

const AMMO = [
  'arrow', 'bullet'
];

const AMMO_PLURAL = [
  'arrows', 'bullets'
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
 * Returns items currently equipped by the player
 */
function getWeaponEquipped() {
  console.log(`START getWeaponEquipped(): Looking for equipped weapons.`);
  const weaponEquipped = getInventory().find(weapon => weapon.status == 'worn' && weapon.type == 'weapon');
  if (typeof weaponEquipped != 'undefined') {
    console.log(`END getWeaponEquipped(): Player is equipping ${weaponEquipped.name}.`);
    return weaponEquipped;
  }

  console.log(`END getWeaponEquipped(): Player doesn't have any weapon equipped.`);
  return `You don't have any weapon equipped.`;
}

/**
 * Verifies if player has ammo
 *
 * @param {string} itemName 
 */
function getAmmo(itemName) {
  console.log(`START getAmmo(): Looking for ammo item: ${itemName}.`);
  return getInventory().find(item => {
    console.log(`INSIDE getAmmo(): looking up items in inventory. Current item: ${item.name}`);
    if (item.type == 'ammo' && (itemName.includes(item.name) || item.name.includes(itemName))) {
      if (item.status != 'worn') {
        equipItem(item.name);
        state.message = `You weren't equipping your ammo! You are now. `;
      }

      console.log(`INSIDE getAmmo(): found "${item.name}", which has correct type.`);
      item.quantity -= 1;
      return true;
    }

    console.log(`INSIDE getAmmo(): did not find any items with correct type.`);
    return false;
  });
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

/**
 * Singularizes a parameter
 * 
 * @param {string} itemName word to be singularized
 */
function singularize(itemName) {
  const checker = (input) => {
    return AMMO_PLURAL.some(word => input.toLowerCase().includes(word.toLowerCase())) ? itemName.replace(/s$/, '') : itemName;
  }

  return checker(itemName);
}

/**
 * Finds shooting weapon based on parameter
 * 
 * @param {string} action
 */
function findShootingWeapon(action) {
  console.log(`BEGIN findShootingWeapon(): getting shooting weapon from regex. Input action: "${action}"`);
  const weaponInput = SHOOTING_WEAPONS.find(i => (action.match(SHOOTING_WEAPON_REGEX) != null) && (action.match(SHOOTING_WEAPON_REGEX)[0] == i.name));
  let weaponReturn = undefined;
  getInventory().some(w => {
    if ((typeof weaponInput != 'undefined') && weaponInput.name.toLowerCase().trim().includes(w.name.toLowerCase().trim())) {
      console.log(`INSIDE findShootingWeapon(): Input extracted with regex: ${weaponInput.name}. Found weapon extracted from input in player's inventory.`);
      if (w.status != 'worn') {
        console.log(`INSIDE findShootingWeapon(): ${w.name} is not equipped. Equipping item.`);
        equipItem(w.name);
        state.message = `You are now equipping your ${w.name} and ${weaponInput.ammo} for ammo. `;
      }

      console.log(`END findShootingWeapon(): ${weaponInput.name} matches item in inventory.`);
      weaponReturn = weaponInput;
      return true;
    } else if (typeof weaponInput == 'undefined') {
      console.log(`INSIDE findShootingWeapon(): weaponInput is undefined. Searching inventory for item that matches a shooting weapon.`);
      let currentMatch = SHOOTING_WEAPONS.find(i => {
        if (w.name.match(SHOOTING_WEAPON_REGEX) != null) {
          return w.name.match(SHOOTING_WEAPON_REGEX)[0] == i.name;
        }
      });

      if (typeof currentMatch != 'undefined') {
        if (w.status != 'worn') {
          console.log(`INSIDE findShootingWeapon(): ${w.name} is not equipped. Equipping item.`);
          equipItem(w.name);
          state.message = `You are now equipping your ${w.name} and ${currentMatch.ammo} for ammo. `;
        }

        console.log(`END findShootingWeapon(): ${w.name} is a shooting weapon, returning this item.`);
        weaponReturn = currentMatch;
        return true;
      }
    }

    console.log(`END findShootingWeapon(): did not find matching shooting weapon in player's inventory.`);
    return false;
  });

  return weaponReturn;
}
