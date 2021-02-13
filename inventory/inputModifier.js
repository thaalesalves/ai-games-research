const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();

  if (!state.init && info.actionCount < 1) {
    state.shouldStop = false;
    getInventory();
    addToInventory('Wooden Sword', 1);
    addToInventory('Rags', 1);
    
    state.init = true;
    modifiedText = modifiedText.replace(BRACKETS, '') + dataBasedOnRace;
  }

  if (lowered.includes('inventory')) {
    if (lowered.includes('check')) {
      state.shouldStop = true;
      modifiedText += checkInventory();
      console.log(getInventory());
    } else if (lowered.includes('add')) {
      state.shouldStop = true;
      const itemToBeAdded = lowered.split('add').pop().split('to')[0];
      const itemName = itemToBeAdded.replace(LETTER_REGEX, '').trim();
      const itemQuantity = parseInt(itemToBeAdded.replace(DIGIT_REGEX, '').trim());

      modifiedText += addToInventory(itemName, itemQuantity);
      console.log(getInventory());
    } else if (lowered.includes('remove')) {
      state.shouldStop = true;
      const itemToBeRemoved = lowered.split('remove').pop().split('from')[0];
      const itemName = itemToBeRemoved.replace(LETTER_REGEX, '').trim();
      const itemQuantity = parseInt(itemToBeRemoved.replace(DIGIT_REGEX, '').trim());

      modifiedText += removeFromInventory(itemName, itemQuantity);
      console.log(getInventory());
    }
  } else if (lowered.includes('put on')) {
    state.shouldStop = true;
    let itemName = lowered.split('put on')[1].trim();
    modifiedText += wearItem(itemName);
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);