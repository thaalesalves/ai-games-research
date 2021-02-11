const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const findItemInInventory = (itemName) => {
  return getInventory().find(item => {
    return item.name == itemName;
  });
}

const removeFromInventory = (itemName, itemQuantity) => {
  let item = findItemInInventory(itemName);
  if (!(item.quantity == itemQuantity) && (item.quantity > 1 && item.quantity >= itemQuantity)) {
    item.quantity -= itemQuantity;
    return `\nYou have removed ${itemQuantity} ${itemName} from your inventory.`;
  } else {
    let index = getInventory().indexOf(item);
    getInventory().splice(index, 1);
    return `\nYou have removed all ${itemName} from your inventory.`;
  }
}

const checkInventory = () => {
  let items = '';

  if (getInventory().length > 0) {
    getInventory().forEach((item) => {
      items += item.quantity + ' ' + item.name + ', ';
    });

    return `\nYour inventory contains: ${items}`;
  }

  return `\nYour inventory is empty.`;
}

const getInventory = () => {
  if (typeof state.inventory == 'undefined') {
    state.inventory = [];
  }

  return state.inventory;
}

const addToInventory = (itemName, itemQuantity) => {
  
  let item = findItemInInventory(itemName);
  if (typeof state.inventory == 'undefined') {
    state.inventory = [];
  }

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