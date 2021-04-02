const modifier = (text) => {
  state.shouldStop = false;
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();
  const commandMatcher = text.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i);
  const actionMatcher = text.match(/\n? ?(?:> You |> You say "|)(\w+?)( [\w ]+)?[".]?\n?$/i);

  if (info.actionCount < 1 || !state.init) {
    BracketHandler.grabAllBrackets(modifiedText);

    state.stats = {
      stats:{
        Strength:{level: 0, cost:1},
        Dexterity:{level: 0, cost:1},
        Constitution:{level: 0, cost:1},
        Intelligence:{level: 0, cost:1},
        Wisdom:{level: 0, cost:1},
        Charisma:{level: 0, cost:1},
      },
      statPoints:5}

    // state.stats = {
    //   stats: {
    //     strength: { level: 0, cost: 1 },
    //     agility: { level: 0, cost: 1 },
    //     constitution: { level: 0, cost: 1 },
    //     intelligence: { level: 0, cost: 1 },
    //     wisdom: { level: 0, cost: 1 },
    //     personality: { level: 0, cost: 1 },
    //     willpower: { level: 0, cost: 1 }
    //   },
    //   statPoints: 5
    // };

    state.skillPoints = 10;
    state.disableRandomSkill = true;
    state.XP = 0;
    state.charFeats = ['flatchest'];
    state.init = true;

    state.character = {
      name: state.placeholders[0],
      gender: state.placeholders[1],
      race: state.placeholders[2],
      class: state.placeholders[3],
      age: state.placeholders[4],
      personality: state.placeholders[5].replace(/,/g, '/ '),
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
        features: state.placeholders[11].replace(/,/g, '/ ')
      }
    };

    playerWorldInfo = {
      keys: `${state.character.name},you`,
      hidden: false,
      entry: ' You:['
        + `NAME:${state.character.name};`
        + `SUMM:age<${state.character.age}>/race<${state.character.race}>/${state.character.appearance.features}/eyes<${state.character.eyes.eyeColor}>/hair<${state.character.hair.hairStyle}&${state.character.hair.hairColor}/${state.character.appearance.height}cm&${state.character.appearance.weight}kg>;`
        + `MIND:${state.character.personality};`
        + `WORN:nothing;`
        + `INV:nothing.`
        + ']'
    };

    addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);
    state.character.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes(state.character.name));

    Inventory.getInventory();
    CharacterDataParser.parseRace(state.character);
    CharacterDataParser.parseClass(state.character);
    state.shouldStop = false;
    state.disableHardcoreMode = true;
    modifiedText = modifiedText.replace(BracketHandler.BRACKETS, '') + CharacterDataParser.generatePrompt();
    delete state.placeholders;

    state.skills = {};
    for (curSkillID of state.charClass) {
      console.log("current ID checked: " + curSkillID)
      for (skillDef in RpgMechanics.skillList()) {
        console.log("current skillDB skilldef: " + skillDef)
        if (skillDef === curSkillID) {
          console.log(RpgMechanics.skillList()[skillDef].menuString)
          state.skills[RpgMechanics.skillList()[skillDef].menuString] = 0
        }
      }
    }
  }

  if (commandMatcher) {
    console.log(`Command detected`);
    console.log(commandMatcher);

    stop = true;
    modifiedText = '';

    const cmd = commandMatcher[1];
    const params = commandMatcher[2] ? commandMatcher[2].trim() : '';
    if (cmd == 'invCheck') {
      console.log(`Begin inventory check.`);
      state.shouldStop = true;
      state.message = `${Inventory.checkInventory()}`;
      modifiedText = '';
      console.log(`End inventory check.`);
    } else if (cmd == 'invAdd') {
      console.log(`Begin inventory add.`);
      state.shouldStop = true;
      const itemName = params.replace(Inventory.LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(params.replace(Inventory.DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(Inventory.DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        state.message = `${Inventory.addToInventory(itemName, itemQuantity)}`;
      } else {
        state.message = `You cannot add less than 1 unit of an item to your inventory.`;
      }

      modifiedText = '';
      console.log(`End inventory add.`);
    } else if (cmd == 'invRemove') {
      console.log(`Begin inventory remove.`);
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(params.replace(Inventory.DIGIT_REGEX, '').trim())) ? 1 : parseInt(params.replace(Inventory.DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        state.message = `${Inventory.removeFromInventory(itemName, itemQuantity)}`;
      } else {
        state.message = `You cannot remove less than 1 unit of an item from your inventory.`;
      }

      modifiedText = '';
      console.log(`End inventory remove.`);
    } else if (cmd == 'invEquip') {
      console.log(`Begin inventory equip.`);
      state.shouldStop = true;
      const itemName = params.replace(Inventory.LETTER_REGEX, '').trim();
      state.message = `${Inventory.equipItem(itemName)}`;
      modifiedText = '';
      console.log(`End inventory equip.`);
    } else if (cmd == 'invDebugWi') {
      console.log(`Begin inventory debug.`);
      Inventory.debugInventory();
      state.shouldStop = true;
      state.message = `Your inventory and player WI have been debugged.`;
      modifiedText = '';
      console.log(`End inventory debug.`);
    } else if (cmd == 'invHardcoreMode') {
      console.log(`Begin toggle hardcore mode.`);
      if (params == 'enable') {
        state.disableHardcoreMode = false;
        state.message = `You have enabled hardcore mode. Failed inventory actions will now have consequences.`;
      } else if (params == 'disable') {
        state.disableHardcoreMode = true;
        state.message = `You have disabled hardcore mode. Failed inventory actions will no longer have consequences and will be ignored.`;
      } else {
        state.message = `Invalid parameter. Use either "enable" or "disable".`;
      }

      state.shouldStop = true;
      modifiedText = '';
      console.log(`End toggle hardcore mode.`);
    } else if (cmd == 'r') {
      delete state.init;
      state.message = "Init reset done.";
    } else if (cmd == 'showdc') {
      if (state.showDC === true) {
        state.showDC = false;
        state.message = "Turned DC display off.";
      } else {
        state.showDC = true;
        state.message = "Turned DC display on.";
      }
    } else {
      state.message = "Invalid command used. Use /tesHelp for a list of available commands.";
    }
  } else if (actionMatcher) {
    console.log(`Action detected.`);
    console.log(actionMatcher);
    state.inputAction = actionMatcher[1].trim();
    const params = actionMatcher[2] ? actionMatcher[2].trim() : '';
    if (state.inputAction == 'shoot') {
      console.log(`Action: begin shooting weapon.`);
      const shootingWeapon = Inventory.findShootingWeapon(params);
      console.log(`findShootingWeapon() return: ${shootingWeapon}`);
      if (typeof shootingWeapon != 'undefined') {
        console.log(`Action: shooting a "${shootingWeapon.name}". Looking for ammo: "${shootingWeapon.ammo}".`);
        if (Inventory.getAmmo(shootingWeapon.ammo)) {
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
    }
  }

  if (!state.showDC) {
    state.showDC = true
  }

  for (att in state.stats["stats"]) {
    if (state.stats["stats"][att]["level"] >= 4) {
      console.log(att + " over 3, setting cost to 2");
      state.stats["stats"][att]["cost"] = 2;
    }
  }

  for (let skill in state.skills) {
    let skillMod = state.skills[skill];
    for (let skillDef in RpgMechanics.skillList()) {
      if (RpgMechanics.skillList()[skillDef].menuString === skill) {
        for (triggerStr of RpgMechanics.skillList()[skillDef].triggers) {
          triggerRegEx = new RegExp(triggerStr, "gi");
          caughtTrigger = text.match(triggerRegEx);
          if (caughtTrigger) {
            console.log(`Caught ${caughtTrigger}!`);
            if (!state.chkSitBonus) {
              state.chkSitBonus = 0;
            }

            if (skillMod > state.chkSitBonus) {
              state.chkSitBonus = skillMod;
              state.chkSitSkill = skillDef;
            }
          }
        }
      }
    }
  }

  if (!stop && info.actionCount > 1) {
    state.inputBot = 'BIGinputDCattributeBot5' //'ElderScrollsInputDCAttributeBot';
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);
