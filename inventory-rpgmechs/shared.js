const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;
const WORN_REGEX = new RegExp(`(?<=WORN:)(.*)(?=;)`);
const INVENTORY_REGEX = new RegExp(`(?<=INV:)(.*)(?=.)`);
const BRACKETED = /\[(.*?)\]/g;
const BRACKETS = /\[|\]/g;
const MATERIAL_REGEX = /(maple|oak|beech|hickory|yew|birch|ash|mahogany|nighwood|ruby ash|iron|steel|mithril|ebony|silver|brass|dwarven|rubedite|voidstone|calcinium|galatite|quicksilver|voidstone|orichalcum)/gi;

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

const possibleLines = [
  '"Welcome to the Bloated Goat! If you need anything, talk to me or to my wife Sigrid. We have warm beds and quality mead!". Isekaid smiles.\n',
  '"Need a room? We have warm beds and nice mead!". Isekaid smiles.\n',
  `"Need a room? Talk to me or my wife Sigrid, and we'll set you up!"\n`,
];

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
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let item = findItemInInventory(loweredName);
  if (!(item.quantity == itemQuantity) && (item.quantity > 1 && item.quantity >= itemQuantity)) {
    console.log(`END removeFromInventory(): Found ${item.quantity} instances of "${itemName}" in player's inventory. Removing ${itemQuantity} instances of it.`);
    item.quantity -= itemQuantity;
    return `\nYou have removed ${itemQuantity} ${loweredName} from your inventory.`;
  }

  let index = getInventory().indexOf(item);
  getInventory().splice(index, 1);
  updateInventory();
  console.log(`END removeFromInventory(): Found ${item.quantity} instances of "${itemName}" in player's inventory. Removing ${itemQuantity} instances of it.`);
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
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
  let item = findItemInInventory(loweredName);
  if (typeof item == 'undefined') {
    console.log(`INSIDE addToInventory(): Player has no other instances of this item in their inventory. Adding these.`);
    material = itemName.match(MATERIAL_REGEX) ? itemName.match(MATERIAL_REGEX)[0] : '';
    item = {
      name: loweredName,
      quantity: itemQuantity,
      status: 'in inventory',
      type: getType(itemName),
      material: material
    };

    if (item.type == 'weapon' || item.type == 'clothing') {
      switch (item.material) {
        /* metals */
        case 'iron':
          item.bonusDamage = 1;
          break;
        case 'steel':
          item.bonusDamage = 2;
          break;
        case 'mithril':
          item.bonusDamage = 3;
          break;
        case 'silver':
          item.bonusDamage = 3;
          break;
        case 'brass':
          item.bonusDamage = 3;
          break;
        case 'dwarven':
          item.bonusDamage = 3;
          break;
        case 'galatite':
          item.bonusDamage = 3;
          break;
        case 'calcinium':
          item.bonusDamage = 3;
          break;
        case 'quicksilver':
          item.bonusDamage = 4;
          break;
        case 'orichalcum':
          item.bonusDamage = 4;
          break;
        case 'ebony':
          item.bonusDamage = 5;
          break;
        case 'voidstone':
          item.bonusDamage = 5;
          break;
        case 'rubedite':
          item.bonusDamage = 5;
          break;

        /* wood */
        case 'maple':
          item.bonusDamage = 1;
          break;
        case 'oak':
          item.bonusDamage = 1;
          break;
        case 'beech':
          item.bonusDamage = 1;
          break;
        case 'hickory':
          item.bonusDamage = 2;
          break;
        case 'yew':
          item.bonusDamage = 2;
          break;
        case 'birch':
          item.bonusDamage = 2;
          break;
        case 'ash':
          item.bonusDamage = 3;
          break;
        case 'mahogany':
          item.bonusDamage = 3;
          break;
        case 'nighwood':
          item.bonusDamage = 4;
          break;
        case 'ruby ash':
          item.bonusDamage = 5;
          break;

        /* no match */
        default:
          item.bonusDamage = 0;
          break;
      }
    }

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
    const itemToBeEquippedIndex = getInventory().findIndex(x => x.name == itemToBeEquipped.name);
    console.log(`INSIDE equipItem(): ${itemName} exists in player's inventory`);
    if (itemToBeEquipped.type != 'weapon' && itemToBeEquipped.type != 'clothing') {
      console.log(`END equipItem(): item is not equippable.`);
      return `\n${capitalize(itemNameLowerCase)} is not an equippable item.`;
    }

    let playerWorldInfo = worldEntries.find(x => x.keys.includes('you'));
    let itemsWorn = playerWorldInfo.entry.match(WORN_REGEX)[0];
    let oldItem = getInventory().find(oldItem => oldItem.status == 'worn' && oldItem.type == itemToBeEquipped.type);
    if (typeof oldItem != 'undefined') {
      const oldItemIndex = getInventory().findIndex(x => x.name == oldItem.name);
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
    return `\nYou are now ${itemToBeEquipped.type == 'weapon' ? 'wielding' : 'wearing'} ${itemToBeEquipped.name}.`;
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
 * @param {string} itemName
 */
function getType(itemName) {
  const checker = (input) => {
    return WEAPONS.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'weapon' :
      CLOTHING.some(word => input.toLowerCase().includes(word.toLowerCase())) ? 'clothing' : 'misc';
  }

  return checker(itemName);
}

/**
 * Finds the weapon the player is currently wearing
 * 
 * @returns {object} currently equipped weapon
 */
function getEquippedWeapon() {
  console.log(`BEGIN getEquippedWeapon(): getting current weapon player's equipping`);
  return getInventory().find(w => {
    if (w.type == 'weapon' && w.status == 'worn') {
      console.log(`INSIDE getEquippedWeapon(): found "${w.name}", currently equipped.`);
      return w;
    }
  });
}

/**
 * Gets currently equipped weapon's bonus damage for rolls
 * 
 * @returns {number} weapon damage
 */
function getEquippedWeaponDamage() {
  if (typeof getEquippedWeapon() != 'undefined') {
    return getEquippedWeapon().bonusDamage;
  }

  return 0;
}

/**
 * Finds shooting weapon based on parameter
 * 
 * @param {string} action
 */
function findShootingWeapon(action) {
  console.log(`BEGIN findShootingWeapon(): getting shooting weapon from regex. Input action: "${action}"`);
  const weaponInput = SHOOTING_WEAPONS.find(i => (action.match(WEAPON_REGEX) != null) && (action.match(WEAPON_REGEX)[0] == i.name));
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
        if (w.name.match(WEAPON_REGEX) != null) {
          return w.name.match(WEAPON_REGEX)[0] == i.name;
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
 * Function that generates the initial prompt for the adventure
 */
function generatePrompt() {
  return possibleLines[Math.floor(Math.random() * possibleLines.length)];
}

/**
 * Function that parses the character's race when they're created. This determines the innkeeper's behavior towards the player.
 * 
 * @param {object} character
 */
function parseRace(character) {
  let race = character.race.toLowerCase();
  if (race.includes("orsimer") || race.includes("orc")) {
    race = 'Orsimer/Orc';
    possibleLines.push(
      `"Oh, great. An Orc. Don't bash into my stuff, freak.". You notice disdain in his voice.\n`,
      `"An Orc? Damn brutes. If you so much break a cup, I'll have the guards kick you from the city.". You notice disdain in his voice.\n`
    );
  } else if (race.includes("altmer") || race.includes("high elf")) {
    race = 'Altmer/High Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the White River!"\n`,
      `"Good, an Altmer. Now I'm happy.". He speech seems sarcastic.\n`
    );
  } else if (race.includes("dunmer") || race.includes("dark elf")) {
    race = 'Dunmer/Dark Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the White River!"\n`,
      `"What do you want here? Is your kind trying to take over Skyrim? Now a damn Dunmer is Empress!". You notice disdain in his voice.\n`
    );
  } else if (race.includes("bosmer") || race.includes("wood elf")) {
    race = 'Bosmer/Wood Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the White River!"\n`,
      `"Are you... a Bosmer? I've never seen one in real life. You ain't gonna eat me, right?". He seems frightened.\n`,
      `"You're a Bosmer? Is it true that you eat people's flesh?". He seems frightened.\n`
    );
  } else if (race == 'nord') {
    possibleLines.push(
      `"Welcome, friend! How can I help a ${character.gender == 'male' ? 'brother' : 'sister'} Nord?"\n`,
      `"You must be cold, friend. Here, have a mug of mead on the house.". He hands you a mug of mead.\n`
    );
  } else if (race == 'breton') {
    possibleLines.push(
      `"Oh, a midget. How can I help you, friend?", Isekaid laughs.\n`,
      `"A Breton in these parts? Are you lost, friend?"\n`
    );
  } else if (race == 'imperial') {
    possibleLines.push(
      `"An Imperial in these parts? Are you lost, friend?"\n`,
      `"An Imperial? It's a long way from Cyrodiil, friend. Need a bed to rest?"\n`
    );
  } else if (race == 'khajiit') {
    possibleLines.push(
      `"Here, kitty kitty kitty.". He laughs out loud. "I'm just joking, friend. What do you need?"\n`,
      `"Oh, a cat on two legs. Don't leave fur in our stuff. We're a hygienic bunch."\n`
    );
  } else if (race == 'argonian') {
    possibleLines.push(
      `"Good day, lizard. How may I help you?"\n`,
      `"A lizard? Nasty.". He seems disgusted at you.\n`
    );
  } else if (race == 'redguard') {
    possibleLines.push(
      `"Good day, friend. Keeping well? It's a long way from Hammerfell. Enjoy your stay in Whiterun."\n`,
      `"A Redguard? You're good people. Strong and foolhardy like us Nords, not a bunrch of milk-drinkers like these damned elves."\n`
    );
  } else {
    possibleLines.push(
      `"Oh, you're a weird one, aren't you?". He laughs. "What race are you, ${character.gender == 'male' ? 'lad' : 'lass'}?"`,
      `"Oh, you're a weird one. What race are you? Doesn't matter, my family and I don't judge. What do you need, friend?". Isekaid smiles.\n`,
      `"Oh... hello...". Isekaid looks at you and raises his eyebrow. He's clearly confused because you don't look like any known race. "Do... you... need something?"\n`,
      `"Oh... you're on of those... people.". Isekaid looks at you and raises his eyebrow. He's clearly confused because you don't look like any known race. "Do you... need something?"\n`
    );
  }
}

/**
 * Function that parses the character's race when they're created. This determines the innkeeper's behavior towards the player.
 * 
 * @param {object} character
 */
function parseClass(character) {
  let charClass = character.class.toLowerCase();
  switch (charClass) {
    case 'mage':
      state.charClass = classDB.mage.skills;
      addToInventory('Apprentice Mage Robes', 1);
      equipItem('Apprentice Mage Robes');
      possibleLines.push(
        `"Oh, a mage? That's an impressive craft, friend. Have a mug of mead on the house!". Isekaid smiles.\n`,
        `"Oh, a mage? I'm impressed your types haven't blown up all of the world yet. No magic allowed in my inn!". Isekaid seems annoyed by the fact that you're a mage.\n"`
      );
      break;
    case 'warrior':
      state.charClass = classDB.warrior.skills;
      addToInventory('Rusty Iron Sword', 1);
      addToInventory('Rusty Iron Armor', 1);
      equipItem('Rusty Iron Sword');
      equipItem('Rusty Iron Armor');
      possibleLines.push(
        `"You look strong, friend. Here to join the Companions? Go up to Jorrvaskr. They need folk like you.". Isekaid smiles.\n`,
        `"A fellow warrior? ${character.race.toLowerCase().includes('nord') ? `A true Nord. Here's a mug od mead. And that's on me, friend! May you be worthy of Sovngarde!`
          : `I respect warriors. Here's a mug of mead on the house!`}". Isekaid smiles.\n`
      );
      break;
    case 'ranger':
      state.charClass = classDB.ranger.skills;
      addToInventory('Wooden Bow', 1);
      addToInventory('Leather Tights', 1);
      equipItem('Wooden Bow');
      equipItem('Leather Tights');
      possibleLines.push(
        `"Oh, you fancy the bow? Smart techniques. Bet you never run out of good meat to eat, huh?". Isekaid laughs.\n`,
        `"A hunter! Hunters and farmers alike are the ones who provide us with food. May your hunt be fruitful, friend!". Isekaid smiles.\n`
      );
      break;
    case 'thief':
      state.charClass = classDB.thief.skills;
      addToInventory('Rusty Iron Dagger', 1);
      addToInventory('Leather Tights', 1);
      equipItem('Rusty Iron Dagger');
      equipItem('Leather Tights');
      break;
    case 'nightblade':
      state.charClass = classDB.nightblade.skills;
      addToInventory('Rusty Iron Dagger', 1);
      addToInventory('Leather Tights', 1);
      equipItem('Rusty Iron Dagger');
      equipItem('Leather Tights');
      break;
    case 'bard':
      state.charClass = classDB.bard.skills;
      addToInventory('Rusty Iron Dagger', 1);
      addToInventory('Linen Quilted Clothes', 1);
      addToInventory('Lute', 1);
      equipItem('Rusty Iron Dagger');
      equipItem('Linen Quilted Clothes');
      break;
    default:
      state.message = 'You have chosen a class that is not one of the options. You have no items.';
      console.log('No valid class selected.');
      break;
  }
}

/**
 * Grabs placeholders inside brackets and store them in state
 * 
 * @param {string} text
 */
function grabAllBrackets(text) {
  for (var entry of text.match(BRACKETED)) {
    entry = entry.replace(BRACKETS, '');
    if (!state.placeholders) {
      state.placeholders = [];
    }
    state.placeholders.push(entry);
  }
  console.log(state.placeholders);
  console.log("Grabbed brackets:" + state.placeholders.join(", "))
}

/**
 * Removes brackets from bracketed words so they're usable in prompt
 * @param {string} index 
 * @returns 
 */
function grabBracket(index) {
  return (text.match(BRACKETED)[index].replace(BRACKETS, ''))
}

const introBracketConfig = {
  brackets: [
    "name",
    "class",
    "petType",
    "petName"
  ]
}

const miscConfig = {
  successMessage: `Success!`,
  failMessage: `Fail!`,
  messageStatIcon: true,
  showXP: true,
}

/**
 * Gets the skill list for the players' characters
 */
const skillDB = {
  lockpick: {
    menuString: "Lockpicking",
    triggers: ["(break(ing|)|pick(ing|)).*(a|the) lock"],
    overrideAtt: true,
    results: {
      positive: ["You manage to break the lock succesfully."],
      negative: ["You break your pick trying to break the lock."]
    }
  },
  speechcraft: {
    menuString: "Speechcraft",
    triggers: ["(intimidat(e|ing)|convinc(e|ing)|persuad(e|ing)).*(her|him|you|them)"],
    overrideAtt: true,
    results: {
      positive: ["Your honeyed words work!"],
      negative: ["Thank the Gods you're not a diplomat, huh? You fail at your speechcraft attempt."]
    }
  },
  pickpocket: {
    menuString: "Pickpocketing",
    triggers: ["((rob(bing|)|mug(ging)).*(him|her|them))|(pick(ing|)( the | her | his | their |)pocket(ing|))"],
    overrideAtt: true,
    results: {
      positive: ["You manage to pick this person's pocket and steal their things without being noticed."],
      negative: [`"What the fuck?", the person says. "A fucking thief! Guards! Someone!", they start yelling.`]
    }
  },
  arts: {
    menuString: "Arts",
    triggers: ["(draw|play|paint(ing|)).*(((guitar|lute|flute)|(picture|portrait)|(drawing))|)"],
    overrideAtt: true,
    results: {
      positive: ["You're an artist! You art is amazing!"],
      negative: ["Your art skills are pretty bad."]
    }
  },
  alchemy: {
    menuString: "Alchemy",
    triggers: ["((mash|ferment|brew)(ing|)|((mak|prepar|infus)(e|ing))).*((brew|mixture|philter|elixir|medicine|tonic|draft|tincture|potion|concoction|infusion)(s|))"],
    overrideAtt: true,
    results: {
      positive: ["You finish working the mortar and pestle, and manage to brew the concoction."],
      negative: ["You drop the mortar and pestle, and the ingredients are all over the floor. You wasted your ingredients and failed making the mixture."]
    }
  },
  conjuration: {
    menuString: "Conjuration",
    triggers: ["(((summon)(ing|))|(conjur(e|ing)|))"],
    overrideAtt: true,
    results: {
      positive: ["You move your hands around, making the gestures of a summoning ritual. A portal opens in front of you, and a figure starts coming out of it."],
      negative: ["You don't manage to concentrate enough, and you waste your Magicka in a failed attempt at conjuring"]
    }
  },
  restoration: {
    menuString: "Restoration",
    triggers: ["((cast|heal)(ing|)).((spell|magic)(s|))"],
    overrideAtt: true,
    results: {
      positive: ["You concentrate your Magicka in your hands, and you feel the energy take over you. Healing energy goes out of your hands and into"],
      negative: ["You concentrate your Magicka in your hands, but it is too much for you to bear. Instead of healing, you end up accidentaly burning your own hands."]
    }
  },
  destruction: {
    menuString: "Destruction",
    triggers: ["((cast)(ing|)).*(spell|fire|water|wind|flame|frost)"],
    overrideAtt: true,
    results: {
      positive: ["You concentrate your Magicka in your hands, and do a smirky face looking at your opponent. You aim at them, and let it all go out of your hands, hitting them"],
      negative: ["You concentrate your Magicka in your hands, but you lose control of your energy, and your spell hurts you instead."]
    }
  },
  alteration: {
    menuString: "Alteration",
    triggers: ["((cast(ing|)).*(transmut(e|ation)|paralyz(ation|e|ing)|telekinesis|waterbreath(ing|)|flesh)|teleport(ation|ing|))"],
    overrideAtt: true,
    results: {
      positive: ["You cast your spell."],
      negative: ["You fail at casting your spell."]
    }
  },
  illusion: {
    menuString: "Illusion",
    triggers: ["((cast(ing|)).*(illusion|clairvoyance|calm|fear|frenzy|muffle)(ing|))"],
    overrideAtt: true,
    results: {
      positive: ["You cast your spell."],
      negative: ["You fail at casting your spell."]
    }
  },
  blade: {
    menuString: "Blade",
    triggers: ["((fight|attack|thrust|hack)(ing|)|(stab(bing|))|(charg(e|ing))).*((blade|sword|dagger|sabre|katana|knife|ax(e|))|(him|her|them))"],
    overrideAtt: true,
    results: {
      positive: ["You hold your weapon and squint at your opponent. You brandish your blade and hit them with it."],
      negative: ["You charge at your opponent, trying to hit them with your blade, but it falls from your hand."]
    }
  },
  blunt: {
    menuString: "Blunt",
    triggers: ["((attack|blow|beat)(ing|)|(charg(e|ing))|(hit(ting|))).*((hammer(ing|)|club)|(him|her|them))"],
    overrideAtt: true,
    results: {
      positive: ["You hold your weapon and squint at your opponent. You brandish it and hit them with it."],
      negative: ["You charge at your opponent, trying to hit them with your weapon, but it falls from your hand."]
    }
  },
  melee: {
    menuString: "Melee",
    triggers: ["((attack|beat)(ing|)|(charg(e|ing))|(hit(ting|))).*((hand|fist)(s|)|(him|her|them))"],
    overrideAtt: true,
    results: {
      positive: ["You are great at setting this up."],
      negative: ["You mess up the construction."]
    }
  },
  block: {
    menuString: "Block",
    triggers: ["((defend|block)(ing|)).*(from|).*(him|them|his|her(s|)|their(s|))(.*(blow|attack|sword|ax(e|)|hammer|club|dagger|sabre|katana|knife|blade)|)"],
    overrideAtt: true,
    results: {
      positive: ["Your enemy attacks you, but you manage to block their attack very well."],
      negative: ["Your enemy attacks you, and you try to block their move, but you're too slow. Your enemy hits you."]
    }
  },
  marksmanship: {
    menuString: "Marksmanship",
    triggers: ["((us(e|ing))|shoot(ing|))(.*(((cross|)bow|arrow)(s|))|)"],
    overrideAtt: true,
    results: {
      positive: ["You shoot your foe, and it hits them swiftly."],
      negative: ["You fail to shoot your enemy."]
    }
  },
  sneak: {
    menuString: "Sneaking",
    triggers: ["((sneak|crouch|stealth)(ing|)|noiseless|without making (any |)noise)"],
    overrideAtt: true,
    results: {
      positive: ["You go in full stealth, and is not detected."],
      negative: ["You try to go stealthly, but you trip and make a lot of noise."]
    }
  },
};

/**
 * Gets the class list for the players' characters
 */
const classDB = {
  mage: {
    skills: ['melee', 'alchemy', 'conjuration', 'restoration', 'destruction', 'alteration', 'illusion']
  },
  warrior: {
    skills: ['melee', 'blunt', 'blade', 'block']
  },
  ranger: {
    skills: ['melee', 'marksmanship', 'sneak', 'acrobatics', 'athletics']
  },
  thief: {
    skills: ['melee', 'sneak', 'acrobatics', 'athletics', 'lockpick', 'speechcraft', 'pickpocket']
  },
  nightblade: {
    skills: ['melee', 'blunt', 'blade', 'sneak', 'acrobatics', 'athletics']
  },
  bard: {
    skills: ['melee', 'speechcraft', 'arts', 'blunt', 'blade', 'restoration', 'illusion']
  }
};

statConfig = {
  inputBot: "ElderScrollsInputDCAttributeBot",
  botOutputs: {
    stat: `Attribute`,
    dc: `DC`,
    cuz: `reason`,
  },
  rolling: {
    checkRollRange: [1, 20],
  },
  //statList: {
  // unknown: {
  //   name: "Unknown",
  //   tag: "UNK",
  //   icon: "???",
  //   successAdjective: "good",
  //   failAdjective: "bad",
  //   ignoreForMenu: true
  // },
  //   strength: {
  //     name: "Strength",
  //     tag: "STR",
  //     icon: "💪",
  //     successAdjective: "strong",
  //     failAdjective: "weak",
  //     ignoreForMenu: true
  //   },
  //   agility: {
  //     name: "Agility",
  //     tag: "AGL",
  //     icon: "🏃‍♂️",
  //     successAdjective: "agile",
  //     failAdjective: "stiff",
  //     ignoreForMenu: true
  //   },
  //   constitution: {
  //     name: "Constitution",
  //     tag: "CON",
  //     icon: "🦵",
  //     successAdjective: "nimble",
  //     failAdjective: "clumsy",
  //     ignoreForMenu: true
  //   },
  //   intelligence: {
  //     name: "Intelligence",
  //     tag: "INT",
  //     icon: "🧠",
  //     successAdjective: "smart",
  //     failAdjective: "dumb",
  //     ignoreForMenu: true
  //   },
  //   wisdom: {
  //     name: "Wisdom",
  //     tag: "WIS",
  //     icon: "🦉",
  //     successAdjective: "wise",
  //     failAdjective: "oblivious",
  //     ignoreForMenu: true
  //   },
  //   personality: {
  //     name: "Personality",
  //     tag: "PER",
  //     icon: "😎",
  //     successAdjective: "cool",
  //     failAdjective: "annoying",
  //     ignoreForMenu: true
  //   },
  //   willpower: {
  //     name: "Willpower",
  //     tag: "WPR",
  //     icon: "🔥",
  //     successAdjective: "sheer",
  //     failAdjective: "thick-headed",
  //     ignoreForMenu: true
  //   }
  // },
  statList: {
    unknown: {
      name: "Unknown",
      tag: "UNK",
      icon: "???",
      successAdjective: "good",
      failAdjective: "bad",
      ignoreForMenu: true
    },
    intelligence: {
      name: "Intelligence",
      tag: "INT",
      icon: "🧠",
      successAdjective: "smart",
      failAdjective: "dumb",
    },
    wisdom: {
      name: "Wisdom",
      tag: "WIS",
      icon: "🤔",
      successAdjective: "wise",
      failAdjective: "oblivious",
    },
    charisma: {
      name: "Charisma",
      tag: "CHA",
      icon: "😎",
      successAdjective: "impressive",
      failAdjective: "annoying",
    },
    strength: {
      name: "Strength",
      tag: "STR",
      icon: "💪",
      successAdjective: "strong",
      failAdjective: "weak",
    },
    dexterity: {
      name: "Dexterity",
      tag: "DEX",
      icon: "💃",
      successAdjective: "nimble",
      failAdjective: "clumsy",
    },
    constitution: {
      name: "Constitution",
      tag: "CON",
      icon: "😣",
      successAdjective: "tough",
      failAdjective: "scrawny",
    },
  },
  starting: {
    level: 0,
    points: 5,
    cost: 1,
  },
  raise: [
    { threshold: 4, newCost: 2 },
    { threshold: 9, newCost: 3 },
  ],
  locking: {
    lockTriggers: [`walk`, `breathe`, 'ask', 'say', 'head', 'run', 'go', 'shout', 'yell', 'question', 'follow', 'laugh', 'smile'],
    lockArbitraryChecks: true
  }
}

const skillConfig = {
  starting: {
    points: 10,
    level: 0,
  },
  forbidRandom: true
}

/**
 * Stuff that does context notes independent of skill use or checks and prolly sth for checks as well
 * @returns object with feats
 */
const featDB = {}

/**
 * Misc helper function that gets random number
 * @param {number} min 
 * @param {number} max 
 * @returns random number within given limits
 */
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Misc helper function that picks an item from a list
 * @param {array} list 
 * @returns random item from given list
 */
function getRndFromList(list) {
  return (list[getRndInteger(0, list.length)]);
}

/**
 * Makes neat modifier strings with adaptive +/- depending on given value
 * @param {number} int 
 * @returns 
 */
function makeModString(int) {
  if (Number.isInteger(int)) {
    if (int >= 0) {
      string = "+" + int;
    } else {
      string = "-" + Math.abs(int);
    }
  } else {
    string = "";
  }
  return (string);
}

function inputTypeCheck(inputText) {
  let doTriggered = inputText.match(/> You /gi)
  let sayTriggered = inputText.match(/> You (say|ask)/gi)
  let greaterTriggered = inputText.match(/> /gi)

  if (sayTriggered) {
    RPGmechsLog("'> You say' in input - [say] triggered!")
    return (`say`)
  } else if (doTriggered) {
    RPGmechsLog("'> You' in input - [do] triggered!")
    return (`do`)
  } else if (greaterTriggered) {
    RPGmechsLog("'>' in input - [>story] triggered!")
    return (`greater`)
  } else {
    RPGmechsLog("No '>' or '> You' in input - [story] triggered!")
    return (`story`)
  }
}

function RPGmechsLog(msg) {
  if (state.RPGstate.doLog) {
    console.log(msg)
  }
}

function capFirstLetter(string) {
  return (string.charAt(0).toUpperCase() + string.slice(1))
}

function displayStatsUpdate([inKey, inValue, inColor]) {
  if (!state.displayStats) {
    state.displayStats = []
  }

  let displayStatUpdated = false
  for (let displayStat of state.displayStats) {
    RPGmechsLog(`Checking '${displayStat.key}' displayStats entry...`)
    let curDisplayStatIndex = state.displayStats.indexOf(displayStat)
    if (displayStat.key === inKey || displayStat.key === '\n' + inKey) {
      RPGmechsLog(`Found '${inKey}' displayStats entry: ${state.displayStats[curDisplayStatIndex].key}, ${state.displayStats[curDisplayStatIndex].value}, ${state.displayStats[curDisplayStatIndex].color}, updating!`)
      if (inValue) {
        if (typeof (inValue) == 'string') {
          RPGmechsLog(`Value to update displayStat entry inputted: '${inValue}', updating.`)
          state.displayStats[curDisplayStatIndex].value = inValue
        } else {
          RPGmechsLog(`Value to update displayStat entry inputted: '${inValue}', updating.`)
          state.displayStats[curDisplayStatIndex].value = inValue
        }
      } else {
        RPGmechsLog(`No value to update displayStat inputted, removing entry.`)
        state.displayStats.splice(curDisplayStatIndex, 1)
        displayStatUpdated = true
        break
      }

      if (inColor) {
        state.displayStats[curDisplayStatIndex].color = inColor
      }

      displayStatUpdated = true
      break
    }
  }

  if (displayStatUpdated === false && inValue?.length > 0) {
    RPGmechsLog(`No ${inKey} displayStats entry found, adding it!`)
    if (state.displayStats.length > 0) {
      inKey = '\n' + inKey
    }

    state.displayStats.push({ 'key': inKey, 'value': inValue, 'color': inColor })
  }
}

/********************************/
/*** Zaltys' name synthesizer ***/
/********************************/
BADNAMES = ['Ackerson', 'Alison', 'Annah', 'Arat', 'Arrorn', 'Ashton', 'Azajaja', 'Big Red',
  'Brot', 'Brother Gray', 'Bucklesberg', 'Captain Dario', 'Captain Eckard', 'Captain Hayes', 'Captain Ian', 'Captain Illam', 'Carn',
  'Castus', 'Cloudpeak', 'Count Gray', 'Count Grey', 'Dark Order', 'David', 'Delantium', 'Delerg', 'Dendrin', 'Derg',
  'Dert', 'Dessel', 'Dorna', 'Dr. Kessel', 'Dr. Kovas', 'Drake', 'Draven', 'Durge', 'Ebony Claw', 'Elam',
  'Eldolith', 'Eliza', 'Eternals', 'Father Féval', 'Father Tomas', 'Felkan', 'Flog', 'Garrick', 'Grolik', "Gro'tesk", 'Haygarth',
  'Hessla', 'Holgard', "J'Arel", 'Jacob', 'Jicol', 'Karth', 'Kelso', 'Merk', 'Mihrab', 'Mr. Demar', 'Mr. Gaange', 'Mr. Reynolds', 
  'Nalin', 'Nolazir', 'Null', 'Nuro', 'Oalkwardner', 'Olive', 'Olivia', 'Oren', 'Quala', 'Ragnor', 'Rask', 'Retlad', 'Roldan', 
  'Rolomag', 'Sheriff Buckly', 'Sir Ignate', 'Sodran', 'Svelk', 'Talia', 'Teckleville', 'The Craxil', 'The Ghoul King',
  'The Great Lich Lord', 'The Nightmare Tyrant', 'Theo', 'Trelik', 'Tulan', 'Ulivik', 'Vaughn', 'Velzix', 'Wessel', 'Zalan', 'Zalmora', 'Zuzu'];

// This shuffles the arrays.
const shuffle = array =>
  [...Array(array.length)]
    .map((...args) => Math.floor(Math.random() * (args[1] + 1)))
    .reduce((a, rv, i) => ([a[i], a[rv]] = [a[rv], a[i]]) && a, array);

// Generates and saves arrays; ran only once.
function makeArrays() {
  state.mid = [];
  state.end = [];
  list = state.names.map(x => x.substring(1)); // Trim beginning.
  list.forEach(addMid);
}

function addMid(seg) { // Generate array of possible mid-segments.
  while (seg.length > 3) {
    if (state.mid.indexOf(seg.substring(0, 4)) === -1) { state.mid.push(seg.substring(0, 4)) };
    seg = seg.substring(1);
  }
  state.end.push(seg);
}

function synthName() {
  var name_length = state.names[Math.floor(Math.random() * state.names.length)].length - 1;
  var base = state.names[Math.floor(Math.random() * state.names.length)];
  if (base.length < 3) { return Base; }
  else {
    var nomen = base.substring(0, 3);
    while (nomen.length < name_length) {
      mid = shuffle(state.mid).find(x => nomen.substring(nomen.length - 2, nomen.length) == x.substring(0, 2))
      if (mid) { nomen += mid.substring(2); }
      else { name_length = 0; } // No valid segments found, just skip ahead.
    }
    var end = shuffle(state.end).find(x => nomen.substring(nomen.length - 1, nomen.length) == x.substring(0, 1));
    if (end) { nomen += end.substring(1); }
    return nomen;
  }
}

function nameReplace(text) {
  if (!state.names_setup) { setupNamelist(); }
  for (name of BADNAMES) {
    if (text.includes(name)) { text = text.replace(name, synthName()); }
  }
  return text;
}

// This giant list is the list of names that this generator uses as examples to synthesize new names.
// You can replace it with a more specific list, such as names from certain culture.
// To work well, you need at least 100 names on the list.
function setupNamelist() {
  state.names_setup = true;
  state.names = ["Aby", "Aage", "Aakesh", "Aanon", "Aarlen", "Aaron", "Aart", "Aasta", "Abarden", "Abbathor", "Abbathorn", "Abraham", "Abryn",
    "Abu", "Acadia", "Achard", "Acheron", "Achim", "Achlarg", "Ada", "Adair", "Adalbert", "Adanac", "Adario", "Adeisteen", "Adelaide",
    "Adelin", "Adelot", "Adeen", "Aden", "Adena", "Aderyn", "Adeva", "Adger", "Adia", "Adin", "Adina", "Aditu", "Adlay",
    "Adolf", "Adolmus", "Adoniram", "Adraeran", "Adriaan", "Adriel", "Adrienne", "Aedha", "Aeiran", "Ael", "Aelgifu", "Aelis", "Aerdrie",
    "Aeriel", "Aerin", "Aeris", "Aeriss", "Aeron", "Aeru'in", "Aeruin", "Aethelweard", "Aethon", "Aethyr", "Afra", "Agate", "Agatha",
    "Agathon", "Agathos", "Agenor", "Agidius", "Agnar", "Agora", "Agrias", "Aguidran", "Aguilla", "Ahanna", "Ahmre", "Aicha", "Aidan",
    "Aidaron", "Aiden", "Aidred", "Aidro", "Aidwin", "Aifreda", "Aifrida", "Aiker", "Aikikia", "Aikman", "Ailcaer", "Aileen", "Ailric",
    "Ailvar", "Aimee", "Aimo", "Aino", "Ainu", "Aipheus", "Airalyn", "Aircristir", "Airen", "Airis", "Airmid", "Aisha", "Aislinn",
    "Aithne", "Aitken", "Akebia", "Aki", "Akira", "Aksel", "Al", "Aladan", "Aladar", "Aladdin", "Alain", "Alaine", "Alais",
    "Alan", "Alana", "Alanson", "Alardan", "Alaric", "Alarion", "Alaris", "Alaron", "Alastair", "Alastrina", "Alastyr", "Albaral", "Alberich",
    "Alberik", "Alberon", "Albert", "Alberta", "Albin", "Albion", "Albrecht", "Albright", "Alcan", "Alcina", "Alda", "Aldaren", "Aldegond",
    "Alden", "Aldert", "Aldhelm", "Aldis", "Aldrich", "Aldridge", "Aldus", "Aldwerth", "Aldwin", "Aldwulf", "Alea", "Alec", "Alena",
    "Alers", "Ales", "Alessandra", "Alexander", "Alexei", "Alf", "Alfdis", "Alfgeir", "Alfhid", "Alfons", "Alford", "Alfred", "Algernon",
    "Algus", "Alhana", "Ali", "Alia", "Alicia", "Aliendre", "Alienor", "Alin", "Aline", "Alineric", "Alisbone", "Alison", "Alistair",
    "Alister", "Allaire", "Allard", "Allart", "Allene", "Alliston", "Almas", "Almer", "Almira", "Almroth", "Almu", "Aloise", "Alor",
    "Alora", "Alorosaz", "Aloysius", "Alphons", "Alrik", "Alsop", "Althalus", "Altin", "Alton", "Alured", "Alvan", "Alvey", "Alvina",
    "Alvord", "Alvred", "Alwen", "Alwyn", "Alya", "Alyanna", "Alyce", "Alyssa", "Alyvia", "Ama", "Amadis", "Amain", "Amalina",
    "Aman", "Amanfea", "Amar", "Amarah", "Amber", "Ambros", "Amelia", "Ames", "Amethyst", "Amilion", "Amin", "Amina", "Amineh",
    "Ammdar", "Amschel", "Amundi", "Anandra", "Anastasia", "Anatol", "Anatolia", "Ancarion", "Ancelyn", "Anclaiar", "Ancla´ar", "Andara'an", "Andaraan",
    "Andemon", "Andni", "Andolan", "Andre", "Andrei", "Andrew", "Andrus", "Aneurin", "Anfar", "Angelica", "Angelina", "Angharad", "Angheryn",
    "Angmar", "Angus", "Anici", "Anigh", "Anika", "Anita", "Anitra", "Anlaf", "Anna", "Annion", "Annora", "Anouar", "Anseim",
    "Ansel", "Anskar", "Anson", "Antal", "Antalya´ar", "Antares", "Antheirne", "Anton", "Antone", "Antony", "Antrim", "Anvar", "Anya",
    "Anzie", "Apad", "April", "Apthorp", "Aquill", "Arabel", "Arabella", "Arabeth", "Aradan", "Aradh", "Aragon", "Aragorn", "Arakin",
    "Aralik", "Aranel", "Arania", "Arathorn", "Aravis", "Arawn", "Arax", "Araz", "Archibald", "Arcarune", "Arctor", "Ardal", "Arden",
    "Arder", "Ardesh", "Ardis", "Areagne", "Arell", "Areta", "Aretas", "Argethlam", "Argoeth", "Ari", "Aria", "Ariad", "Arian",
    "Arianth", "Aribeth", "Aric", "Arid", "Ariel", "Aries", "Arilyn", "Arioch", "Arka", "Arkadia", "Arkron", "Arkwright", "Arlaith",
    "Arlan", "Arlana", "Arlean", "Arleano", "Arlo", "Arlya", "Armand", "Armar", "Armin", "Armitage", "Armo", "Armod", "Arn",
    "Arnbella", "Arnesen", "Arnfinn", "Arngrim", "Arni", "Arnlaug", "Arno", "Arnold", "Arnor", "Arnora", "Arnot", "Arnthora", "Arnuif",
    "Arnulf", "Arnvid", "Aron", "Arrah", "Arronax", "Arshavir", "Arshel", "Artemis", "Artemus", "Arthol", "Arthryn", "Arthur", "Artnistead",
    "Artreyu", "Artur", "Arun", "Arvid", "Arvida", "Arving", "Arvo", "Arwen", "Arwin", "Aryen", "Aryion", "Aryon", "Aryus",
    "Arzamark", "Asa", "Asaf", "Aschar", "Asfrid", "Asgard", "Asger", "Asgerd", "Asgrim", "Ash", "Ashan", "Ashane", "Ashburton",
    "Ashcar", "Ashdown", "Ashgaroth", "Ashley", "Ashlyn", "Ashne'e", "Ashnici", "Ashur", "Asiria", "Askew", "Askold", "Aslak", "Aslan",
    "Asleif", "Aslior", "Asperon", "Asta", "Astar", "Astinus", "Astnid", "Astnild", "Astoiphe", "Astra", "Astraea", "Astran", "Astrid",
    "Astrin", "Atazra", "Athabasca", "Athana", "Athol", "Atiaran", "Atli", "Atmeh", "Atreyu", "Atropos", "Atticus", "Attor", "Atul",
    "Aturin", "Atyre", "Aubrey", "Aud", "Audrey", "Audrianna", "Audric", "August", "Augustus", "Aule", "Aulius", "Aun", "Aura",
    "Aurian", "Auril", "Aurion", "Aurora", "Avall", "Avarath", "Avascaen", "Avedar", "Aveole", "Avery", "Avon", "Avril", "Axel",
    "Aya", "Ayame", "Ayaron", "Ayarèn", "Ayin", "Ayir", "Aylin", "Aylmer", "Ayrie", "Azeal", "Azeezeh", "Azgoth", "Azhrarn",
    "Aziz", "Azmodeus", "Azrean", "Azreck", "Azriaz", "Aztira", "Azure", "Azuth", "Baba", "Babacar", "Babrak", "Babrine", "Babylos",
    "Baduk", "Baern", "Baeron", "Baervan", "Bag", "Bahamut", "Baird", "Bal", "Balain", "Baldor", "Baldrick", "Balduin", "Baldur",
    "Baldwin", "Balendar", "Balfour", "Balin", "Baliol", "Ballard", "Balor", "Balthasard", "Balthazar", "Bandobras", "Bane", "Baraca", "Barahir",
    "Barak", "Baralan", "Baravar", "Barbara", "Bardach", "Bardel", "Bardi", "Bardsley", "Bardwell", "Barend", "Barent", "Baring", "Barll",
    "Barlo", "Barlow", "Barnabas", "Barnas", "Barnus", "Barr", "Barret", "Barron", "Barry", "Barstow", "Barthel", "Bartle", "Bartnel",
    "Barton", "Baslayan", "Bayard", "Beams", "Beatrix", "Bechir", "Beck", "Bede", "Bedegran", "Begnus", "Beldaran", "Beldas", "Belerion",
    "Belgarath", "Belgarion", "Belita", "Bella", "Belle", "Bellin", "Bellinus", "Belloc", "Belrene", "Beltane", "Belva", "Ben", "Benekander",
    "Bengt", "Benita", "Benoist", "Beorn", "Beowulf", "Bera", "Bercan", "Berek", "Berem", "Beren", "Bergen", "Bergthor", "Berim",
    "Bern", "Berna", "Bernhart", "Bernt", "Berronar", "Berryn", "Bersi", "Berta", "Bertil", "Bertilde", "Bertram", "Bertran", "Bertrem",
    "Beryl", "Besma", "Bestagar", "Beth", "Bevil", "Beyash", "Beylard", "Bhimrao", "Bhoskar", "Bhupindar", "Bidwell", "Bilbo", "Bile",
    "Bilmar", "Bindon", "Bion", "Bipin", "Birath", "Birbeck", "Birchard", "Birger", "Birgit", "Birket", "Bisuneh", "Bjarni", "Bjorn",
    "Bjornstern", "Blackwood", "Blade", "Blaen", "Blair", "Blame", "Blasco", "Blaze", "Bledsoe", "Blenda", "Bleran", "Blount", "Blunyc",
    "Bninna", "Bo", "Bodil", "Bodvar", "Bolthorn", "Boner", "Booker", "Boott", "Boris", "Bork", "Borlace", "Bormor", "Boromir",
    "Bors", "Botho", "Botolf", "Bourke", "Bowie", "Boyd", "Bracca", "Brace", "Bracken", "Brand", "Brandec", "Brangwen", "Brann",
    "Brannon", "Branwell", "Branwen", "Breanon", "Bremen", "Brenna", "Brenner", "Brent", "Bress", "Bretaine", "Breyugar", "Brianna", "Bridget",
    "Brielle", "Brigantu", "Brighton", "Brinn", "Brion", "Bristan", "Brita", "Brithael", "Brock", "Brockden", "Brodhead", "Brodribb", "Brogan",
    "Bron", "Brona", "Bronwyn", "Bror", "Broun", "Bruna", "Bruno", "Brunt", "Brynhild", "Brynit", "Bryoni", "Bunnvor", "Bupu",
    "Burcan", "Buri", "Burkard", "Buzurg", "Byam", "Byblos", "Byre", "Byrna", "Byrne", "Bysshe", "Cabell", "Cabillo", "Caddor",
    "Caden", "Cadfael", "Cadmar", "Cadrach", "Cadwallader", "Caecyn", "Cael", "Caelon", "Caer", "Cai", "Cail", "Cairn", "Caitlin",
    "Caladon", "Calandria", "Calbraith", "Calder", "Cale", "Caleb", "Calera", "Caliban", "Callan", "Callcott", "Calmic", "Calrohir", "Calumn",
    "Calvert", "Camber", "Cambree", "Camiya", "Canina", "Caprice", "Cardon", "Caramon", "Carelia", "Carey", "Caribou", "Caris", "Carl",
    "Carless", "Carli", "Carlyle", "Caryne", "Caron", "Carsten", "Carvell", "Caryl", "Cashin", "Caspian", "Cassandra", "Cassaway", "Cathal",
    "Catherine", "Cathla'in", "Cathlain", "Cathlin", "Cayl", "Caylin", "Cecilia", "Cecily", "Cedric", "Cedrick", "Cedrim", "Celadae", "Celebdil",
    "Celeborn", "Celeren", "Celes", "Celeste", "Celestine", "Celia", "Celowen", "Cemark", "Ceomyr", "Ceowulf", "Cercyon", "Ceremon", "Cerimon",
    "Cerindar", "Cermor", "Cernd", "Ceryx", "Cespar", "Cevir", "Ceylinn", "Chaka", "Chalfant", "Challen", "Chamon", "Chanti", "Chard",
    "Charissa", "Charlene", "Charlotte", "Chauncey", "Chauntea", "Chavir", "Chaya", "Checotah", "Chevonne", "Chevran", "Chichester", "Chimaera", "Chiodwig",
    "Chiron", "Chittenden", "Chloe", "Christopher", "Chronepsis", "Chronos", "Chrowder", "Chuz", "Cid", "Cilmar", "Cinerva", "Cirkin", "Civar",
    "Claed", "Clafin", "Claire", "Clarinda", "Claudia", "Cleghorn", "Clerihew", "Clinch", "Clipster", "Clopton", "Cloud", "Clover", "Clovis",
    "Cnud", "Cnut", "Coalter", "Cobryn", "Coddry", "Coel", "Coela", "Cohn", "Colden", "Colgan", "Colmen", "Colon", "Colwyn",
    "Coma", "Conall", "Conan", "Congal", "Conlan", "Conn", "Connell", "Connidas", "Connon", "Connop", "Conor", "Conrad", "Constantius",
    "Conwy", "Conyasal", "Coprates", "Cora", "Coral", "Corbin", "Corellon", "Coren", "Corin", "Corinne", "Corinth", "Cormac", "Cornelius",
    "Corrowr", "Corry", "Corryn", "Corwin", "Cotton", "Cowan", "Cowden", "Cowper", "Coyan", "Craigh", "Cray", "Crewzel", "Creydah",
    "Cronyn", "Croyble", "Crundall", "Crynal", "Crysania", "Cryshandylin", "Cryunnos", "Cuall", "Cuane", "Cuddry", "Cuhaid", "Culiross", "Culkin",
    "Cullen", "Cullyn", "Cuthalion", "Cuthbert", "Cylarus", "Cylie", "Cylmar", "Cymbeline", "Cyndor", "Cynoril", "Cyria", "Cyriel", "Cyrilla",
    "Cyrillus", "Cyrus", "Cyryl", "Cythnar", "Cyton", "Daburn", "Daen", "Dagar", "Dagda", "Dagmar", "Dagni", "Dagny", "Dagwyn",
    "Dahil", "Daikkah", "Daila", "Daila'in", "Daimhin", "Daimon", "Daisy", "Dakamon", "Dakoda", "Dalamar", "Dall", "Dalla", "Dallandra",
    "Dalziel", "Damar", "Damien", "Damon", "Dana", "Danforth", "Daniel", "Dannun", "Dannyn", "Danu", "Danuvius", "Daood", "Daphin",
    "Dara", "Daragor", "Darandriel", "Darell", "Darien", "Dario", "Darius", "Darkash", "Darkboon", "Darkspur", "Darlis", "Daron", "Darrell",
    "Darrin", "Darvin", "Daryan", "Dashiell", "Dashwood", "Dasyani", "Dathan", "Dathanja", "Daugas", "David", "Davnet", "Davros", "Dawn",
    "Dayyan", "Dekteon", "Delevan", "Delita", "Dell", "Dellin", "Delmund", "Demarest", "Demi", "Deminar", "Demtris", "Denethor", "Denhain",
    "Denor", "Denton", "Denzil", "Deogol", "Derfel", "Derian", "Dermaria", "Derran", "Derroll", "Derval", "Dervilia", "Desmona", "Devabriel",
    "Devaron", "Deveron", "Devra", "Dexter", "Dhakos", "Dhan", "Dharijor", "Dholemtrix", "Dhur", "Diadra", "Diagur", "Dian", "Diarmud",
    "Diderik", "Diehi", "Dighton", "Dillon", "Dimura", "Dinham", "Dinivan", "Dino", "Dionetta", "Diony", "Dirk", "Dirrach", "Divos",
    "Djamal", "Dmitri", "Doak", "Dolman", "Dolyan", "Domnu", "Donagh", "Donal", "Donblas", "Dongal", "Doniol", "Donivesh", "Donovan",
    "Doral", "Dorea", "Dorian", "Dorin", "Dorn", "Dornhnall", "Dorr", "Dorsan", "Dorvai", "Dotta", "Doud", "Dougal", "Doust",
    "Draco", "Dragan", "Dragus", "Dragutin", "Draka", "Drake", "Drako", "Dran", "Draoi", "Draven", "Drax", "Drayko", "Dred",
    "Dreed", "Drexel", "Drezael", "Drezaem", "Drin", "Drinda", "Drion", "Drusilla", "Drynn", "Dréagg", "Duain", "Duald", "Duana",
    "Duer", "Dugal", "Dugald", "Dugdale", "Dulasiri", "Dumathoin", "Dunbar", "Dundas", "Dunglas", "Dunnabar", "Dunstan", "Dunwody", "Duny",
    "Dunya", "Dur-Shuk", "Duran", "Durek", "Durin", "Durnik", "Durward", "Dwarkanath", "Dweomer", "Dwyer", "Dyce", "Dyer", "Dygardo",
    "Dyke", "Dylan", "Dymphna", "Dynar", "Dyneley", "Dynera", "Dynie", "Dytan", "Dyvim", "E'thane", "Eadweard", "Eager", "Eamon",
    "Eanger", "Eardley", "Earle", "Earnest", "Eastman", "Ebany", "Ebba", "Eberhard", "Ebony", "Echael", "Eckert", "Eckhard", "Ector",
    "Edcyl", "Edda", "Edeva", "Edgar", "Edina", "Edla", "Edmond", "Edmondstone", "Edric", "Edrie", "Edson", "Eduard", "Edwin",
    "Edwina", "Edwyn", "Eevin", "Efiath", "Efrem", "Egan", "Egbert", "Egerton", "Egil", "Egon", "Egron", "Ehlreth", "Ehrman",
    "Eilhard", "Eilif", "Eilinud", "Einar", "Eindrini", "Eirech", "Eirik", "Eiron", "Eithne", "Eivind", "Ekaterina", "Elaine", "Elath",
    "Elbert", "Eldath", "Eldavon", "Eldgrim", "Eldid", "Eldin", "Eldon", "Eldred", "Eldric", "Eldrin", "Eldron", "Eldìvèn", "Eleanor",
    "Eleazar", "Electa", "Elelil", "Elena", "Elendil", "Eleno'in", "Elentari", "Elerion", "Elessar", "Elfnida", "Elfnide", "Elfnieda", "Elford",
    "Elhanan", "Eliakini", "Eliard", "Elinor", "Elion", "Eliseth", "Elispeth", "Elisseer", "Elistan", "Eliwood", "Elizabeth", "Ella", "Ellanath",
    "Ellen", "Ellin", "Ellingwood", "Ellydryr", "Ellynor", "Elmeric", "Elmira", "Eloisa", "Elora", "Elowen", "Elrad", "Elric", "Elrik",
    "Elrodin", "Elron", "Elrond", "Elsa", "Elsbeth", "Elsdon", "Elspeth", "Elswyth", "Elton", "Elu", "Elva", "Elvalind", "Elvarion",
    "Elvin", "Elvina", "Elvira", "Elvrit", "Elvérion", "Elwell", "Elwin", "Elwyn", "Elysia", "Emberyl", "Emerynn", "Emirah", "Emma",
    "Emna", "Emory", "Endemian", "Endicott", "Endoray", "Endrede", "Endsor", "Engeihard", "Enigma", "Enn", "Ennorath", "Envi", "Enzoray",
    "Eolair", "Eomer", "Eosin", "Eowyn", "Ephyre", "Erana", "Erard", "Ercan", "Erdmann", "Erebor", "Ergon", "Erian", "Eric",
    "Erich", "Erie", "Erik", "Erika", "Erilyth", "Erland", "Erlend", "Erling", "Ernald", "Ernan", "Ernata", "Errine", "Ervin",
    "Eryka", "Eryn", "Esghar", "Eslin", "Esmeralda", "Esmond", "Esnar", "Essa", "Esselin", "Estheria", "Estrella", "Etelka", "Ethelbearn",
    "Ethelbert", "Ethelburga", "Ethelred", "Ethelreda", "Eudo", "Eugene", "Eulala", "Evadne", "Evaine", "Evald", "Evan", "Evarts", "Evelina",
    "Evelyn", "Everard", "Evert", "Evind", "Evo", "Evolyn", "Evska", "Ewald", "Ewen", "Ewugan", "Eystein", "Eyulf", "Eyvind",
    "Ezail", "Ezellohar", "Ezirith", "Ezme", "Ezrabar", "Ezri", "Faber", "Fabian", "Fael", "Faelyn", "Fahs", "Fairfax", "Fairtnan",
    "Falathar", "Falcon", "Falgar", "Fali", "Falias", "Falkiner", "Falmalinnar", "Falyrias", "Fanchon", "Fangorn", "Fanshaw", "Faraday", "Farah",
    "Farale", "Faramir", "Faran", "Farathar", "Farid", "Farith", "Farli", "Farnham", "Farouk", "Farquhar", "Farrin", "Farwehl", "Fatima",
    "Fausto", "Fawn", "Faysal", "Fea", "Feargus", "Fedor", "Feike", "Felam", "Felladin", "Fellador", "Fellathor", "Fellow", "Fenella",
    "Fenton", "Fenwick", "Fera", "Ferantay", "Ferazhin", "Ferdinand", "Fergus", "Fernand", "Feron", "Feustmann", "Fhinders", "Fhorgeir", "Fiana",
    "Fiathna", "Fielding", "Fikir", "Filippe", "Finarfin", "Finbar", "Findegil", "Findley", "Finegan", "Fingal", "Fingalla", "Fingil", "Finias",
    "Finn", "Finnbogi", "Finos", "Fiona", "Fiorag", "Fiori", "Firca", "Firin", "Firon", "Firozhan", "Fistandantilus", "Fistar", "Fistor",
    "Fitzedward", "Fitzroy", "Fizban", "Fjolnir", "Flandrena", "Flare", "Flavius", "Flint", "Floki", "Florimund", "Flosi", "Flygare", "Flynn",
    "Fnida", "Fomorii", "Forbus", "Forester", "Fornost", "Foronte", "Fothergill", "Francisco", "Frayja", "Freda", "Frederic", "Frederica", "Frederick",
    "Fredrick", "Fredrik", "Freeborn", "Freeman", "Frey", "Freya", "Freydis", "Fridgeir", "Frodo", "Fryniwyd", "Fuad", "Fumorak", "Furnifold",
    "Fury", "Fyodor", "Fyodr", "Fyza", "Gaarn", "Gabniela", "Gabriel", "Gadsby", "Gaea", "Gael", "Gaelinar", "Gaena", "Gaerdal",
    "Gaillard", "Gairdner", "Galach", "Galadren", "Galan", "Galanna", "Galapas", "Galaphon", "Galar", "Galbard", "Galderon", "Galdor", "Gale",
    "Galeia", "Galen", "Galfrey", "Galion", "Galrandar", "Galrion", "Gama", "Gandalf", "Ganduil", "Ganith", "Gannon", "Ganvan", "Gardi",
    "Garet", "Gareth", "Garion", "Garith", "Garl", "Garland", "Garlenon", "Garn", "Garon", "Garrick", "Garrott", "Garth", "Gartnas",
    "Garvin", "Garwood", "Gaston", "Gavendra", "Gavin", "Gavina", "Gawain", "Gealsgiath", "Gebhard", "Geir", "Geirmund", "Geirstein", "Gelonna",
    "Genevieve", "Geoffrey", "Georgii", "Gerald", "Gerard", "Gerd", "Gerhard", "Gerhart", "Gerloc", "Gerrard", "Gerreint", "Gerrish", "Gertrude",
    "Gervaise", "Gesin", "Gest", "Ghirra", "Ghislain", "Gholson", "Gia", "Gibbon", "Gilberta", "Gilda", "Gilden", "Gildersleeve", "Giles",
    "Gilfanon", "Gilian", "Gilir", "Gilli", "Gillion", "Gillyn", "Gilm", "Gilraen", "Gilthanas", "Gimli", "Gird", "Girin", "Gisgin",
    "Gizur", "Gladstone", "Glassford", "Glebur", "Gleda", "Gleocyn", "Gleridower", "Glida", "Glogan", "Gloisur", "Glorfindel", "Glugwyn", "Glum",
    "Glyn", "Glynn", "Gnazia", "Godfred", "Godfrey", "Godwin", "Goibhniu", "Golding", "Goldwin", "Gollum", "Gongalo", "Goodhue", "Gorbash",
    "Gordalius", "Gorias", "Gorion", "Gorm", "Gotthard", "Govier", "Govind", "Gowen", "Grace", "Graham", "Graine", "Gralon", "Grani",
    "Grania", "Gravin", "Greegan", "Greenleaf", "Gregor", "Gregory", "Grendahl", "Greyfell", "Grian", "Gridley", "Griffid", "Griffin", "Griffith",
    "Griggs", "Grim", "Grima", "Grimhilda", "Grimnir", "Grindan", "Griniing", "Grisha", "Griswold", "Groa", "Grover", "Grunak", "Grunnhild",
    "Gruumsh", "Gualat", "Gudmund", "Gudmundur", "Gudrid", "Gudris", "Gudrun", "Guibert", "Guida", "Guido", "Gulian", "Gunila", "Gunnar",
    "Gunning", "Gunther", "Gurnarok", "Gurney", "Gustav", "Guthorm", "Guthrie", "Guthum", "Gutzon", "Guy", "Gwacyn", "Gwaihir", "Gweddyn",
    "Gwen", "Gwenca", "Gwenda", "Gwendolyn", "Gwenevere", "Gweniver", "Gwildor", "Gwoc", "Gwomyr", "Gwydion", "Gwyn", "Gwyneth", "Gwynfryd",
    "Gwyran", "Gwythinn", "Gyda", "Gylian", "Gymir", "Haakon", "Habib", "Hablot", "Hack", "Haddon", "Hadrian", "Haestan", "Hafez",
    "Hafgrim", "Hagar", "Haigh", "Hakatri", "Haki", "Hakon", "Halbert", "Halcyon", "Haldane", "Haldor", "Hale", "Halfdan", "Haliina",
    "Hall", "Halldis", "Halldor", "Halley", "Hallfred", "Hallfrid", "Hallgerd", "Hallkel", "Hallock", "Halloweii", "Hallveig", "Halvord", "Hamlin",
    "Hamnet", "Hanford", "Hani", "Haninah", "Hannibal", "Hanoran", "Hansine", "Hapweth", "Harald", "Harbaugh", "Harcourt", "Hardernan", "Hardon",
    "Hardwicke", "Harek", "Harkness", "Harlan", "Harlo", "Harold", "Haroon", "Harpo", "Harren", "Harthan", "Harthran", "Hartpole", "Hartwig",
    "Harwood", "Hasket", "Hassan", "Hastein", "Hatcher", "Hattrick", "Hauk", "Havard", "Havelock", "Hayvan", "Hazard", "Hazel", "Haziran",
    "Hazrond", "Healdon", "Heardred", "Heaslip", "Heather", "Hector", "Hedda", "Hedin", "Hedwig", "Heimer", "Helena", "Helga", "Helgi",
    "Helir", "Helix", "Helm", "Helma", "Helmi", "Heman", "Hemming", "Hendrik", "Hengist", "Henna", "Henrick", "Henry", "Geramon",
    "Herdis", "Herekin", "Hereward", "Herijar", "Hermione", "Heron", "Hertha", "Heryom", "Herzog", "Heward", "Hhaba'id", "Hhabezur", "Hickling",
    "Hidohebhi", "Hifryn", "Hild", "Hilda", "Hildebrand", "Hildegarde", "Hildric", "Himli", "Hisar", "Hislop", "Hjalmar", "Hjalti", "Hjeldin",
    "Hjort", "Hjorth", "Hlif", "Hoadley", "Hoar", "Hobart", "Hodgdon", "Hogg", "Hogni", "Holbrook", "Holger", "Holgi", "Hollister",
    "Holly", "Homli", "Hookham", "Horan", "Horatio", "Hord", "Horik", "Hormstein", "Horsa", "Hortensia", "Horton", "Hoskuld", "Hosni",
    "Hossein", "Howarth", "Howland", "Hrafn", "Hrapp", "Hrefna", "Hrethel", "Hring", "Hroald", "Hrodyn", "Hrolf", "Hrothgar", "Hrugan",
    "Hruggek", "Hruse", "Hrut", "Huffatn", "Hulbeart", "Hulda", "Hultz", "Humbert", "Hunter", "Hurd", "Hurgal", "Hurvin", "Hussain",
    "Hustana", "Hyarantar", "Hyarante", "Hyder", "Hyfryn", "Hygelac", "Hylissa", "Hynman", "Hyrak", "Ian", "Iana", "Ibitz", "Ibrahim",
    "Ibrandul", "Ica", "Icarus", "Icava", "Ick", "Ida", "Idarolan", "Iden", "Idris", "Iduna", "Iduné", "Ies'lorn", "Igjaru",
    "Igor", "Ikarin", "Ilena", "Ilermath", "Ilia", "Iliriya", "Illentik", "Illuin", "Illyana", "Ilmare", "Ilniora", "Ilthoss", "Iluvatar",
    "Ilya", "Ilyesha", "Imajin", "Imnar", "Imoen", "Imphela", "Imrador", "Imrahan", "Imrahim", "Imril", "Imryr", "Inahwen", "Indech",
    "Indigo", "Indira", "Indreju", "Indria", "Ingald", "Ingeborg", "Ingen", "Ingi", "Ingirid", "Ingolf", "Ingram", "Ingrid", "Ingunn",
    "Inifael", "Inigo", "Inisfa'il", "Iosaz", "Iosef", "Irgash", "Irial", "Irian", "Iris", "Irma", "Irphilin", "Irsai", "Irvin",
    "Irwick", "Isael", "Isak", "Isambard", "Isbeorn", "Iscal", "Iselore", "Isengard", "Isengrim", "Iserion", "Isgrimnur", "Ishmael", "Isidora",
    "Isiki", "Isildur", "Isilith", "Isleif", "Ismail", "Isolde", "Isorn", "Issak", "Ithaca", "Iuz", "Ivan", "Ivar", "Ivor",
    "Ivy", "Iwanda", "Iyu'nigato", "Izard", "Izebel", "Izvire", "Jace", "Jacinth", "Jacoby", "Jacor", "Jade", "Jaden", "Jadzia",
    "Jael", "Jaffar", "Jagadis", "Jaheira", "Jahrec", "Jahverbhai", "Jalasil", "Jalavier", "Jaligal", "Jamila", "Janda'nan", "Jandanan", "Janix",
    "Janna", "Janus", "Janvel", "Jarak", "Jarazal", "Jared", "Jarek", "Jarnagua", "Jarriel", "Jarvin", "Jasara", "Jasek", "Jaseve",
    "Jasha", "Jasmine", "Jason", "Javair", "Javon", "Jawaharial", "Jayce", "Jayden", "Jaylidan", "Jayna", "Jaysen", "Jazhara", "Jazrel",
    "Jedd", "Jeffen", "Jehryn", "Jelyn", "Jenantar", "Jenkin", "Jennifer", "Jens", "Jensine", "Jephson", "Jerec", "Jeryth", "Jesiper",
    "Jespar", "Jesslyn", "Jestyn", "Jethis", "Jevan", "Jevist", "Jezryanadar", "Jhael", "Jhaelen", "Jhany", "Jhardamòr", "Jharkor", "Jhary",
    "Jihad", "Jillian", "Jingizu", "Jintah", "Jiriki", "Jirnost", "Jocelyn", "Jochan", "Johannes", "John", "Jolan", "Jomano", "Jonaya",
    "Joran", "Jordan", "Joriel", "Jornadesh", "Jorunn", "Joscelyn", "Joseph", "Josephine", "Josette", "Joshua", "Jotham", "Jovena", "Jubini",
    "Jullana", "Junius", "Juno", "Juntalin", "Jura", "Jurim", "Jusif", "Juss", "Jyresh", "K'aarna", "Kaarna", "Kael", "Kaelin",
    "Kaffa", "Kai", "Kaia", "Kailyn", "Kaimana", "Kaitlinn", "Kaja", "Kalan", "Kalantir", "Kalar", "Kaldar", "Kaleen", "Kalen",
    "Kalf", "Kalia", "Kalina", "Kalvan", "Kalvaro", "Kalyra", "Kalysha", "Kamril", "Kamshir", "Kanoa", "Kaori", "Kaprin", "Kara",
    "Karali", "Karel", "Karelia", "Kari", "Karim", "Karinca", "Karine", "Karis", "Karitsa", "Karker", "Karl", "Karlsefni", "Karran",
    "Karya", "Kaschak", "Kasia", "Kaspar", "Kasreyn", "Kathena", "Kathran", "Katishimo", "Katla", "Katnina", "Katrin", "Katrina", "Kavalam",
    "Kavalnir", "Kaylianna", "Kaylin", "Kazairl", "Kazalim", "Kazir", "Keavy", "Keelan", "Kegan", "Keiko", "Keldorn", "Kelin", "Kellin",
    "Kelma'in", "Kelson", "Kelth", "Kelvin", "Kemble", "Kendall", "Kendra", "Kendrick", "Kenesaw", "Kenin", "Kenny", "Kenobi", "Kenrick",
    "Kerik", "Kerish", "Kermit", "Kerrigan", "Keshar", "Kesrick", "Kethios", "Ketial", "Ketil", "Kettali", "Kevan", "Keven", "Kevlin",
    "Keyrnon", "Khader", "Khalia", "Khalid", "Khanzadian", "Kharas", "Khealynn", "Khelben", "Kheldor", "Khelen", "Khelin", "Khelyn", "Khendraja'aro",
    "Khenel", "Khezeed", "Khindawe", "Khirsha", "Khlor", "Khris", "Khyved", "Ki'ushapo", "Kian", "Kiborno", "Kiera", "Kieran", "Kikkasut",
    "Kilas", "Kilian", "Killion", "Kimmuriel", "Kimura", "Kinloch", "Kinson", "Kippler", "Kira", "Kiri", "Kirjava", "Kirk", "Kirren",
    "Kirsopp", "Kirsten", "Kishin", "Kisin", "Kitiara", "Kjeldor", "Kjindar", "Klaus", "Klean", "Klerak", "Knud", "Knut", "Knute",
    "Koabon", "Kolbein", "Kolchash", "Kolskegg", "Kolya", "Kona", "Konrad", "Konstantine", "Korban", "Kord", "Koreth", "Korgan", "Korm",
    "Kormar", "Kornag", "Korska", "Kosh", "Kota", "Kovelir", "Krinn", "Krishnalai", "Kroh", "Krom", "Kronos", "Kuno", "Kurd",
    "Kurn", "Kurt", "Kurin", "Kuros", "Kurtulmak", "Ky'ishi", "Ky'varan", "Kyle", "Kylindra", "Kypros", "Kyrie", "Kyriel", "La'ahl",
    "Lachesis", "Lachian", "Ladia", "Ladoros", "Laeli", "Laelia", "Laerrui", "Lahar", "Lahsai", "Lalely", "Lamar", "Lambi", "Lan",
    "Lana", "Lance", "Lancelot", "Landailyn", "Landoris", "Landrea", "Laneth", "Langhorne", "Langrian", "Langston", "Lanthal", "Lanthorn", "Larad",
    "Lardner", "Larisa", "Larkin", "Larn", "Larnea", "Lars", "Larz", "Lashar", "Lateia", "Lathander", "Laurana", "Laurelin", "Laxton",
    "Lazar", "Lazlo", "Lea", "Leareth", "Leathian", "Lec", "Ledyard", "Leela", "Legolas", "Legrand", "Leif", "Leighton", "Leika",
    "Leila", "Leilah", "Leli", "Lembar", "Lenka", "Lenox", "Leo", "Leofric", "Leon", "Leonard", "Leonardo", "Leopond", "Lesesne",
    "Lestyn", "Leta", "Letor", "Lev", "Lewellyri", "Lexan", "Lexx", "Lhuc", "Lia", "Liana", "Liena", "Lightfoot", "Liliane",
    "Lilin", "Lina", "Lindar", "Linmer", "Linnea", "Lios", "Liphar", "Lippard", "Liptrot", "Lirith", "Lithar", "Littleton", "Livermore",
    "Livia", "Ljot", "Ljotolf", "Lluth", "Llyn", "Llythin", "Lobelia", "Lobryn", "Lobur", "Locke", "Lockwood", "Loddlaen", "Lodica",
    "Lodin", "Loella", "Logan", "Loibur", "Loili", "Lola", "Lonvan", "Lore", "Loric", "Lorin", "Lormyr", "Lothar", "Lothrop",
    "Lott", "Lotta", "Loudon", "Louisa", "Lovegood", "Lovva", "Lovyan", "Luas", "Lucan", "Lucca", "Lucia", "Lucian", "Lucinda",
    "Lucius", "Lucrecia", "Ludmila", "Luella", "Lufkin", "Lugh", "Luhsane", "Lum", "Lumbar", "Luna", "Lunar", "Lunetta", "Lupin",
    "Lurican", "Lurue", "Luscan", "Luther", "Luthian", "Luvina", "Lycias", "Lydia", "Lylas", "Lyle", "Lymo", "Lyndall", "Lyndon",
    "Lynette", "Lynis", "Lynn", "Lypilla", "Lyra", "Lyrian", "Lyrin", "Lyron", "Lysander", "Lyssa", "Lythia", "Lythian", "Lytler",
    "Lyzandra", "Lyzette", "Lórien", "Mabon", "Macallan", "Macaulay", "Macer", "Mackim", "Macvey", "Maddern", "Maddock", "Madelon", "Madhao",
    "Madora", "Maec", "Maegwin", "Mael", "Maerraent", "Mafka", "Magda", "Magh", "Magill", "Magna", "Magnus", "Magus", "Mahion",
    "Mahmud", "Mahri", "Maia", "Maidah", "Maidak", "Maihar", "Makoma", "Malach", "Malachias", "Maladack", "Malador", "Malak", "Malar",
    "Malcoff", "Malcolm", "Malfar", "Malia", "Maliforin", "Malkil", "Malto", "Malvin", "Malvtha", "Mama", "Mamba", "Mana", "Manala",
    "Manaverr", "Manfred", "Mankey", "Mannin", "Manon", "Mansour", "Manton", "Manwe", "Maoll", "March", "Marcus", "Marena", "Margarita",
    "Margery", "Mariandor", "Marid", "Marina", "Marion", "Marissa", "Marisse", "Mark", "Markham", "Maroof", "Marques", "Marsden", "Marshtnan",
    "Marsineh", "Marta", "Martin", "Martus", "Mary", "Maryn", "Mathilda", "Mathilde", "Matilda", "Matthew", "Matthias", "Maudlin", "Maura",
    "Mavis", "Maxander", "Maxfield", "Maximilian", "Maximus", "Maya", "Mayhew", "Mazrak", "Medar", "Medart", "Medea", "Meder", "Medrom",
    "Megan", "Meghnad", "Mehmet", "Mekeesha", "Melba", "Melchior", "Meleri", "Meliadoul", "Melian", "Melisande", "Melkor", "Mellyora", "Melnyth",
    "Melora", "Melva", "Melvaig", "Memor", "Men", "Menard", "Mendolin", "Menelvagor", "Mennefer", "Meoran", "Mephistopheles", "Merah", "Merasye",
    "Meredith", "Meriadoc", "Merifa", "Merivan", "Merlin", "Merrilee", "Merryn", "Mervyn", "Merwold", "Merwolf", "Mes'ard", "Meta", "Methos",
    "Methuen", "Michael", "Michel", "Mideya", "Midhat", "Midra", "Mignon", "Miguel", "Mikhail", "Mila", "Milada", "Milander", "Milandro",
    "Mileaha", "Millard", "Milo", "Mimir", "Mina", "Minella", "Miner", "Minna", "Minx", "Mira", "Miragon", "Miranda", "Mirandros",
    "Miriel", "Mirrash", "Mirromi", "Miryam", "Misha", "Mishanti", "Misin", "Mist", "Mithrandir", "Mithryl", "Mitre", "Miwa", "Mizra",
    "Moda", "Modeus", "Moffett", "Mohammed", "Mohieddin", "Moina", "Moira", "Moiriane", "Moisur", "Molina", "Mona", "Monach", "Montfort",
    "Mora", "Moradin", "Mord", "Moredlin", "Morgan", "Morgon", "Morgwin", "Moriana", "Morik", "Morin", "Morley", "Morna", "Morpheus",
    "Morrigan", "Mortos", "Mortrock", "Morven", "Moya", "Muammar", "Mubur", "Muhammed", "Muhlwena", "Mujibur", "Muktar", "Munin", "Murdo",
    "Murias", "Murina", "Murrough", "Mussa", "Mustadio", "Mustafa", "Mylin", "Mylé", "Myna", "Myra", "Myriam", "Myrick", "Myrmeen",
    "Myrna", "Myron", "Myrrdyn", "Myrrha", "Myshella", "Mythil", "Myvor", "N'hadha", "Nada", "Nadezhda", "Nadia", "Nadir", "Nagai",
    "Nagel", "Nagvar", "Nahar", "Naia", "Naidel", "Najib", "Nakea", "Nalia", "Nall", "Nanorion", "Naois", "Naomi", "Napollo",
    "Narasen", "Narcista", "Narisa", "Narvi", "Nasir", "Nasser", "Natalia", "Natasha", "Nathalia", "Nathalie", "Natty", "Nazar", "Nebron",
    "Nedda", "Nedstar", "Neelix", "Negley", "Nemm", "Nemuel", "Neral", "Neri", "Nerian", "Nerilka", "Nerissa", "Nerull", "Nesbit",
    "Nesta", "Nethuan", "Neva", "Nevaeh", "Nevard", "Nevena", "Nevile", "Nevyn", "Newall", "Newbold", "Newman", "Neysa", "Neza",
    "Nibbidard", "Nichol", "Nicor", "Nienna", "Night", "Nigil", "Nikolai", "Nikua", "Nila", "Nimir", "Nimrodel", "Nina", "Ninian",
    "Niomir", "Nira'in", "Nirnir", "Nita", "Nivek", "Nivilian", "Nizam", "Nizar", "Nobanion", "Nodaran", "Noela", "Nolan", "Nona",
    "Noora", "Nor", "Nordri", "Noreen", "Norine", "Norle", "Norna", "Norval", "Norvin", "Norwood", "Nova", "Novalis", "Novita",
    "Novomira", "Nu'endo", "Nuada", "Nuadi", "Nuala", "Nuale", "Nuanni", "Nungo", "Nunila", "Nura", "Nurdoch", "Nurgan", "Nuri",
    "Nushia", "Nyassa", "Nylan", "Nymara", "Nynaeve", "Nyra", "Nytasa", "Oakes", "Oalyn", "Obed", "Oberon", "Ocar", "Oda",
    "Odar", "Odd", "Oden", "Odilia", "Odimus", "Odo", "Odona", "Ofeig", "Ogden", "Oghma", "Ogma", "Ogmund", "Ogrus",
    "Okander", "Olac", "Olaf", "Oldac", "Oldham", "Olga", "Olissa", "Olof", "Olorin", "Oloru", "Olvir", "Olya", "Omandras",
    "Omar", "Omassus", "Ombrum", "Omer", "Onslow", "Onufrio", "Onund", "Onyx", "Ooma", "Oona", "Oonai", "Opal", "Ophelia",
    "Orah", "Orcrist", "Ordway", "Oriana", "Orin", "Orion", "Orius", "Orivaen", "Orlandu", "Orlata", "Orm", "Ormsby", "Orome",
    "Oron", "Orren", "Orridge", "Orsola", "Orson", "Osa", "Osiris", "Oskavar", "Ospar", "Osric", "Oswin", "Othello", "Othilia",
    "Otho", "Othran", "Otiluke", "Otkel", "Otrygg", "Ottar", "Ottilia", "Otto", "Overton", "Owain", "Owen", "Owyn", "Ozatras",
    "Ozto", "Ozur", "Padraic", "Padrias", "Paget", "Pala", "Palma", "Pamar", "Pan", "Parbha", "Pargascor", "Parr", "Pasca",
    "Paschal", "Passmore", "Patnas", "Pattabhai", "Pavel", "Pean", "Pearl", "Pearsall", "Peffer", "Peiham", "Peitar", "Peleg", "Pelipi",
    "Pellin", "Pendleton", "Penfield", "Pengolod", "Penhallow", "Penniman", "Penrhyn", "Pepperell", "Pereban", "Peredon", "Peregrin", "Peregrine", "Perith",
    "Peronn", "Perrin", "Persifor", "Pestivar", "Peter", "Pethros", "Petra", "Petrea", "Petronella", "Pflarr", "Phanuel", "Pharatnond", "Pharcellus",
    "Phelim", "Philo", "Philpot", "Phimister", "Phoenix", "Phyrrus", "Pia", "Picar", "Pickman", "Pigot", "Pike", "Pine", "Pinkham",
    "Pinkney", "Pinkstone", "Piotr", "Pittheus", "Plaisted", "Plunimer", "Plunkett", "Polassar", "Pollard", "Pollock", "Polonius", "Polycarp", "Pomeroy",
    "Porthios", "Powell", "Prafulla", "Prendergast", "Preston", "Prichard", "Proctor", "Prospero", "Provida", "Psilofyr", "Puck", "Pue", "Pulisk",
    "Pulteney", "Purdon", "Pyke", "Pyros", "Pysander", "Quaan", "Quagel", "Qualin", "Quan", "Quarles", "Quasar", "Quascar", "Quass",
    "Quebba", "Quelfinas", "Quesan", "Queygo", "Quiddle", "Quinn", "Quiss", "Quixano", "Quora", "Quvar", "Quvean", "Raagon", "Raban",
    "Rabind", "Rabur", "Rach", "Rachid", "Rackafel", "Rackhir", "Radagast", "Radija", "Rae", "Rael", "Raen", "Rafa", "Rafael",
    "Rafur", "Ragen", "Ragna", "Ragnal", "Ragnar", "Ragnhild", "Rahaz", "Rai", "Raikes", "Rails", "Raimon", "Raina", "Raine",
    "Raisa", "Raistlin", "Ralina", "Ralmanor", "Ralph", "Ramen", "Ramli", "Ramman", "Ramona", "Ramora", "Ramous", "Ramza", "Ranald",
    "Ranath", "Rancor", "Rand", "Randar", "Randoer", "Randolf", "Randor", "Ranfurly", "Ranjan", "Rankin", "Rannuif", "Rannveig", "Raphael",
    "Rary", "Rashiel", "Rasputin", "Rathack", "Rathanos", "Rathgar", "Rattray", "Rauros", "Ravenor", "Ravi", "Rayne", "Razamor", "Raziel",
    "Razzan", "Rebecca", "Recoun", "Redcliffe", "Regalorn", "Regnar", "Reina", "Reis", "Relm", "Rem", "Remi", "Remnor", "Remus",
    "Renar", "Renata", "Rendel", "Rengoll", "Reoc", "Resha", "Rethral", "Reva", "Rex", "Reyna", "Rezah", "Rhadry", "Rhaederle",
    "Rhaeryn", "Rhea", "Rhiannon", "Rhiow", "Rhodhy", "Rhona", "Rhonda", "Rhora", "Rhorleif", "Rhorvald", "Rhundas", "Rhymer", "Rhynn",
    "Rhys", "Riallus", "Riamon", "Rickard", "Ricyn", "Rigolio", "Rilir", "Rinaldus", "Ringgold", "Risaya", "Riss", "Rith", "Riven",
    "Roach", "Roark", "Rockhill", "Rodefer", "Roderic", "Rodhan", "Rognvald", "Roignar", "Roland", "Rolf", "Rollo", "Roman", "Romelia",
    "Romer", "Romney", "Ronan", "Root", "Rorik", "Rosalyn", "Rosamund", "Roscoe", "Rose", "Rosefyre", "Roseline", "Roshena", "Rosskeen",
    "Roundell", "Rowena", "Ruadan", "Ruan", "Rubar", "Ruben", "Rubrick", "Ruby", "Rucker", "Rudyard", "Rufina", "Rufus", "Ruggles",
    "Ruhollah", "Ruinar", "Rulian", "Rulinian", "Rumil", "Runa", "Runold", "Runolf", "Runus", "Rurik", "Rusgar", "Ruth", "Rutland",
    "Ruwen", "Ryana", "Rycaro", "Rychanna", "Rygar", "Ryll", "Rylla", "Rynnyn", "Ryodan", "Ryoga", "Ryoka", "Saalem", "Sabal",
    "Sabhel", "Sabriel", "Sabrok", "Sacheverall", "Sackville", "Saddam", "Sadler", "Sador", "Saedd", "Saermund", "Saeunn", "Safrin", "Saia",
    "Said", "Saifai", "Saiwyn", "Salina", "Salmon", "Salter", "Sam", "Sambrea", "Samia", "Samira", "Sammel", "Samuel", "Sanfrid",
    "Sano'rye", "Sanoreya", "Sanoria", "Sarcyn", "Sardior", "Sardul", "Sarel", "Sarevok", "Sargonus", "Saria", "Sarina", "Sarisin", "Sariya",
    "Sarrask", "Saruman", "Sasha", "Saska", "Saturn", "Sauron", "Savah", "Savion", "Sawdon", "Sayan", "Scenesefa", "Scudamore", "Scythe",
    "Sebastian", "Sebrinth", "Sechier", "Sedgely", "Seersha", "Segojan", "Sehanine", "Seitarin", "Selema", "Selena", "Selene", "Selig", "Selim",
    "Selina", "Selis", "Selith", "Selune", "Selwyn", "Semuta", "Senith", "Senna", "Sephia", "Sephya", "Sepiroth", "Seramir", "Seraphina",
    "Serena", "Serenyi", "Sergei", "Seriozha", "Seryan", "Seryl", "Seryth", "Seth", "Sethron", "Sevadia", "Severin", "Sevros", "Sevy",
    "Sha'dar", "Sha'rell", "Shackerley", "Shadizad", "Shadrach", "Shadworth", "Shaera", "Shaivar", "Shaivir", "Shala", "Shalamar", "Shalandain", "Shalat",
    "Shalhassan", "Shalindra", "Shalon", "Shalpan", "Shamane", "Shamir", "Shana", "Shandalar", "Shanell", "Shar", "Sharada", "Sharaq", "Shard",
    "Sharif", "Sharilla", "Sharl", "Sharla", "Sharmaine", "Sharman", "Sharna", "Sharnira", "Sharra", "Sharteel", "Shaundra", "Sharyn", "Shayera",
    "Shayla", "Shayll", "Shayonea", "Shea", "Sheegoth", "Sheeryl", "Sheherazad", "Shemsin", "Sheridan", "Sherif", "Sherry", "Shezael", "Shima'onari",
    "Shintaro", "Shiza", "Shuinn", "Shuna", "Shurakai", "Shurik", "Shushila", "Shylock", "Siandar", "Sibert", "Sibyl", "Sidhe", "Siglinde",
    "Sigmund", "Signe", "Sigred", "Sigrid", "Sigtrydd", "Sigurd", "Sigvaldi", "Silatasar", "Silius", "Silma", "Silmariel", "Silphane", "Silvain",
    "Silvan", "Silvanus", "Silvera", "Silveron", "Silvia", "Silvyn", "Simir", "Simmu", "Sinbad", "Sindarin", "Sinir", "Sinjin", "Siranush",
    "Sirisir", "Sirli'in", "Sirona", "Sirranon", "Sirwin", "Sisimar", "Siski", "Sivesh", "Siveth", "Siward", "Sjerdi", "Skamkel", "Skelmar",
    "Skorian", "Slade", "Slania", "Slater", "Slava", "Sligh", "Slingsby", "Smedley", "Snargg", "Snorri", "Snyder", "Sodorn", "Soilir",
    "Soisil", "Sokki", "Solaris", "Solera", "Solevig", "Solmund", "Solomon", "Solvi", "Sonnet", "Sooth", "Sora", "Sorass", "Sorcha",
    "Sorin", "Sornovas", "Soth", "Southall", "Sovaz", "Soveh", "Soyadi", "Sparrow", "Sprigg", "Squall", "Srass", "Stabyl", "Stanwood",
    "Starkad", "Starke", "Stedman", "Stefan", "Stehman", "Stein", "Steinkel", "Steinthor", "Stelectra", "Stenger", "Stenwulf", "Steponas", "Sterndale",
    "Stetson", "Stetter", "Stiliman", "Stilingfleet", "Stopford", "Storm", "Stowna", "Strachan", "Straygoth", "Stroud", "Strudwick", "Strybyorn", "Strykar",
    "Sturla", "Sturm", "Styx", "Sudeha", "Suleiman", "Sulimo", "Sulkas", "Sumarlidi", "Suras", "Surridge", "Susin", "Susur", "Sutan",
    "Svala", "Svan", "Svante", "Svatopluk", "Sveata", "Sven", "Swain", "Swartwout", "Sydnor", "Syllva", "Sylvane", "Sylvia", "Sylvin",
    "Sylvine", "Syndarra", "Synnyn", "Syranita", "Syrioll", "Tabar", "Tabitha", "Tabor", "Tabu", "Tacey", "Tachel", "Tadashi", "Tadeus",
    "Tadia", "Tadisha", "Tadra", "Taennyn", "Taeynnyn", "Taggart", "Tahir", "Tailabar", "Taina", "Takhisis", "Taleen", "Talen", "Taleth",
    "Talia", "Taliesin", "Talin", "Talmora", "Talobar", "Talona", "Taloxi", "Taltos", "Talus", "Tamar", "Tamara", "Tameryn", "Tamias",
    "Tamlin", "Tamoreya", "Tanina", "Tanis", "Tanith", "Tanyc", "Tar", "Tara", "Taran", "Tarcia", "Taria", "Tarik", "Taromas",
    "Taron", "Tarran", "Taryn", "Tas", "Tasharra", "Tasker", "Tatyana", "Taurus", "Taveli", "Taylian", "Taylin", "Tedra", "Tegan",
    "Tekia", "Telena", "Tell", "Tench", "Tenna", "Tenser", "Teoddry", "Ter", "Teralyn", "Teressa", "Terix", "Teruah", "Tesin",
    "Tesla", "Tessa", "Tevran", "Thaal", "Thacker", "Thaddeus", "Thaki", "Thal", "Thalen", "Thalessa", "Thalia", "Thalna", "Tham",
    "Thana", "Thane", "Thanatos", "Thantos", "Thar", "Tharbad", "Tharkesh", "Tharn", "Thax", "Thecla", "Theda", "Theleb", "Theoden",
    "Theodor", "Theodoric", "Theodosia", "Theodric", "Theoric", "Thera", "Therad", "Theresa", "Therios", "Theros", "Thesius", "Thieras", "Thieryn",
    "Thingyr", "Thio", "Tholan", "Thomas", "Thomulor", "Thora", "Thoran", "Thorarin", "Thorburn", "Thord", "Thordarson", "Thordis", "Thorfel",
    "Thorfinn", "Thorfinna", "Thorgeir", "Thorgerd", "Thorgest", "Thorgils", "Thorgrim", "Thorgunna", "Thorhall", "Thorhalla", "Thorhild", "Thorin", "Thorir",
    "Thorkatla", "Thorkell", "Thorkild", "Thormod", "Thormodr", "Thormond", "Thorn", "Thorndike", "Thornwell", "Thorold", "Thorolf", "Thorsager", "Thorstein",
    "Thorunn", "Thorvald", "Thorvaldur", "Thorvar", "Thorzyl", "Thoth", "Thrain", "Thrand", "Throck", "Thule", "Thurid", "Thylda", "Thyra",
    "Thyri", "Thyrza", "Thyssa", "Tiana", "Tiffany", "Tihan", "Tika", "Tilford", "Tilica", "Tilir", "Tillinghast", "Tilloch", "Timon",
    "Tioniel", "Tirion", "Tisha", "Tisheri", "Titania", "Titia", "Titiana", "Tivernee", "Tiyagar", "Tnin", "Tobias", "Tobis", "Todhunter",
    "Tolbert", "Tolenka", "Topaz", "Topham", "Torc", "Tortbold", "Tosti", "Tosya", "Toulac", "Tovi", "Trafford", "Trebor", "Trelane",
    "Trelawny", "Trella", "Trevel", "Trick", "Trigg", "Trill", "Triona", "Trir", "Tristam", "Tristan", "Trost", "Trotwood", "Trowbridge",
    "Truesdell", "Tuane", "Tufnell", "Tugan", "Tuilleth", "Tulio", "Tulkas", "Tundine", "Tunstall", "Tuor", "Turan", "Turgoz", "Turhan",
    "Turin", "Turpin", "Tuttle", "Tuula", "Twyla", "Tylden", "Tyldoran", "Tylen", "Tylien", "Tylynn", "Tymar", "Tymora", "Tymoriel",
    "Tynnyn", "Tyr", "Tyra", "Tyranina", "Tyreen", "Tyrwhitt", "Uamian", "Ubriani", "Ucarsh", "Uda", "Uhier", "Uhlain", "Uhlume",
    "Uholedil", "Uinen", "Ula", "Ulf", "Ulgor", "Ulis", "Uljas", "Ulji", "Ulmaerr", "Ulmo", "Ulosh", "Ulric", "Ulrich",
    "Ultron", "Umaiar", "Umbar", "Umda", "Umgalad", "Una", "Uneitna", "Ungon", "Unius", "Unn", "Unrak", "Unwin", "Upal",
    "Upton", "Urabi", "Urania", "Uranos", "Uranus", "Uriel", "Urish", "Urokoz", "Ursula", "Usher", "Uta", "Utumno", "Uusoae",
    "Uvanimor", "Uziel", "Vabryn", "Vadarin", "Vadi", "Vaeddyn", "Vagn", "Vai", "Val", "Valadan", "Valandario", "Valandor", "Valarindi",
    "Valborg", "Valda", "Valdain", "Valdemar", "Valen", "Valenka", "Valentia", "Valerand", "Valeria", "Valerian", "Valeska", "Valgar", "Valgard",
    "Valgerd", "Valiah", "Valion", "Valisa", "Valiss", "Valistor", "Valkor", "Valla", "Vallo", "Valmar", "Valminder", "Valor", "Valsera",
    "Valurian", "Valya", "Valynard", "Vandrad", "Vane", "Vanechka", "Vanidor", "Vanion", "Vannevar", "Vannyn", "Vanya", "Vanyar", "Vanyel",
    "Varda", "Vardis", "Varina", "Varion", "Varken", "Varnum", "Vasava", "Vash", "Vasha", "Vasilii", "Vasin", "Vaydin", "Vaydir",
    "Vayi", "Vecna", "Veda", "Veldahar", "Veldan", "Velex", "Velior", "Venable", "Vendor", "Veorcyn", "Vercyn", "Verdina", "Vereesa",
    "Verline", "Vermund", "Verna", "Ves", "Vespar", "Vestein", "Veva", "Vevina", "Vexter", "Viasta", "Vicarr", "Vicat", "Vicentia",
    "Viconia", "Victor", "Vida", "Vidkun", "Vidron", "Vieno", "Viera", "Vierna", "Vigdis", "Vigfus", "Vilhelm", "Vilka", "Vilrna",
    "Vinatta", "Vincas", "Vincent", "Vintar", "Violet", "Vircyn", "Vishali", "Viveka", "Vladimir", "Vladislav", "Vlaric", "Vobur", "Voirath",
    "Vokos", "Voldor", "Volkan", "Volney", "Volodya", "Volund", "Vonya", "Voranor", "Vrashin", "Vulpen", "Vurog", "Vusil", "Vyecheslav",
    "Vyner", "Wadleigh", "Waenwryht", "Wager", "Waisham", "Waivan", "Wakeman", "Wakkar", "Walborg", "Walda", "Waldan", "Waldegrave", "Waldemar",
    "Waleran", "Walford", "Walid", "Walker", "Wanhim", "Waring", "Wariv", "Wark", "Warne", "Warrender", "Warrigel", "Warwick", "Waryk",
    "Watson", "Watt", "Waylan", "Wayland", "Waylon", "Wealin", "Wedlake", "Weilborn", "Weiryn", "Wel", "Wemick", "Wendolyn", "Wertha",
    "Westcott", "Westen", "Weyrn", "Wharrom", "Whitwell", "Whyte", "Wicca", "Wideman", "Wightman", "Wildhair", "Wilfrid", "Wilhelm", "Wilhelmina",
    "Wilibald", "Will", "Willa", "William", "Willock", "Willow", "Wilma", "Wilmar", "Wilner", "Wilven", "Windham", "Winfrey", "Winian",
    "Winslow", "Winton", "Wisp", "Wisuth", "Wivianne", "Wizlow", "Woart", "Wodan", "Wolfgang", "Wolmar", "Womal", "Woodfin", "Woodruff",
    "Wooligar", "Wortley", "Wotan", "Wulf", "Wulfgar", "Wulfric", "Wulgar", "Wychnor", "Wycliffe", "Wyllows", "Wyly", "Wynkyn", "Wynne",
    "Wynston", "Wyvan", "Xaandria", "Xaath", "Xabian", "Xabiel", "Xabu", "Xain", "Xalthan", "Xan", "Xanaphel", "Xanathar", "Xander",
    "Xandra", "Xandria", "Xanthon", "Xanthus", "Xarek", "Xarolith", "Xaver", "Xavier", "Xavin", "Xela", "Xelmonth", "Xena", "Xenia",
    "Xenoba", "Xera", "Xercon", "Xerravin", "Xiombarg", "Xoncarg", "Xoran", "Xulan", "Xyas", "Xydra", "Xyko", "Xylah", "Xylia",
    "Xymoya", "Xystus", "Xythrin", "Xytrin", "Yacima", "Yaheira", "Yahira", "Yaigin", "Yakov", "Yalan", "Yali", "Yalin", "Yalniz",
    "Yamari", "Yana", "Yandell", "Yangin", "Yanira", "Yannul", "Yara", "Yaraia", "Yarali", "Yardim", "Yardley", "Yari", "Yarim",
    "Yarin", "Yarir", "Yaritza", "Yartrina", "Yasimina", "Yasir", "Yasmina", "Yasser", "Yastar", "Yatay", "Yavana", "Yazihane", "Yelain",
    "Yeni", "Yetne", "Yevgenii", "Yezade", "Ygerna", "Ygraine", "Yishana", "Ynryc", "Ynvar", "Yoda", "Yolanda", "Yondalla", "York",
    "Yradry", "Yreoddyn", "Yrrkoon", "Yrsa", "Yrun", "Yryllyn", "Ysabel", "Ysgerryn", "Ysolde", "Yuri", "Yvain", "Yvette", "Yvonne",
    "Yvyr", "Yénisar", "Yérusha", "Zabdiel", "Zacarias", "Zachary", "Zachris", "Zadock", "Zahara", "Zahra", "Zaidh", "Zalazar", "Zalbar",
    "Zan", "Zandra", "Zanifa", "Zanthar", "Zara", "Zaranthe", "Zared", "Zarimarth", "Zarquan", "Zathras", "Zavel", "Zaviv", "Zay",
    "Zazumel", "Zebalane", "Zebulon", "Zehir", "Zelda", "Zemenar", "Zenda", "Zendrac", "Zenith", "Zenobia", "Zenon", "Zepher", "Zephyr",
    "Zerika", "Zerin", "Zeswick", "Zhalore", "Zhanna", "Zharvek", "Zhenya", "Zhirek", "Zhirem", "Zhoreb", "Zia", "Zigmal", "Zilar",
    "Zinaida", "Zincir", "Zion", "Ziona", "Zircon", "Zirzihin", "Zita", "Zoe", "Zolabar", "Zoltan", "Zona", "Zora", "Zorashad",
    "Zorayas", "Zorlan", "Zosia", "Zotar", "Zumurrud", "Zurrog", "Zykhiralamshad"];
  makeArrays();
}