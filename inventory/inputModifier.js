const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();

  if (!state.init && info.actionCount < 1) {
    getInventory();
    addToInventory('Wooden Sword', 1);
    addToInventory('Rags', 1);
    
    state.init = true;
    modifiedText = modifiedText.replace(BRACKETS, '') + dataBasedOnRace;
  }

  if (lowered.includes('inventory')) {
    if (lowered.includes('check')) {
      modifiedText += checkInventory();
      console.log(getInventory());
    } else if (lowered.includes('add')) {
      const itemToBeAdded = lowered.split('add').pop().split('to')[0];
      const itemName = capitalize(itemToBeAdded.replace(LETTER_REGEX, '').trim());
      const itemQuantity = parseInt(itemToBeAdded.replace(DIGIT_REGEX, '').trim());

      modifiedText += addToInventory(itemName, itemQuantity);
      console.log(getInventory());
    } else if (lowered.includes('remove')) {
      const itemToBeRemoved = lowered.split('remove').pop().split('from')[0];
      const itemName = capitalize(itemToBeRemoved.replace(LETTER_REGEX, '').trim());
      const itemQuantity = parseInt(itemToBeRemoved.replace(DIGIT_REGEX, '').trim());

      modifiedText += removeFromInventory(itemName, itemQuantity);
      console.log(getInventory());
    }
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);