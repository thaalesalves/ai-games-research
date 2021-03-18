const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();
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
      entry: ' You:['
        + ` NAME: ${state.character.name};`
        + ` DESC: age< ${state.character.age}>/ race< ${state.character.race}>/${state.character.appearance.features}/ eyes< ${state.character.eyes.eyeColor}>/ hair< ${state.character.hair.hairStyle}& ${state.character.hair.hairColor}/${state.character.appearance.height}cm& ${state.character.appearance.weight}kg>;`
        + ` SUMM: ${state.character.story};`
        + ` MIND: ${state.character.personality};`
        + ` WORN: nothing;`
        + ` INV: nothing;`
        + ']'
    };

    getInventory();
    addToInventory('Rusty Sword', 1);
    addToInventory('Commoner clothes', 1);
    equipItem('Commoner clothes');
    equipItem('Rusty Sword');

    state.init = true;
    state.shouldStop = false;
    addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);
    state.character.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes(state.character.name));

    state.init = true;
    modifiedText = modifiedText.replace(BRACKETS, '');
  }

  if (commandMatcher) {
    console.log(`Command detected`);
    console.log(commandMatcher);
    const cmd = commandMatcher[1];
    const params = commandMatcher[2] ? commandMatcher[2].trim() : '';
    console.log(params);

    if (cmd.includes('invCheck')) {
      console.log(`Begin inventory check.`);
      state.shouldStop = true;
      modifiedText = `\n> You check your inventory.${checkInventory()}`;
      console.log(getInventory());
      console.log(`End inventory check.`);
    } else if (cmd.includes('invAdd')) {
      console.log(`Begin inventory add.`);
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(params.replace(DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        modifiedText = `\n> You add ${itemQuantity} ${itemName} to your inventory.${addToInventory(itemName, itemQuantity)}`;
      } else {
        modifiedText = `\n> You cannot add less than 1 unit of an item to your inventory.`;
      }

      console.log(getInventory());
      console.log(`End inventory add.`);
    } else if (cmd.includes('invRemove')) {
      console.log(`Begin inventory remove.`);
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(params.replace(DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        modifiedText = `\n> You remove ${itemQuantity} ${itemName} from your inventory.${removeFromInventory(itemName, itemQuantity)}`;
      } else {
        modifiedText = `\n> You cannot remove less than 1 unit of an item from your inventory.`;
      }

      console.log(getInventory());
      console.log(`End inventory remove.`);
    } else if (cmd.includes('invEquip')) {
      console.log(`Begin inventory equip.`);
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      modifiedText = `\n> You equip ${itemName}.${equipItem(itemName)}`;
      console.log(getInventory());
      console.log(`End inventory equip.`);
    } else if (cmd.includes('invDebugWi')) {
      console.log(`Begin inventory debug.`);
      state.shouldStop = true;
      modifiedText = `\n> Your inventory and player WI have been debugged. New player WI saved at index ${state.character.worldInfoIndex}.`;
      console.log(`End inventory debug.`);
    }
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);