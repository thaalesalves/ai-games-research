const modifier = (text) => {
  let stop = false;
  let modifiedText = nameReplace(text);
  const lowered = modifiedText.toLowerCase();
  const commandMatcher = text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i)

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

  if (cmd.includes('invCheck')) {
    state.shouldStop = true;
    modifiedText = `\n> You check your inventory.${checkInventory()}`;
    console.log(getInventory());
  } else if (cmd.includes('invAdd')) {
    state.shouldStop = true;
    const itemName = params.replace(LETTER_REGEX, '').trim();
    const itemQuantity = Number.isNaN(parseInt(params.replace(DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(DIGIT_REGEX, '').trim());

    if (itemQuantity >= 1) {
      modifiedText = `\n> You add ${itemQuantity} ${itemName} to your inventory.${addToInventory(itemName, itemQuantity)}`;
    } else {
      modifiedText = `\n> You cannot add less than 1 unit of an item to your inventory.`;
    }

    console.log(getInventory());
  } else if (cmd.includes('invRemove')) {
    state.shouldStop = true;
    const itemName = params.replace(LETTER_REGEX, '').trim();
    const itemQuantity = parseInt(params.replace(DIGIT_REGEX, '').trim());

    if (itemQuantity >= 1) {
      modifiedText = `\n> You remove ${itemQuantity} ${itemName} from your inventory.${removeFromInventory(itemName, itemQuantity)}`;
    } else {
      modifiedText = `\n> You cannot remove less than 1 unit of an item from your inventory.`;
    }

    console.log(getInventory());
  } else if (cmd.includes('invEquip')) {
    state.shouldStop = true;
    const itemName = params.replace(LETTER_REGEX, '').trim();
    modifiedText = `\n> You equip ${itemName}.${equipItem(itemName)}`;
    console.log(getInventory());
  }
}

  return { text: modifiedText, stop: stop };
}

modifier(text);