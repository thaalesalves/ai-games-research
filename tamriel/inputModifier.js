
// Checkout the repo examples to get an idea of other ways you can use scripting 
// https://github.com/latitudegames/Scripting/blob/master/examples

const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();
  
  if (lowered.includes('inventory') && lowered.includes('check')) {
    stop = true;
    modifiedText = modifiedText + checkInventory();
    console.log(getInventory());
  } else if (lowered.includes('inventory') && lowered.includes('add')) {
    stop = true;
    const itemToBeAdded = lowered.split('add').pop().split('to')[0];
    const itemName = capitalize(itemToBeAdded.replace(/[0-9]/g, '').trim());
    const itemQuantity = itemToBeAdded.replace(/\D/g,'').trim();

    modifiedText = modifiedText + addToInventory(itemName, itemQuantity);
    console.log(getInventory());
  } else if (lowered.includes('inventory') && lowered.includes('remove')) {
    const itemToBeRemoved = lowered.split('remove').pop().split('from')[0];
    const itemName = capitalize(itemToBeRemoved.replace(/[0-9]/g, '').trim());
    const itemQuantity = itemToBeRemoved.replace(/\D/g,'').trim();
    
    removeFromInventory(itemName, itemQuantity);
    modifiedText = modifiedText + '\nYou have removed ' + itemQuantity + ' ' + itemName + ' from your inventory';
    console.log(getInventory());
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);