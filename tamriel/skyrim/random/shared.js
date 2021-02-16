/*
**
**
** VARIABLE DECLARATIONS 
**
**
**/

const LETTER_REGEX = /[0-9]/g;
const DIGIT_REGEX = /\D/g;
const BRACKETED = /\[(.*?)\]/g;
const BRACKETS = /\[|\]/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;
const WEAPONS = [
  'sword', 'knife', 'spear', 'hammer', 'axe', 'battleaxe', 'sledgehammer', 'longsword',
];

const CLOTHING = [
  'rags', 'armor', 'dress', 'kilt', 'skirt', 'jerkin', 'shirt', 'clothes', 'robes', 'leathers', 'hooded', 'cuirass', 'chainmail'
];

const RANDOM_CHARACTERS = [

];

const RANDOM_START = [
  `PLAYER_NAME wakes up. He rubs his eyes and looks around. It seems he's in a jail cell, and no one is around. The cell in front in the one he's in is empty. "IS THERE ANYBODY HERE?", he shouts. No answer. There really is no one here. PLAYER_NAME is alone. And caged. He's wearing rags for clothes, and has no shoes. The floor of the cell is wet, and there's nothing but a trashed mattress inside the cell. PLAYER_NAME starts to panic.`,
  `PLAYER_NAME wakes up. He's at a beach, but he doesn't know which. It is freezing. There's nothing but ice everywhere. PLAYER_NAME starts to remember. He was part of the crew of the The Clinker, a cargo ship that brings merchandise from Gnisis and Seyda Neen in Vvardenfell to Northpoint in High Rock and Solitude in Skyrim. PLAYER_NAME can't see anyone from the crew, or the ship. But he remembers when they hit an iceberg and the ship sank. He gets up, wet, and looks around, trying to find a firepit or something to get warm and dry. He needs to hurry, as there is a real risk of hypothermia.`,
  `PLAYER_NAME is a professional adventurer, and decided to explore the ruins of Arkngthamz. Arkngthamz is a Dwemer ruin south of Markarth, the capital city of the Reach, and is known by some scholars that look for the legendary Aetherium Forge. PLAYER_NAME has heard about the Forge and is now on a quest to find it. But dealing with Dwemer automata is not an easy task. He is brave though. He's 10 meters from a Dwarven Ballista that is just waiting to shoot its brass arrows at someone that dares enter the ruin. PLAYER_NAME needs to think fast, otherwise the Ballista will see him and attack him.`
];

/*
**
**
** FUNCTION DECLARATIONS
**
**
**/

/**
 * Bracket handler by Gnurro.
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
 * Function that parses the character's race when they're created. This determines Dagur's behavior towards the player.
 * 
 * @param {string} race
 * @param {string} gender
 */
