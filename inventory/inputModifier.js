const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();

  if (typeof state.inventory == 'undefined') {
    state.inventory = [];
  }

  if (lowered.includes('inventory')) {
    if (lowered.includes('check')) {
      stop = true;
      modifiedText = modifiedText + checkInventory();
      console.log(getInventory());
    } else if (lowered.includes('add')) {
      stop = true;
      const itemToBeAdded = lowered.split('add').pop().split('to')[0];
      const itemName = capitalize(itemToBeAdded.replace(/[0-9]/g, '').trim());
      const itemQuantity = parseInt(itemToBeAdded.replace(/\D/g, '').trim());

      modifiedText = modifiedText + addToInventory(itemName, itemQuantity);
      console.log(getInventory());
    } else if (lowered.includes('remove')) {
      stop = true;
      const itemToBeRemoved = lowered.split('remove').pop().split('from')[0];
      const itemName = capitalize(itemToBeRemoved.replace(/[0-9]/g, '').trim());
      const itemQuantity = parseInt(itemToBeRemoved.replace(/\D/g, '').trim());

      modifiedText = modifiedText + removeFromInventory(itemName, itemQuantity);
      console.log(getInventory());
    }
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);