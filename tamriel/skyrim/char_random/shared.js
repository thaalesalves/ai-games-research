const BRACKETED = /\[(.*?)\]/g;
const BRACKETS = /\[|\]/g;
const DIGIT_REGEX = /\D/g;
const LETTER_REGEX = /[0-9]/g;
const PUNCTUATION_REMOVE = /[^\w\s]/gi;
const WEAPON_REGEX = new RegExp(/(crossbow|bow)/i);
const WORN_REGEX = new RegExp(`(?<=WORN<you>:)(.*)(?=;)`);
const INVENTORY_REGEX = new RegExp(`(?<=INV<you>:)(.*)(?=.)`);

const WEAPONS = [
  'sword', 'knife', 'spear', 'hammer', 'axe', 'battleaxe', 'sledgehammer', 'longsword', 'bow', 'pickaxe'
];

const CLOTHING = [
  'rags', 'armor', 'dress', 'kilt', 'skirt', 'jerkin', 'shirt', 'clothes', 'robes', 'leathers', 'hooded', 'cuirass', 'chainmail', 'gauntlets', 'vambraces', 'tights'
];

const RANDOM_CHARACTERS = [
  {
    name: `Rolff Stone-Fist`,
    gender: `male`,
    race: `Nord`,
    age: '17',
    personality: 'strong, tough, intimidating',
    class: 'peasant',
    eyes: {
      eyeColor: 'light brown'
    },
    hair: {
      hairStyle: 'short and messy',
      hairColor: 'light blond'
    },
    appearance: {
      height: '187',
      weight: '90',
      features: 'muscular, long square jaw, short beard'
    },
    storyStart: `You look around. Your friends are working their backs off in the mine, just like you. You know their families, and they're good people. You feel for them, as you all struggle to make ends meet. You have to do something about that.`,
    worn: `loose green breeches and white shirt`,
    weapon: 'pickaxe'
  },
  {
    name: `Pasha Antine`,
    gender: `female`,
    race: `Dunmer`,
    age: `25`,
    personality: `very intimidating`,
    class: `peasant`,
    eyes: {
      eyeColor: `dark brown`
    },
    hair: {
      hairStyle: `long hair`,
      hairColor: `black`
    },
    appearance: {
      height: `182`,
      weight: `75`,
      features: `beautiful, tall, striking`
    },
    storyStart: `You are at your home. You've worked the mine your entire life, just like your parents. But you want more. You want to see the world, to set sail and go abroad. You want adventure. Your father does not approve of your dream, and you get in an argument with him.\n"Pasha, you need to think about life. You can't go around traveling, this is no life for someone like you. Where will you get money to stay alive?", you father asks. He seems angry with your ideals.`,
    worn: `loose green breeches and white shirt`,
    weapon: 'pickaxe'
  },
  {
    name: `Sirilias`,
    gender: `male`,
    race: `Imperial`,
    age: `32`,
    personality: `brave, kind, loyal`,
    class: `sailor`,
    eyes: {
      eyeColor: `blue`
    },
    hair: {
      hairStyle: `curly`,
      hairColor: `brown`
    },
    appearance: {
      height: `185`,
      weight: `79`,
      features: `muscular, strong jaw, prominent chin`
    },
    storyStart: `You are in the middle of the woods, and you're lost. You don't know how to get to civilization, and the bandits that imprisioned you are looking for you. You have a shiv, and that's all you can use to defend yourself. The woods of Skyrim are known to be home to wolves, sabre cats and bears.`,
    worn: `rags`,
    weapon: `shiv`
  },
  {
    name: `Ryana`,
    gender: `female`,
    race: `Imperial`,
    age: `26`,
    personality: `calm, quiet, friendly, loyal`,
    class: `warrior`,
    eyes: {
      eyeColor: `green`
    },
    hair: {
      hairStyle: `long and straight`,
      hairColor: `brown`
    },
    appearance: {
      height: `170`,
      weight: `60`,
      features: `birthmark on right shoulder, calloused and scarred hands, oval face`
    },
    storyStart: `You are in the middle of the woods, and you're lost. You don't know how to get to civilization, and the bandits that imprisioned you are looking for you. You have a shiv, and that's all you can use to defend yourself. The woods of Skyrim are known to be home to wolves, sabre cats and bears.`,
    worn: `rags`,
    weapon: `shiv`
  },
  {
    name: `Torel Forgewood`,
    gender: `male`,
    race: `Nord`,
    age: `26`,
    personality: `self-centered,arrogant,dishonorable`,
    class: `warrior`,
    eyes: {
      eyeColor: `steely blue`
    },
    hair: {
      hairStyle: `long and straight`,
      hairColor: `dark blonde`
    },
    appearance: {
      height: `180`,
      weight: `90`,
      features: `strong chin and jawline,strong and muscular,tanned skin`
    },
    storyStart: `You are at your mercenary corp's base, in the woods of Falkreath. Talagar, the leader of the mercenary, comes to you with a mission. A noble has hired you to escort him from the Pale Pass to Solitude. Talagar approaches you and says:`,
    worn: `steel cuirass over his fur tunic and steel greaves and fur and leather boots and leather and steel gauntlets`,
    weapon: `long steel sword`
  },
  {
    name: `Tulla Jenssen`,
    gender: `female`,
    race: `Nord`,
    age: `23`,
    personality: `brave,courageous,foolhardy`,
    class: `warrior`,
    eyes: {
      eyeColor: `blue`
    },
    hair: {
      hairStyle: `long`,
      hairColor: `blonde`
    },
    appearance: {
      height: `180`,
      weight: `75`,
      features: `tall,muscular,strong`
    },
    storyStart: `You get in an argument with your father. You tell him that you will run away from home if he doesn't let you marry the blacksmith. He's furious with you, and threatens to disown you if you don't obey his demands. Defiant, you pack up your things and leave your family house. You make your way to the blacksmith's house, as you know your beloved will be working there. However, when you arrive at the blacksmith's house, the place is dark and abandoned. You panic and break into tears.`,
    worn: `fine silk dress with a long coat`,
    weapon: `wooden long bow`
  }
];

