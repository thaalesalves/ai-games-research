const regex = {
  commands: {
    prefix: /\n? ?(?:> You |> You say "|)\/(.+?)["]?[.]?\n?$/i,
    prefixSymbol: '/'
  },
  general: {
    letter: /[0-9]/gi,
    digit: /\D/g,
    punctuation: /[^\w\s]/gi
  },
  inventory: {
    shootingWeapons: /(crossbow|bow)/i,
    wornItem: /(?<=WORN<you>:)(.*)(?=;)/gi,
    playerInv: /(?<=INV<you>:)(.*)(?=.)/gi,
    ammunition: /(?:(arrow(s|)|bullet(s|)))/i,
    weapons: /(crossbow|gun|bazooka|dagger|knife|shuriken|chakhram|sword|claymore|zweihander|rapier|epee|kukri|trident|katana|cutlass|scimitar|nodachi|tanto|naginata|spear|pike|axe|halberd|mace|flail|hammer|pickaxe|stiletto|bow)/gi,
    clothing: /(pant(ie|)s|tunic|breeches|loincloth|doublet|cloak|robe|surcoat|tabard|trousers|skirt|dress|gown|socks|gloves|hat|waistcoat|kilt|cummerbund|bowtie|necktie|tuxedo|kimono|karate gi|toe socks|sarong|scarf|legwarmers|trenchcoat|jacket|shorts|leggings|blouse|sweater|cardigantutu|rags|armor|jerkin|shirt|clothes|leathers|hood|cuirass|chainmail|gauntlets|vambraces|bracers|tights)/gi
  }
}

/**
 * Function that executes exactly once when, the adventure starts
 */
function setUpInventoryFramework() {
  console.log(`START setUpInventoryFramework(): Initializing framework.`);
  state.invSystem = {
    inventory: [],
    config: {
      enableFramework: true
    }
  }
  console.log(`END setUpInventoryFramework(): Framework initialized.`);
}

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
  let loweredName = itemName.toLowerCase().replace(regex.general.punctuation, '');
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
  let loweredName = itemName.toLowerCase().replace(regex.general.punctuation, '');
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
  if (typeof state.invSystem.inventory == 'undefined') {
    console.log(`INSIDE getInventory(): Inventory array is undefined. Declaring it with an empty array.`);
    state.invSystem.inventory = [];
  }

  console.log(`END getInventory(): player's inventory exists. Returning its contents.`);
  return state.invSystem.inventory;
}

/**
 * Adds item to player's inventory
 * @param {string} itemName 
 * @param {integer} itemQuantity 
 */