const parseRace = (character) => {

  let raceAlt = '';
  let race = character.race.toLowerCase();
  let possibleLines = [
    `"Let me guess... you're only here because you want to the join the College? That's all folks come here for. This city is no longer what it was."\n`,
    '"Welcome to the Fronzen Hearth! If you need anything, talk to me or to my wife Astrid. We have warm beds and quality mead!". Baelin smiles.\n',
    '"Need a room? We have warm beds and nice mead!". Baelin smiles.\n',
    `"Need a room? Talk to me or my wife Astrid, and we'll set you up!"\n`,
  ];

  if (race.includes("orsimer") || race.includes("orc")) {
    raceAlt = 'Orsimer/Orc';
    possibleLines.push(
      `"Oh, great. An Orc. Don't bash into my stuff, freak.". ${character.name} notices disdain in his voice.\n`,
      `"An Orc? Damn brutes. If you so much break a cup, I'll have the guards kick you from the city.". ${character.name} notices disdain in his voice.\n`
    );
  } if (race.includes("altmer") || race.includes("high elf")) {
    raceAlt = 'Altmer/High Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the Sea of Ghosts!"\n`,
      `"Good, an Altmer. Now I'm happy.". He speech seems sarcastic.\n`
    );
  } else if (race.includes("dunmer") || race.includes("dark elf")) {
    raceAlt = 'Dunmer/Dark Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the Sea of Ghosts!"\n`,
      `"What do you want here? Is your kind trying to take over Skyrim? Now a damn Dunmer is Empress!". ${character.name} notices disdain in his voice.\n`
    );
  } else if (race.includes("bosmer") || race.includes("wood elf")) {
    raceAlt = 'Bosmer/Wood Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the Sea of Ghosts!"\n`,
      `"Are you... a Bosmer? I've never seen one in real life. You ain't gonna eat me, right?". He seems frightened.\n`,
      `"You're a Bosmer? Is it true that you eat people's flesh?". He seems frightened.\n`
    );
  } else if (race == 'nord') {
    raceAlt = 'Nord';
    possibleLines.push(
      `"Welcome, friend! How can I help a ${character.gender == 'male' ? 'brother' : 'sister'} Nord?"\n`,
      `"You must be cold, friend. Here, have a mug of mead on the house.". He hands ${character.name} a mug of mead.\n`
    );
  } else if (race == 'breton') {
    raceAlt = 'Breton';
    `"Oh, a midget. How can I help you, friend?", Baelin laughs.\n`,
      `"A Breton in these parts? Are you lost, friend?"\n`
  } else if (race == 'imperial') {
    raceAlt = 'Imperial';
    possibleLines.push(
      `"An Imperial in these parts? Are you lost, friend?"\n`,
      `"An Imperial? It's a long way from Cyrodiil, friend. Need a bed to rest?"\n`
    );
  } else if (race == 'khajiit') {
    raceAlt = 'Khajiit';
    possibleLines.push(
      `"Here, kitty kitty kitty.". He laughs out loud. "I'm just joking, friend. What do you need?"\n`,
      `"Oh, a cat on two legs. Don't leave fur in our stuff. We're a hygienic bunch."\n`
    );
  } else if (race == 'argonian') {
    raceAlt = 'Argonian';
    possibleLines.push(
      `"Good day, lizard. How may I help you?"\n`,
      `"A lizard? Nasty.". He seems disgusted at ${character.name}.\n`
    );
  } else if (race == 'redguard') {
    raceAlt = 'Redguard';
    possibleLines.push(
      `"Good day, friend. Keeping well? It's a long way from Hammerfell. Enjoy your stay in Winterhold."\n`,
      `"A Redguard? You're good people. Strong and foolhardy like us Nords, not a bunrch of milk-drinkers like these damned elves."\n`
    );
  } else {
    possibleLines.push(
      `"Oh, you're a weird one, aren't you?". He laughs. "What race are you, ${character.gender == 'male' ? 'lad' : 'lass'}?"`,
      `"Oh, you're a weird one. What race are you? Doesn't matter, my family and I don't judge. What do you need, friend?". Baelin smiles.\n`,
      `"Oh... helo...". Baelin looks at ${character.name} and raises his eyebrow. He's clearly confused because ${character.name} doesn't look like any known race. "Do... you need something?"\n`
    );
  }

  worldEntries.push({
    id: (Math.random() * (0.120 - 0.0200) + 0.0200).toString(),
    keys: `${character.name}`,
    isNotHidden: true,
    entry: character.name + ':['
      + `RACE<${character.name}>:${raceAlt};`
      + `APPEARANCE<${character.name}>:${character.appearance.features}/eyes<${character.eyes.eyeColor}>/hair<${character.hair.hairStyle}&${character.hair.hairColor}/height<${character.appearance.height} centimeters>/weight<${character.appearance.weight} kilos>>;`
      + `SUMM<${character.name}>:${character.story}/${character.personality};`
      + ']'
  });

  return possibleLines[Math.floor(Math.random() * possibleLines.length)];
}

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
      return getInventory()[k].name;
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
  let item = findItemInInventory(itemName);
  if (typeof item != 'undefined') {
    if (item.type != 'weapon' && item.type != 'clothing') {
      return `\nThis item is not equippable.`;
    }

    let oldItem = getInventory().find(oldItem => {
      return oldItem.status == 'worn' && oldItem.type == item.type;
    });

    if (typeof oldItem != 'undefined') {
      console.log(`Removing worn status from ${oldItem.name}.`);
      oldItem.status = 'in inventory';
      state.memory.context.replace(` The player is ${oldItem.type == 'weapon' ? 'wielding' : 'wearing'} ${oldItem.name}. `, '');
    }

    console.log(`Removing worn status from ${item.name}.`);
    item.status = 'worn';
    state.memory.context += ` The player is ${item.type == 'weapon' ? 'wielding' : 'wearing'} ${item.name}. `;
    return `\nYou are now ${item.type == 'weapon' ? 'wielding' : 'wearing'} ${item.name}.`;
  }

  return `\nYou do not have \"${itemName}\" in your inventory.`;
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