/**
 * Function that generates random characters
 *  
 */
const generateCharacter = () => {
  state.character = RANDOM_CHARACTERS[Math.floor(Math.random() * RANDOM_CHARACTERS.length)];
  playerWorldInfo = {
    keys: `${state.character.name},you`,
    hidden: false,
    entry: 'you:['
      + `NAME:${state.character.name}; `
      + `SUMM:age<${state.character.age}y>/race<${state.character.race}>/${state.character.appearance.height}cm&${state.character.appearance.weight}kg; `
      + `APPE<you>:${state.character.appearance.features}/eyes<${state.character.eyes.eyeColor}>/hair<${state.character.hair.hairStyle}&${state.character.hair.hairColor}>; `
      + `MIND:${state.character.personality}; `
      + `WORN<you>:nothing; `
      + `INV<you>:nothing.`
      + ']'
  };

  addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);
  state.character.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes(state.character.name));

  addToInventory(state.character.worn, 1);
  addToInventory(state.character.weapon, 1);
  equipItem(state.character.worn);
  equipItem(state.character.weapon);
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
 * Limits player details provided in prompt to only three items
 * 
 * @param {string} text 
 */
 function limitCharacterDetails(text) {
  console.log(`START limitCharacterDetails(): parsing character details: ${text}`);
  return text.replace(/, /g, ',').split(',').slice(0, 3).join('/').trim();
}

/**
 * Finds an item in the player's inventory
 * @param {string} itemName 
 */
