const modifier = (text) => {
  let stop = false;
  let modifiedText = nameReplace(text);
  const lowered = modifiedText.toLowerCase();

  if (!state.init && info.actionCount < 1) {
    getInventory();
    generateCharacter();

    state.init = true;
    state.shouldStop = false;
    modifiedText = text
      + ` ${state.character.name}, and you are a ${state.character.gender} ${state.character.race} ${state.character.class}. You are ${state.character.age} years old, and your personality traits are: ${state.character.personality}. You eyes are ${state.character.eyes.eyeColor}, and your hair is of the style ${state.character.hair.hairStyle} and of color ${state.character.hair.hairColor}. You are ${state.character.appearance.height} centimeters tall, and you weight ${state.character.appearance.weight} kg. Your physical features are: ${state.character.appearance.features}.\n\nYour story is: ${state.character.story}\n\n---------------------------------------\n\n`
      + state.character.storyStart
        .replace('YOUR_NAME', state.character.name)
        .replace('PLAYER_GENDER', state.character.gender)
        .replace('PLAYER_RACE', state.character.race);
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