function addToInventory(itemName, itemQuantity) {

  console.log(`START addToInventory(): adding ${itemQuantity} instances of "${itemName}" to player's inventory.`);
  let loweredName = itemName.toLowerCase().replace(regex.general.punctuation, '');
  let item = findItemInInventory(loweredName);
  if (typeof item == 'undefined') {
    console.log(`INSIDE addToInventory(): Player has no other instances of this item in their inventory. Adding these.`);
    item = {
      name: loweredName,
      quantity: itemQuantity,
      status: 'in inventory',
      type: getType(itemName)
    };

    state.invSystem.inventory.push(item);
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
    const itemToBeEquippedIndex = state.invSystem.inventory.findIndex(x => x.name == itemToBeEquipped.name);
    console.log(`INSIDE equipItem(): ${itemName} exists in player's inventory`);
    if (itemToBeEquipped.type != 'weapon' && itemToBeEquipped.type != 'clothing' && itemToBeEquipped.type != 'ammo') {
      console.log(`END equipItem(): item is not equippable.`);
      return `\n${capitalize(itemNameLowerCase)} is not an equippable item.`;
    }

    let playerWorldInfo = worldEntries.find(x => x.keys.includes('you'));
    let itemsWorn = playerWorldInfo.entry.match(regex.inventory.wornItem)[0];
    let oldItem = getInventory().find(oldItem => oldItem.status == 'worn' && oldItem.type == itemToBeEquipped.type);
    if (typeof oldItem != 'undefined') {
      const oldItemIndex = state.invSystem.inventory.findIndex(x => x.name == oldItem.name);
      console.log(`INSIDE equipItem(): Player has another item of the same type equipped. Unequipping old item.`);
      itemsWorn.replace(oldItem.name.toLowerCase(), '');
      console.log(`INSIDE equipItem(): Removing worn status from ${oldItem.name}.`);
      oldItem.status = 'in inventory';
      state.invSystem.inventory[oldItemIndex] = oldItem;
    }

    itemToBeEquipped.status = 'worn';
    state.invSystem.inventory[itemToBeEquippedIndex] = itemToBeEquipped;
    itemsWorn = getInventory().filter((x) => x.status == 'worn')
      .map((k) => {
        console.log(`INSIDE equipItem(): worn item found in inventory -> ${k.name}`);
        return k.name;
      }).join('&');

    console.log(`INSIDE equipItem(): finished building new WORN string -> ${itemsWorn}`);
    playerWorldInfo.entry = playerWorldInfo.entry.replace(regex.inventory.wornItem, itemsWorn);

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
  let playerWorldInfo = worldEntries.find(x => x.keys.includes('you'));

  let itemsWorn = playerWorldInfo.entry.match(regex.inventory.wornItem)[0];
  let itemsInInventory = playerWorldInfo.entry.match(regex.inventory.playerInv)[0];

  itemsWorn = getInventory().filter((x) => x.status == 'worn')
    .map((k) => {
      console.log(`INSIDE debugInventory(): Updating player WI with worn items`);
      return k.name;
    }).join('&');

  itemsInInventory = getInventory().map((k) => {
    console.log(`INSIDE debugInventory(): Updating player WI with inventory items`);
    return `${k.name}`;
  }).join('&');

  playerWorldInfo.entry = playerWorldInfo.entry.replace(regex.inventory.wornItem, itemsWorn);
  playerWorldInfo.entry = playerWorldInfo.entry.replace(regex.inventory.playerInv, itemsInInventory);

  console.log("INSIDE debugInventory(): Fixed player WI with inventory's items.");
  console.log(`END debugInventory(): Player's WI fixed.`);
}

/**
 * Updates the player's inventory and corrects the WI
 */
function updateInventory() {
  console.log(`START updateInventory(): updating player's inventory and WI with current items`);
  let playerWorldInfo = worldEntries.find(x => x.keys.includes('you'));
  let itemsInInventory = playerWorldInfo.entry.match(regex.inventory.playerInv)[0];
  itemsInInventory = getInventory().map((k) => {
    console.log(`INSIDE updateInventory(): Sorting inventory items and quantities into player WI. Current item: ${k.name}`);
    return `${k.name}`;
  }).join('&');

  console.log(`INSIDE updateInventory(): Inserting items into WI: ${itemsInInventory}`);
  playerWorldInfo.entry = playerWorldInfo.entry.replace(regex.inventory.playerInv, itemsInInventory);
  console.log(`END updateInventory(): updated player's inventory and WI with current items.`);
}

/**
 * Function to determine item type
 * 
 * @param {string} itemType
 */
function getType(itemName) {
  if (itemName.match(regex.inventory.weapons)) {
    return 'weapon';
  } else if (itemName.match(regex.inventory.clothing)) {
    return 'clothing';
  } else if (itemName.match(regex.inventory.ammunition)) {
    return 'ammo';
  }
  return 'misc';
}

commandList = {
  scenarioHelp: {
    name: "scenarioHelp",
    description: "Prints a list of commands",
    args: false,
    usage: `Really? You need help with the help command and expected this to work? I don't blame you. Hit me at AIDcord for help.`,
    execute: (args) => {
      console.log(`Begin help command.`);
      let availableCommands = '';
      Object.keys(state.invSystem.commandList).forEach(key => {
        availableCommands += ` ${state.invSystem.commandList[key].name}`
      });

      availableCommands = availableCommands.trim().replace(/\s/g, ', ');
      console.log(`Begin help command.`);
      if (args == '') {
        state.message = `List of available commands: ${availableCommands}`;
      } else if ((!(args in commandList))) {
        state.message = `This command was not found. List of available commands: ${availableCommands}`;
      } else {
        let cmd = commandList[args];
        state.message = `Example: /${cmd.name} ${cmd.usage}\n${cmd.description}`;
      }

      console.log(`End help command.`);
    }
  },
  invAdd: {
    name: "invAdd",
    description: "Adds objects to the player's inventory",
    args: true,
    usage: '<object name> <quantity>',
    execute: (args) => {
      console.log(`invadd: ${state.invSystem.config.enableFramework}`)
      console.log(`Begin inventory add.`);
      if (state.invSystem.config.enableFramework) {
        const itemName = args.replace(regex.general.letter, '').trim();
        const itemQuantity = Number.isNaN(parseInt(args.replace(regex.general.digit, '').trim())) ? 1 : parseInt(args.replace(regex.general.digit, '').trim());

        if (itemQuantity >= 1) {
          state.message = `${addToInventory(itemName, itemQuantity)}`;
        } else {
          state.message = `You cannot add less than 1 unit of an item to your inventory.`;
        }
      } else {
        console.log(`Mechanics are disabled.`);
        state.message = `Inventory mechanics are disabled. Re-enable them with "/invMechanics enable" to use commands again.`;
      }

      console.log(`End inventory add.`);
    }
  },
  invRemove: {
    name: "invRemove",
    description: "Removes objects from the player's inventory",
    args: true,
    usage: '<object name> <quantity>',
    execute: (args) => {
      console.log(`Begin inventory remove.`);
      if (state.invSystem.config.enableFramework) {
        const itemName = args.replace(regex.general.letter, '').trim();
        const itemQuantity = Number.isNaN(parseInt(args.replace(regex.general.digit, '').trim())) ? 1 : parseInt(args.replace(regex.general.digit, '').trim());

        if (itemQuantity >= 1) {
          state.message = `${removeFromInventory(itemName, itemQuantity)}`;
        } else {
          state.message = `You cannot remove less than 1 unit of an item from your inventory.`;
        }
      } else {
        console.log(`Mechanics are disabled.`);
        state.message = `Inventory mechanics are disabled. Re-enable them with "/invMechanics enable" to use commands again.`;
      }

      console.log(`End inventory remove.`);
    }
  },
  invEquip: {
    name: "invEquip",
    description: "Equips objects from the player's inventory",
    args: true,
    usage: '<object name>',
    execute: (args) => {
      console.log(`Begin inventory equip.`);
      if (state.invSystem.config.enableFramework) {
        const itemName = args.replace(regex.general.letter, '').trim();
        state.message = `${equipItem(itemName)}`;
      } else {
        console.log(`Mechanics are disabled.`);
        state.message = `Inventory mechanics are disabled. Re-enable them with "/invMechanics enable" to use commands again.`;
      }
      console.log(`End inventory equip.`);
    }
  },
  invCheck: {
    name: "invCheck",
    description: "Checks the player's inventory",
    args: false,
    usage: '',
    execute: (args) => {
      console.log(`Begin inventory check.`);
      if (state.invSystem.config.enableFramework) {
        state.message = `${checkInventory()}`;
      } else {
        console.log(`Mechanics are disabled.`);
        state.message = `Inventory mechanics are disabled. Re-enable them with "/invMechanics enable" to use commands again.`;
      }

      console.log(`End inventory check.`);
    }
  },
  invDebug: {
    name: "invDebug",
    description: "Debugs player's inventory",
    args: false,
    usage: '',
    execute: (args) => {
      console.log(`Begin inventory debug.`);
      if (state.invSystem.config.enableFramework) {
        debugInventory();
        state.message = `Your inventory and player WI have been debugged.`;
      } else {
        console.log(`Mechanics are disabled.`);
        state.message = `Inventory mechanics are disabled. Re-enable them with "/invMechanics enable" to use commands again.`;
      }

      console.log(`End inventory debug.`);
    }
  },
  invMechanics: {
    name: "invMechanics",
    description: "Toggles inventory system mechanics",
    args: false,
    usage: '<enable or disable>',
    execute: (args) => {
      console.log(`Begin inventory toggle.`);
      if (args != '') {
        if (args == 'disable') {
          state.invSystem.config.enableFramework = false;
          state.message = 'You have disabled the inventory system mechanics.';
          console.log(`Disabled inventory mechanics toggle.`);
        } else if (args == 'enable') {
          state.invSystem.config.enableFramework = true;
          state.message = 'You have enabled the inventory system mechanics.';
          console.log(`Enabled inventory mechanics toggle.`);
        } else {
          console.log('Wrong rpg mechanic toggle arg supplied.');
          state.message = 'Invalid agument. Usage: /invMechanics <enable or disable>.';
        }
      } else {
        console.log(`Checking inventory mechanics state.`);
        state.message = `Inventory system mechanics are ${state.invSystem.config.enableFramework ? 'enabled' : 'disabled'}`;
      }

      console.log(`End inventory toggle.`);
    }
  }
}