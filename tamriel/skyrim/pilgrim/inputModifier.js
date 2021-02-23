const modifier = (text) => {
  let stop = false;
  let modifiedText = nameReplace(text);
  const lowered = modifiedText.toLowerCase();

  if (!state.init && info.actionCount < 1) {
    grabAllBrackets(modifiedText);
    state.character = {
      name: state.placeholders[0],
      gender: state.placeholders[1],
      race: state.placeholders[2],
      age: state.placeholders[3],
      personality: state.placeholders[4].replace(/,/g, '/'),
      class: 'Pilgrim',
      eyes: {
        eyeColor: state.placeholders[5]
      },
      hair: {
        hairStyle: state.placeholders[6],
        hairColor: state.placeholders[7],
      },
      appearance: {
        height: state.placeholders[8].replace('cm', '').replace('centimeters', ''),
        weight: state.placeholders[9].replace('kg', '').replace('kilos', ''),
        features: state.placeholders[10].replace(/,/g, '/')
      },
      story: state.placeholders[11]
    };

    addToInventory('White Hide Jerkin', 1);
    equipItem('White Hide Jerkin');

    getInventory();
    state.init = true;
    state.shouldStop = false;
    modifiedText = modifiedText.replace(BRACKETS, '') + parseRace(state.character);
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
  } else if (lowered.includes('equip')) {
    state.shouldStop = true;
    let itemName = lowered.split('equip')[1].trim();
    modifiedText += equipItem(itemName);
    console.log(getInventory());
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);