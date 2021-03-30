const modifier = (text) => {
  state.shouldStop = false;
  let stop = false;
  let modifiedText = text;
  let disableHardcoreMode = true;
  const lowered = text.toLowerCase();
  const commandMatcher = text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i);
  const actionMatcher = text.match(/\n? ?(?:> You |> You say "|)(\w+?)( [\w ]+)?[".]?\n?$/i);

  if (!state.init && info.actionCount < 1) {
    playerWorldInfo = {
      keys: `you`,
      hidden: false,
      entry: ' You:['
        + ` WORN: nothing;`
        + ` INV: nothing;`
        + ']'
    };

    state.init = true;
    state.shouldStop = false;
    addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);
    state.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes('you'));

    getInventory();
    addToInventory('Rusty Sword', 1);
    addToInventory('Commoner clothes', 1);
    equipItem('Commoner clothes');
    equipItem('Rusty Sword');

    state.init = true;
  }

  if (commandMatcher) {
    console.log(`Command detected`);
    console.log(commandMatcher);

    const cmd = commandMatcher[1];
    const params = commandMatcher[2] ? commandMatcher[2].trim() : '';

    if (cmd.includes('invCheck')) {
      console.log(`Begin inventory check.`);
      state.shouldStop = true;
      state.message = `${checkInventory()}`;
      modifiedText = '';
      console.log(`End inventory check.`);
    } else if (cmd.includes('invAdd')) {
      console.log(`Begin inventory add.`);
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(params.replace(DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        state.message = `${addToInventory(itemName, itemQuantity)}`;
      } else {
        state.message = `You cannot add less than 1 unit of an item to your inventory.`;
      }

      modifiedText = '';
      console.log(`End inventory add.`);
    } else if (cmd.includes('invRemove')) {
      console.log(`Begin inventory remove.`);
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(params.replace(DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        state.message = `${removeFromInventory(itemName, itemQuantity)}`;
      } else {
        state.message = `You cannot remove less than 1 unit of an item from your inventory.`;
      }

      modifiedText = '';
      console.log(`End inventory remove.`);
    } else if (cmd.includes('invEquip')) {
      console.log(`Begin inventory equip.`);
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      state.message = `${equipItem(itemName)}`;
      modifiedText = '';
      console.log(`End inventory equip.`);
    } else if (cmd.includes('invDebugWi')) {
      console.log(`Begin inventory debug.`);
      state.shouldStop = true;
      state.message = `Your inventory and player WI have been debugged.`;
      modifiedText = '';
      console.log(`End inventory debug.`);
    }
  } else if (actionMatcher) {
    console.log(`Action detected.`);
    console.log(actionMatcher);
    state.inputAction = actionMatcher[1].trim();
    const params = actionMatcher[2] ? actionMatcher[2].trim() : '';
    if (state.inputAction == 'shoot') {
      console.log(`Action: begin shooting weapon.`);
      const shootingWeapon = findShootingWeapon(params);
      console.log(`findShootingWeapon() return: ${shootingWeapon}`);
      if (typeof shootingWeapon != 'undefined') {
        console.log(`Action: shooting a "${shootingWeapon.name}". Looking for ammo: "${shootingWeapon.ammo}".`);
        if (getAmmo(shootingWeapon.ammo)) {
          modifiedText += `${shootingWeapon.text[Math.floor(Math.random() * shootingWeapon.text.length)]}`;
        } else {
          state.shouldStop = disableHardcoreMode;
          if (state.shouldStop) {
            modifiedText = '';
            state.message = `You don't have any ${shootingWeapon.ammo}s for your ${shootingWeapon.name}. Try a different action.`;
          } else {
            modifiedText += `You don't have any ${shootingWeapon.ammo}s for your ${shootingWeapon.name}.`;
          }
        }
      } else {
        state.shouldStop = disableHardcoreMode;
        if (state.shouldStop) {
          modifiedText = '';
          state.message = `You don't have this weapon in your inventory. Try a different action.`;
        } else {
          modifiedText += `You try to shoot your weapon, but you can't. You just remembered don't have one of those.`;
        }
      }
      console.log('Action: end shooting weapon.');
    }
  }

  console.log(`END inputmod: stop AI generation: ${state.shouldStop}`);
  return { text: modifiedText, stop: stop };
}

modifier(text);