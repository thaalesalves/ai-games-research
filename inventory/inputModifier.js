const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();

  if (!state.init && info.actionCount < 1) {
    grabAllBrackets(modifiedText);
    state.character = {
      name: state.placeholders[0],
      gender: state.placeholders[1],
      race: state.placeholders[2],
      class: 'Mage'
    };

    const dataBasedOnRace = parseRace(state.character.race);
    getInventory();
    state.init = true;
    modifiedText = modifiedText.replace(BRACKETS, '') + dataBasedOnRace;
  }

  if (lowered.includes('inventory')) {
    if (lowered.includes('check')) {
      stop = true;
      modifiedText += checkInventory();
      state.message = modifiedText;
      console.log(getInventory());
    } else if (lowered.includes('add')) {
      stop = true;
      const itemToBeAdded = lowered.split('add').pop().split('to')[0];
      const itemName = capitalize(itemToBeAdded.replace(LETTER_REGEX, '').trim());
      const itemQuantity = parseInt(itemToBeAdded.replace(DIGIT_REGEX, '').trim());

      modifiedText += addToInventory(itemName, itemQuantity);
      state.message = modifiedText;
      console.log(getInventory());
    } else if (lowered.includes('remove')) {
      stop = true;
      const itemToBeRemoved = lowered.split('remove').pop().split('from')[0];
      const itemName = capitalize(itemToBeRemoved.replace(LETTER_REGEX, '').trim());
      const itemQuantity = parseInt(itemToBeRemoved.replace(DIGIT_REGEX, '').trim());

      modifiedText += removeFromInventory(itemName, itemQuantity);
      state.message = modifiedText;
      console.log(getInventory());
    }
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);