const findItemInInventory = (itemName) => {
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
const removeFromInventory = (itemName, itemQuantity) => {
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
const checkInventory = () => {

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
const getInventory = () => {
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
const addToInventory = (itemName, itemQuantity) => {

  console.log(`START addToInventory(): adding ${itemQuantity} instances of "${itemName}" to player's inventory.`);
  let loweredName = itemName.toLowerCase().replace(PUNCTUATION_REMOVE, '');
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
const equipItem = (itemName) => {
  console.log(`START equipItem(): equipping ${itemName}`);
  const itemNameLowerCase = itemName.toLowerCase();
  let itemToBeEquipped = findItemInInventory(itemNameLowerCase);
  if (typeof itemToBeEquipped != 'undefined') {
    const itemToBeEquippedIndex = state.inventory.findIndex(x => x.name == itemToBeEquipped.name);
    console.log(`INSIDE equipItem(): ${itemName} exists in player's inventory`);
    if (itemToBeEquipped.type != 'weapon' && itemToBeEquipped.type != 'clothing') {
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
    return `\nYou are now ${itemToBeEquipped.type == 'weapon' ? 'wielding' : 'wearing'} ${itemToBeEquipped.name}.`;
  }

  console.log(`END equipItem(): Player does not have "${itemNameLowerCase}" in their inventory.`);
  return `\nYou do not have "${itemNameLowerCase}" in your inventory.`;
}

/**
 * Debugs your inventory and corrects the player's WI in case it fails
 */
const debugInventory = () => {
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
const updateInventory = () => {
  console.log(`START updateInventory(): updating player's inventory and WI with current items`);
  let playerWorldInfo = worldEntries.find(x => x.keys.includes('you'));
  let itemsInInventory = playerWorldInfo.entry.match(INVENTORY_REGEX)[0];
  itemsInInventory = getInventory().map((k) => {
    console.log(`INSIDE updateInventory(): Sorting inventory items and quantities into player WI`);
    return `${k.name}< quantity: ${k.quantity}>`;
  }).join('/');

  playerWorldInfo.entry = playerWorldInfo.entry.replace(INVENTORY_REGEX, itemsInInventory);
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

/**************************************************************************
***************************************************************************
***************************************************************************
*********************** FUNCTIONS MADE BY OTHER DEVS **********************
***************************************************************************
***************************************************************************
**************************************************************************/

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

/**
 * Encounters by Gnurro.
 * 
 * Makes random encounters possible in-game
 */
encounterDB = {
  /** Fight encounters */
  wolfAttack: {
    encounterID: 'wolfAttack',
    triggers: ["(spot|see|find).*wol(f|ves).*", '(walk|run|stroll|rid(e|ing)).*(woods|road(|s)*)', "enter.*(cave|warren|thicket).*"],
    chance: 80,
    duration: 5,
    messageString: `Wolf attack!`,
    contextNotes: ['You are being attacked by a wolf!', 'A wolf is attacking you!'],
    endTriggers: ["(kill|scare).*(wol(f|ves))"],
    textNotes: [
      `You hear howling, not far from where you are. The howling gets closer, and you start to feel uneasy. You look around, trying to find where it's coming from, and when you turn around. It's a wolf!`
    ],
    outputLock: true,
    inputLock: false,
    branches: [
      {
        branchID: 'packWolfAttack',
        branchChance: 50,
        branchTextNotes: [
          `You hear howling, not far from where you are. The howling gets closer, and now it sounds like more than one. You look around, trying to find where it's coming from, and then you see it. It's a pack of wolves!`
        ],
      }
    ]
  },
  bearAttack: {
    encounterID: 'bearAttack',
    triggers: ["(spot|see|find).*bear(|s).*", '(walk|run|stroll|rid(e|ing)).*(woods|road(|s)*)', "enter.*(cave|warren|thicket).*"],
    chance: 50,
    duration: 5,
    messageString: 'Bear attack',
    contextNotes: ['You are being attacked by a bear!', 'A bear is attacking you!'],
    endTriggers: ["(kill|scare).*bear(|s)"],
    textNotes: [
      `You hear some growling. It's definetely a bear. You hear it getting close, and you start to feel uneasy. When you look to your right, you see it. It's a bear!`
    ],
    outputLock: true,
    inputLock: false,
    branches: [
      {
        branchID: 'packBearAttack',
        branchChance: 10,
        branchTextNotes: [
          `You hear some growling. It's definetely a bear. But it doesn't sound like just one. It's uncommon for bears to attack in groups, but you seem to haven been chosen. It's a sleuth of bears!`
        ],
      }
    ]
  },
  sabreCatAttack: {
    encounterID: 'sabreCatAttack',
    triggers: ["(spot|see|find).*sabre cat(|s).*", '(walk|run|stroll|rid(e|ing)).*(woods|road(|s)*)', "enter.*(cave|warren|thicket).*"],
    chance: 50,
    duration: 5,
    messageString: 'Sabre cat attack!',
    contextNotes: ['You are being attacked by a sabre cat!', 'A sabre cat is attacking you!'],
    endTriggers: ["(kill|scare).*sabre cat(|s)"],
    textNotes: [
      `You hear some roaring, but you can't tell what animal it is. But it sounds angry... and hungry. You hear it getting close, and you start to feel uneasy. When you turn around... it's a sabre cat!`
    ],
    outputLock: true,
    inputLock: false,
    branches: [
      {
        branchID: 'packSabreCatAttack',
        branchChance: 10,
        branchTextNotes: [`You hear some roaring... and it sounds like there's more than one animal tracking. You start to feel uneasy, as you're sure you're about to be attacked. When you turn arround... it's a pack of sabre cats!`],
      }
    ]
  },
  trollAttack: {
    encounterID: 'trollAttack',
    triggers: ["(spot|see|find).*troll(|s).*", '(walk|run|stroll|rid(e|ing)).*(woods|road(|s)*)', "enter.*(cave|warren|thicket).*"],
    chance: 20,
    duration: 5,
    messageString: 'Troll attack!',
    contextNotes: ['You are being attacked by a troll!', 'A troll is attacking you!'],
    endTriggers: ["(kill|scare).*troll(|s)"],
    textNotes: [
      `You hear some growling and roaring. You can't tell what kind of creature is making this horrendous sound, but it's close. And getting closer. It's approaches you, and you turn to look at it. It's a troll!`
    ],
    outputLock: true,
    inputLock: false,
    branches: [
      {
        branchID: 'packTrollAttack',
        branchChance: 5,
        branchTextNotes: [
          `You hear some growling and roaring. It sounds like more than one creature, and they're getting closer... when you think of looking around, they show themselves. Two trolls are attacking you!`
        ],
      }
    ]
  },

  /** Weather */
  weather: {
    inputLock: true,
    encounterID: 'weather',
    chance: 50,
    memoryAdd: {
      memoryText: 'The weather has changed!',
      memoryLocation: 'top',
      memoryLingerDuration: 5
    },
    cooldown: 10,
    duration: 0,
    branches: [
      {
        branchTriggers: [
          '.*(snow(|ing)|road|out(doors|side)|freezing|cold).*'
        ],
        branchID: 'weatherSnowStorm',
        branchChance: 5,
        branchChained: ['snowStorm']
      },
      {
        branchTriggers: [
          '.*(road|out(doors|side)|night).*'
        ],
        branchID: 'weatherBeautifulNight',
        branchChance: 15,
        branchChained: ['beautifulNight']
      }
    ]
  },
  snowStorm: {
    inputLock: true,
    encounterID: 'snowStorm',
    messageString: 'A snow storm! Be careful! It will last for 10 actions!',
    contextNotes: [
      'A snow storm is here! Protect yourself or you\'ll freeze to death!'
    ],
    textNotes: [
      `The air starts to feel cold all of a sudden, and a freezing breeze touches you. You start shaking from the cold, and the wind gets faster. You can't see anything, as it's all white. You're caught in a snow storm!`
    ],
    duration: 10,
    cooldown: 50
  },
  beautifulNight: {
    inputLock: true,
    encounterID: 'beautifulNight',
    messageString: 'It\'s a beautiful night!',
    contextNotes: [
      'It\'s a beautiful night!'
    ],
    textNotes: [
      `You look up. The night sky is amazing! You can see the stars bright in the distance, and the aurora is shimmering in the sky like an ethereal snake. The night is bright because of the beautiful lights in the sky, and you just can't stop looking at them. It's too beautiful.`,
    ],
    duration: 10,
    cooldown: 50,
  },

  /** Random events */
  rebellion: {
    outputLock: true,
    encounterID: 'rebellion',
    chance: 1,
    messageString: `A rebellion is happening!`,
    memoryAdd: {
      memoryText: `A rebellion is happening!`,
      memoryLocation: "top",
      memoryLingerDuration: 10
    },
    cooldown: 20,
    duration: 0,
    chained: ['whiterunRebellion', 'riftenRebellion',]
  },
  whiterunRebellion: {
    outputLock: true,
    encounterID: 'whiterunRebellion',
    messageString: `The citizens of Whiterun are rebelling against the Jarl!`,
    memoryAdd: {
      memoryText: `The citizens of Whiterun are not in agreement with Jarl Yolanda's debauchery and parties. She seems to be partying all the time at the expense of the people's taxes!`,
      memoryLocation: "top",
      memoryLingerDuration: 10
    },
    textNotes: [
      `You hear rumors of a rebellion in Whiterun. The citizens of the city are not in agreement with Jarl Yolanda's debauchery and parties. She seems to be partying all the time at the expense of the people's taxes!`,
    ],
    cooldown: 20,
    duration: 0,
  },
  riftenRebellion: {
    outputLock: true,
    encounterID: 'riftenRebellion',
    messageString: `The citizens of Riften are rebelling against the Jarl!`,
    memoryAdd: {
      memoryText: `The citizens of Riften are revolting against Jarl Erikur for his negligence towards people's safaty! The Thieves Guild is growing, and people are getting mugged and robbed all the time, and the guards do nothing!`,
      memoryLocation: "top",
      memoryLingerDuration: 10
    },
    textNotes: [
      `You hear rumors of a rebellion in Riften. The citizens are revolting against Jarl Erikur for his negligence towards people's safety! The Thieves Guild is growing, and people are getting mugged and robbed all the time, and the guards do nothing!`,
    ],
    cooldown: 20,
    duration: 0,
  },
  tavernBrawl: {
    encounterID: 'tavernBrawl',
    triggers: [
      '.*(bar|pub|tavern|inn|brawl(|ing|er(|s))).*'
    ],
    chance: 10,
    cooldown: 10,
    duration: 5,
    branches: [
      {
        branchID: 'brawlWithYouBranch',
        branchChance: 5,
        branchChained: ['brawlWithYou']
      },
      {
        branchID: 'brawlWithBrawlersBranch',
        branchChance: 5,
        branchChained: ['brawlWithBrawlers']
      }
    ]
  },
  brawlWithYouBranch: {
    encounterID: 'brawlWithYouBranch',
    messageString: 'Someone challanged you to a brawl!',
    contextNotes: [
      `You're brawling with someone!`
    ],
    textNotes: [
      `A random drunk man starts screaming at you for some reason. He's so drunk you can't really understand what he says. He charges at you, and punches you in the face.`,
    ],
    duration: 10,
    cooldown: 20,
  },
  brawlWithBrawlers: {
    encounterID: 'brawlWithBrawlers',
    messageString: 'There are people brawling at the tavern!',
    contextNotes: [
      'People are brawling at the tavern!'
    ],
    textNotes: [
      `Two guys are yelling at each other, they seem angry. One of them gets up from his chair and just punches the other one in the face. The man who got punched screams something unintelligible and charges at the other one. They're in a serious brawl.`,
    ],
    duration: 10,
    cooldown: 20,
  }
}

// word list stuff like gauntlet script:
encounterWordLists = {
  /* Remove this line (and the one below) to enable the example word lists
  charClass:["mage","fighter","valkyrie"],
  pattern:["sprinkles", "dots", "lines"],
  color:["red","blue","green","yellow","orange"],
  amount:["many","few","all of them"]
   */ // Remove this line (and the one above) to enable the example word lists
}

// WI data imports:
for (WIentry of worldInfo) {
  // encounters from WI:
  // these will be lower priority then the hardcoded ones above!
  if (WIentry.keys.includes('!encounterDef')) {
    encounterDefFromWI = JSON.parse(WIentry.entry)
    console.log(`Found WI encounterDef for '${encounterDefFromWI.encounterID}', adding it to the DB!`)
    encounterDB[encounterDefFromWI.encounterID] = encounterDefFromWI
  }
  // word lists from WI:
  if (WIentry.keys.includes('!encounterWordListsFull')) {
    encounterWordListsFromWI = JSON.parse(WIentry.entry)
    console.log(`Found full WI encounterWordLists entry, adding them to the DB!`)
    for (encounterSingleWordList in encounterWordListsFromWI) {
      encounterWordLists[encounterSingleWordList] = Object.values(encounterWordListsFromWI[encounterSingleWordList])
    }
  }
  if (WIentry.keys.includes('!encounterWordListSingle')) {
    encounterWordListSingleFromWI = JSON.parse(WIentry.entry)
    console.log(`Found WI encounterWordList, adding it to the DB!`)
    encounterWordLists[Object.keys(encounterWordListSingleFromWI)[0]] = Object.values(encounterWordListSingleFromWI)
  }
}


// encounter functions: (DON'T MESS WITH THESE!)
function updateCurrentEncounter(encounterUpcoming) { // sets or clears currentEncounter; if argument empty, clears current encounter
  // limiting encounter recurrence:
  if (state.currentEncounter) {
    if (state.currentEncounter.recurrenceLimit) {
      if (!state.limitedEncounters) {
        state.limitedEncounters = []
        state.limitedEncounters.push([state.currentEncounter.encounterID, state.currentEncounter.recurrenceLimit - 1])
      } else {
        for (limiter of state.limitedEncounters) {
          if (limiter[0] == state.currentEncounter.encounterID) {
            console.log(`'${state.currentEncounter.encounterID}' recurrence already has a limit.`)
            if (limiter[1] > 0) {
              limiter[1] = limiter[1] - 1
            }
          } else {
            state.limitedEncounters.push([state.currentEncounter.encounterID, state.currentEncounter.recurrenceLimit - 1])
          }
        }
      }
    }
    if (state.currentEncounter.cooldown) {
      if (!state.cooldownEncounters) {
        state.cooldownEncounters = []
      }
      state.cooldownEncounters.push([state.currentEncounter.encounterID, state.currentEncounter.cooldown])
    }
  }
  if (encounterUpcoming) {
    console.log(`Setting current encounter to '${encounterUpcoming}'.`)
    state.currentEncounter = encounterDB[encounterUpcoming]
    // random initial values handling:
    randomizables = ['duration', 'activationDelay', 'cooldown']
    for (encounterValue of randomizables) {
      if (typeof (state.currentEncounter[encounterValue]) !== 'undefined') {
        if (typeof (state.currentEncounter[encounterValue]) !== 'number' && state.currentEncounter[encounterValue].length == 2) {
          console.log(`${encounterUpcoming} has random ${encounterValue}: ${state.currentEncounter[encounterValue]}`)
          state.currentEncounter[encounterValue] = getRndInteger(state.currentEncounter[encounterValue][0], state.currentEncounter[encounterValue][1])
          console.log(`${encounterUpcoming} random ${encounterValue} set to ${state.currentEncounter[encounterValue]}`)
        }
      }
    }
  } else {
    console.log("Clearing current encounter.")
    delete state.currentEncounter
  }
}

function updateCurrentEffects() { // 'activates' currentEncounter; or clears encounter effects if there is no active encounter
  if (state.currentEncounter) {
    if (state.currentEncounter.messageString) {
      state.message = state.currentEncounter.messageString
    }
    if (state.currentEncounter.contextNotes) {
      state.encounterNote = getRndFromList(state.currentEncounter.contextNotes)
    }
    if (state.currentEncounter.displayStatNotes) {
      displayStatsUpdate(getRndFromList(state.currentEncounter.displayStatNotes))
    }
  } else {
    delete state.message
    delete state.encounterNote
  }
}

function fillPlaceholders(placeHolderString) {
  curPlaceholderMatches = placeHolderString.match(/\{(.*?)\}/g)
  if (curPlaceholderMatches) {
    console.log(`Matched placeholders: ${curPlaceholderMatches}`)
    for (placeholder of curPlaceholderMatches) {
      console.log(`Current placeholder: ${placeholder}`)
      if (placeholder[1] == '*') {
        console.log(`Current placeholder ${placeholder} contains a *, checking temporary word lists...`)
        placeholder = placeholder.replace(/(\*|{|})/gi, '')
        if (typeof (tempWordLists) == 'undefined') {
          tempWordLists = {}
        }
        if (!tempWordLists[placeholder] || tempWordLists[placeholder].length == 0) {
          console.log(`${placeholder} temporary wordlist is either non-existant or empty! Getting a new one.`)
          tempWordLists[placeholder] = JSON.parse(JSON.stringify(encounterWordLists[placeholder]))
        }
        console.log(`Current temporary word lists:${tempWordLists}`)
        for (insertTag in tempWordLists) {
          if (placeholder.includes(insertTag)) {
            console.log(`Found fitting placeholder tag in temporary list: ${insertTag}`)
            pickedInsert = getRndFromList(tempWordLists[insertTag])
            console.log(`Randomly picked placeholder insert from temporary list: ${pickedInsert}`)
            insertRegEx = new RegExp(`{\\*${insertTag}}`,)
            placeHolderString = placeHolderString.replace(insertRegEx, pickedInsert)
            tempWordLists[placeholder].splice(tempWordLists[placeholder].indexOf(pickedInsert), 1)
          }
        }
      } else {
        for (insertTag in encounterWordLists) {
          if (placeholder.includes(insertTag)) {
            console.log(`Found fitting placeholder tag: ${insertTag}`)
            pickedInsert = getRndFromList(encounterWordLists[insertTag])
            console.log(`Randomly picked placeholder insert: ${pickedInsert}`)
            insertRegEx = new RegExp(`{${insertTag}}`,)
            placeHolderString = placeHolderString.replace(insertRegEx, pickedInsert)
          }
        }
      }
    }
    delete tempWordLists
  }

  return placeHolderString;
}

// misc helper functions:
// get random
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

// list-picker, dynamically handles weighted lists
function getRndFromList(list) {
  if (list[0].length == 2) {
    console.log(`${list} looks like a weighted list, doing that!`)
    return (getRndFromListWeighted(list))
  } else {
    console.log(`${list} looks like a plain list, simply picking from it!`)
    return (list[getRndInteger(0, list.length)])
  }
}

// list picker for lists with weighted items:
// currently works kinda like oldschool D&D encounter lists
function getRndFromListWeighted(weightedList) {
  cutOff = getRndInteger(1, 100)
  console.log(`Picking from weighted list, cutoff: ${cutOff}`)
  for (item of weightedList) {
    console.log(`'${item[0]}' threshold: ${item[1]}.`)
    if (cutOff <= item[1]) {
      console.log(`'${item[0]}' cutoff below threshold, picking it!`)
      return item[0]
      break
    }
  }
}

// displayStats handling:
function displayStatsUpdate([inKey, inValue, inColor]) {
  // if key already exists, update; else push new entry; if no value given, removes displayStat entry matching key, if it exists
  if (!state.displayStats) {
    state.displayStats = []
  }
  let displayStatUpdated = false
  for (displayStat of state.displayStats) {
    console.log(`Checking ${displayStat.key} displayStats entry...`)
    let curDisplayStatIndex = state.displayStats.indexOf(displayStat)
    if (displayStat.key == inKey) {
      console.log(`Found ${inKey} displayStats entry: ${state.displayStats[curDisplayStatIndex].key}, ${state.displayStats[curDisplayStatIndex].value}, ${state.displayStats[curDisplayStatIndex].color}, updating!`)
      if (inValue) {
        if (typeof (inValue) == 'string') {
          inValue = fillPlaceholders(inValue)
          console.log(`Value to update displayStat entry inputted: '${inValue}', updating.`)
          state.displayStats[curDisplayStatIndex].value = inValue
        } else {
          console.log(`Value to update displayStat entry inputted: '${inValue}', updating.`)
          state.displayStats[curDisplayStatIndex].value = inValue
        }
      } else {
        console.log(`No value to update displayStat inputted, removing entry.`)
        state.displayStats.splice(curDisplayStatIndex, 1)
        displayStatUpdated = true
        break
      }
      if (inColor) {
        state.displayStats[curDisplayStatIndex].color = fillPlaceholders(inColor)
      }
      displayStatUpdated = true
      break
    }
  }
  if (!displayStatUpdated) {
    console.log(`No ${inKey} displayStats entry found, adding it!`)
    state.displayStats.push({ 'key': inKey, 'value': inValue, 'color': inColor })
  }
}

/**
 * Name synthesizer by Zaltys
 * 
 * Removed unwanted names and replaces them with better ones
 * 
 */
// List the names you wish to replace with random ones in this const.
const BADNAMES = ['Ackerson', 'Alison', 'Annah', 'Anu', 'Arat', 'Arrorn', 'Ashton', 'Azajaja', 'Big Red',
  'Brot', 'Brother Gray', 'Bucklesberg', 'Captain Dario', 'Captain Eckard', 'Captain Hayes', 'Captain Ian', 'Captain Illam', 'Carn',
  'Castus', 'Cloudpeak', 'Count Gray', 'Count Grey', 'Dark Order', 'David', 'Delantium', 'Delerg', 'Dendrin', 'Derg',
  'Dert', 'Dessel', 'Dorna', 'Dr. Kessel', 'Dr. Kovas', 'Drake', 'Draven', 'Durge', 'Ebony Claw', 'Elam',
  'Eldolith', 'Eliza', 'Eternals', 'Father Féval', 'Father Tomas', 'Felkan', 'Flog', 'Garrick', 'Grolik', "Gro'tesk", 'Haygarth',
  'Hessla', 'Holgard', 'Isabella', "J'Arel", 'Jacob', 'Jicol', 'Karth', 'Kelso',
  'Klemto', 'Klyton', 'Kralmer', 'Kyros', 'Lenay', 'Lord Rostov', 'Ludmilla', 'Magos Cern', 'Meliodas',
  'Merk', 'Mihrab', 'Mr. Demar', 'Mr. Gaange', 'Mr. Reynolds', 'Nalin', 'Nolazir', 'Null', 'Nuro', 'Oalkwardner',
  'Olive', 'Olivia', 'Oren', 'Quala', 'Ragnor', 'Ral', 'Rask', 'Retlad', 'Roldan', 'Rolomag', 'Sheriff Buckly',
  'Sir Ignate', 'Sodran', 'Svelk', 'Talia', 'Teckleville', 'The Craxil', 'The Ghoul King', 'The Great Lich Lord',
  'The Nightmare Tyrant', 'Theo', 'Trelik', 'Tulan', 'Ulivik', 'Vaughn', 'Velzix', 'Wessel', 'Zalan', 'Zalmora', 'Zuzu'];

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