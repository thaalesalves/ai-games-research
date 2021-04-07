const modifier = (text) => {
  state.shouldStop = false;
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();
  const commandMatcher = modifiedText.match(/\n? ?(?:> You |> You say "|)\/(.+?)["]?[.]?\n?$/i);
  const actionMatcher = modifiedText.match(/\n? ?(?:> You |> You say ")(\w+?)( [\w ]+)?[".]?\n?$/i);

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
    state.shouldStop = false;
    state.disableHardcoreMode = true;
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
    } else if (cmd == 'invHardcoreMode') {
      console.log(`Begin toggle hardcore mode.`);
      if (params == 'enable') {
        state.disableHardcoreMode = false;
        state.message = `You have enabled hardcore mode.`;
      } else if (params == 'disable') {
        state.disableHardcoreMode = true;
        state.message = `You have disabled hardcore mode.`;
      } else {
        state.message = `Invalid command. Use /invHardcodeMode with either "enable" or "disable"`;
      }

      console.log(`End toggle hardcore mode.`);
    }
  } else if (actionMatcher) {
    console.log(`Action detected.`);
    console.log(actionMatcher);
    state.inputAction = actionMatcher[1].trim();
    const shootingAction = /((shoot|aim)(ing|))/gi;
    const genericAttackAction = /((attack|charg(e|ing)|aim)(ing|))/gi;
    const params = actionMatcher[2] ? actionMatcher[2].trim() : '';
    if (state.inputAction.match(shootingAction)) {
      console.log(`Action: begin shooting weapon.`);
      const shootingWeapon = findShootingWeapon(params);
      console.log(`findShootingWeapon() return: ${shootingWeapon}`);
      if (typeof shootingWeapon != 'undefined') {
        console.log(`Action: shooting a "${shootingWeapon.name}". Looking for ammo: "${shootingWeapon.ammo}".`);
        if (getAmmo(shootingWeapon.ammo)) {
          modifiedText += `${shootingWeapon.succesfulOutcome[Math.floor(Math.random() * shootingWeapon.succesfulOutcome.length)]}`;
        } else {
          state.shouldStop = state.disableHardcoreMode;
          if (state.shouldStop) {
            modifiedText = '';
            state.message = `You don't have any ${shootingWeapon.ammo}s for your ${shootingWeapon.name}. Try a different action.`;
          } else {
            modifiedText += `${shootingWeapon.noAmmoOutcome[Math.floor(Math.random() * shootingWeapon.noAmmoOutcome.length)]}`;
          }
        }
      } else {
        state.shouldStop = state.disableHardcoreMode;
        if (state.shouldStop) {
          modifiedText = '';
          state.message = `You don't have this weapon in your inventory. Try a different action.`;
        } else {
          modifiedText += `You try to shoot your weapon, but you can't. You just remembered don't have one of those.`;
        }
      }
      console.log('Action: end shooting weapon.');
    } else if (state.inputAction.match(genericAttackAction)) {
      console.log(`Action: general attack.`);
      const equippedWeapon = getWeaponEquipped();
      if (!equippedWeapon.name.match(SHOOTING_WEAPON_REGEX)) {

      } else {
        console.log(`Action: shooting a "${equippedWeapon.name}". Looking for ammo: "${equippedWeapon.ammo}".`);
      }
    }
  }

  console.log(`END inputmod: stop AI generation: ${state.shouldStop}`);
  return { text: modifiedText, stop: stop };
}

modifier(text);