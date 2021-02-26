const modifier = (text) => {
  let stop = false;
  let modifiedText = nameReplace(text);
  const lowered = modifiedText.toLowerCase();
  const commandMatcher = text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i)

  if (!state.init && info.actionCount < 1) {
    grabAllBrackets(modifiedText);
    state.character = {
      name: state.placeholders[0],
      gender: state.placeholders[1],
      race: state.placeholders[2],
      class: state.placeholders[3],
      age: state.placeholders[4],
      personality: state.placeholders[5].replace(/,/g, '/'),
      eyes: {
        eyeColor: state.placeholders[6]
      },
      hair: {
        hairStyle: state.placeholders[7],
        hairColor: state.placeholders[8],
      },
      appearance: {
        height: state.placeholders[9].replace('cm', '').replace('centimeters', ''),
        weight: state.placeholders[10].replace('kg', '').replace('kilos', ''),
        features: state.placeholders[11].replace(/,/g, '/')
      },
      story: state.placeholders[12]
    };

    playerWorldInfo = {
      keys: `${state.character.name},you`,
      hidden: false,
      entry: state.character.name + ':['
        + `RACE<${state.character.name}>:${state.character.race};`
        + `DESC<${state.character.name}>:${state.character.appearance.features}/eyes<${state.character.eyes.eyeColor}>/hair<${state.character.hair.hairStyle}&${state.character.hair.hairColor}/height<${state.character.appearance.height} centimeters>/weight<${state.character.appearance.weight} kilos>>;`
        + `SUMM<${state.character.name}>:${state.character.story};`
        + `MIND<${state.character.name}>:${state.character.personality};`
        + `WORN<${state.character.name}>:naked;`
        + ']'
    };

    addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);
    state.character.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes(state.character.name));

    getInventory();
    parseRace(state.character);
    parseClass(state.character);
    state.init = true;
    state.shouldStop = false;
    modifiedText = modifiedText.replace(BRACKETS, '') + generatePrompt();
  }

  if (commandMatcher) {
    console.log(commandMatcher);
    const cmd = commandMatcher[1];
    const params = commandMatcher[2] ? commandMatcher[2].trim() : '';
    console.log(params);

    if (cmd.includes('invCheck')) {
      state.shouldStop = true;
      modifiedText = `\n> You check your inventory${checkInventory()}`;
      console.log(getInventory());
    } else if (cmd.includes('invAdd')) {
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = parseInt(params.replace(DIGIT_REGEX, '').trim());

      modifiedText = `\n> You add an item to your inventory${addToInventory(itemName, itemQuantity)}`;
      console.log(getInventory());
    } else if (cmd.includes('invRemove')) {
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = parseInt(params.replace(DIGIT_REGEX, '').trim());

      modifiedText = `\n> You remove an item from your inventory${removeFromInventory(itemName, itemQuantity)}`;
      console.log(getInventory());
    } else if (cmd.includes('invEquip')) {
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      modifiedText = `\n> You equip an item from your inventory${equipItem(itemName)}`;
      console.log(getInventory());
    }
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);