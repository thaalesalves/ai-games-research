// Any functions you define here will be available in your other modifier scripts.

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
  if (!(parseInt(item.quantity) == parseInt(itemQuantity)) && (parseInt(item.quantity) > 1 && parseInt(item.quantity) >= parseInt(itemQuantity))) {
    item.quantity = (parseInt(item.quantity) - parseInt(itemQuantity)).toString();
  } else {
    let index = getInventory().indexOf(item);
    getInventory().splice(index, 1);
  }
}

const checkInventory = () => {
  let items = '';

  if (getInventory().length > 0) {
    getInventory().forEach((item) => {
      items += item.quantity + ' ' + item.name + ', ';
    });

    return '\nYour inventory contains: ' + items;
  }

  return '\nYour inventory is empty.';
}

const getInventory = () => {
  if (typeof state.inventory == 'undefined') {
    state.inventory = [];
  }

  return state.inventory;
}

const addToInventory = (itemName, itemQuantity) => {
  if (typeof state.inventory == 'undefined') {
    state.inventory = [];
  }

  item = {
    name: itemName,
    quantity: itemQuantity
  };

  state.inventory.push(item);
  return '\nYou have added ' + itemQuantity + ' ' + itemName + ' to your inventory.'
}