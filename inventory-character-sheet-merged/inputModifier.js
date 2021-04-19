const modifier = (text) => {
  state.shouldStop = false;
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();
  const commandMatcher = modifiedText.match(/\n? ?(?:> You |> You say "|)\/(.+?)["]?[.]?\n?$/i);

  if (!state.init && info.actionCount < 1) {
    grabAllBrackets(modifiedText);
    state.character = {
      name: state.placeholders[0].trim(),
      gender: state.placeholders[1].trim(),
      race: state.placeholders[2].trim(),
      class: state.placeholders[3].trim(),
      age: state.placeholders[4].trim(),
      personality: limitCharacterDetails(state.placeholders[5]),
      eyes: {
        eyeColor: state.placeholders[6].trim()
      },
      hair: {
        hairStyle: state.placeholders[7].trim(),
        hairColor: state.placeholders[8].trim(),
      },
      appearance: {
        height: state.placeholders[9].replace(DIGIT_REGEX, ''),
        weight: state.placeholders[10].replace(DIGIT_REGEX, ''),
        features: limitCharacterDetails(state.placeholders[11])
      }
    };

    playerWorldInfo = {
      keys: `${state.character.name},you`,
      hidden: false,
      entry: 'you:['
        + `NAME:${state.character.name}; `
        + `SUMM:age<${state.character.age}y>/race<${state.character.race}>/${state.character.appearance.height}cm&${state.character.appearance.weight}kg; `
        + `APPE<you>:${state.character.appearance.features}/eyes<${state.character.eyes.eyeColor}>/hair<${state.character.hair.hairStyle}&${state.character.hair.hairColor}>; `
        + `MIND:${state.character.personality}; `
        + `WORN<you>:nothing; `
        + `INV<you>:nothing.`
        + ']'
    };

    addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);

    state.init = true;
    addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);
    state.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes('you'));

    getInventory();
    addToInventory('Rusty Sword', 1);
    addToInventory('Commoner clothes', 1);
    equipItem('Commoner clothes');
    equipItem('Rusty Sword');

    modifiedText = modifiedText.replace(BRACKETS, '') + parseRace();
    delete state.placeholders;
  }

  if (commandMatcher) {
    console.log(`Command detected`);
    console.log(commandMatcher);

    stop = true;
    modifiedText = '';

    const cmd = commandMatcher[1].split(' ')[0];
    const params = commandMatcher[1].replace(cmd, '') != null ? commandMatcher[1].replace(cmd, '').trim() : '';

    if (cmd == 'invCheck') {
      console.log(`Begin inventory check.`);
      state.message = `${checkInventory()}`;
      console.log(`End inventory check.`);
    } else if (cmd == 'invAdd') {
      console.log(`Begin inventory add.`);
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(params.replace(DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        state.message = `${addToInventory(itemName, itemQuantity)}`;
      } else {
        state.message = `You cannot add less than 1 unit of an item to your inventory.`;
      }

      console.log(`End inventory add.`);
    } else if (cmd == 'invRemove') {
      console.log(`Begin inventory remove.`);
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(params.replace(DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        state.message = `${removeFromInventory(itemName, itemQuantity)}`;
      } else {
        state.message = `You cannot remove less than 1 unit of an item from your inventory.`;
      }

      console.log(`End inventory remove.`);
    } else if (cmd == 'invEquip') {
      console.log(`Begin inventory equip.`);
      const itemName = params.replace(LETTER_REGEX, '').trim();
      state.message = `${equipItem(itemName)}`;
      console.log(`End inventory equip.`);
    } else if (cmd == 'invDebugWi') {
      console.log(`Begin inventory debug.`);
      debugInventory();
      state.message = `Your inventory and player WI have been debugged.`;
      console.log(`End inventory debug.`);
    }
  }

  console.log(`END inputmod: stop AI generation: ${state.shouldStop}`);
  return { text: modifiedText, stop: stop };
}

modifier(text);