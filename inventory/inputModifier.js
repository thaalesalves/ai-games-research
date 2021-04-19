const { commandList } = state;
const { prefix, prefixSymbol } = state.config;
const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();
  const commandMatcher = modifiedText.match(/\n? ?(?:> You |> You say "|)\/(.+?)["]?[.]?\n?$/i);

  if (!state.init && info.actionCount < 1) {
    playerWorldInfo = {
      keys: `you`,
      hidden: false,
      entry: 'you:['
        + `WORN<you>:nothing;`
        + `INV<you>:nothing.`
        + ']'
    };

    state.init = true;
    addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);
    state.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes('you'));

    getInventory();
    addToInventory('Rusty Sword', 1);
    addToInventory('Commoner clothes', 1);
    equipItem('Commoner clothes');
    equipItem('Rusty Sword');
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

  return { text: modifiedText, stop: stop };
}

modifier(text);