const modifier = (text) => {
  state.shouldStop = false;
  let stop = false;
  let stopBot = false;
  let modifiedText = nameReplace(text);
  const lowered = modifiedText.toLowerCase();
  const commandMatcher = modifiedText.match(/\n? ?(?:> You |> You say "|)\/(\w+?)( [\w ]+)?[".]?\n?$/i);
  const actionMatcher = modifiedText.match(/\n? ?(?:> You |> You say ")(\w+?)( [\w ]+)?[".]?\n?$/i);

  if (info.actionCount < 1 || !state.init) {
    RPGstate = {};
    state.RPGstate = {};
    state.RPGstate.init = false;
    state.init = true;

    grabAllBrackets(modifiedText);
    state.character = {
      name: state.placeholders[0].trim(),
      gender: state.placeholders[1].trim(),
      race: state.placeholders[2].trim(),
      class: state.placeholders[3].trim(),
      age: state.placeholders[4].trim(),
      personality: state.placeholders[5].trim().replace(/,/g, '/ '),
      stats: [],
      skills: classDB[state.placeholders[3].trim().toLowerCase()].skills,
      eyes: {
        eyeColor: state.placeholders[6].trim()
      },
      hair: {
        hairStyle: state.placeholders[7].trim(),
        hairColor: state.placeholders[8].trim(),
      },
      appearance: {
        height: state.placeholders[9].trim().replace('cm', '').replace('centimeters', ''),
        weight: state.placeholders[10].trim().replace('kg', '').replace('kilos', ''),
        features: state.placeholders[11].trim().replace(/,/g, '/ ')
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

    charSheet = {
      name: state.character.name,
      class: state.character.class,
      stats: state.character.stats,
      skills: state.character.skills
    }

    for (let bracket in introBracketConfig.brackets) {
      charSheet[introBracketConfig.brackets[bracket]] = grabBracket(bracket)
    }

    RPGmechsLog(`Read character information from intro prompt:`)
    RPGmechsLog(charSheet)

    RPGstate.charSheet = charSheet

    getInventory();
    parseRace(state.character);
    parseClass(state.character);
    state.shouldStop = false;
    state.disableHardcoreMode = true;
    modifiedText = modifiedText.replace(BRACKETS, '') + generatePrompt();
    delete state.placeholders;
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
      state.message = `${checkInventory()}`;
      modifiedText = '';
      console.log(`End inventory check.`);
    } else if (cmd == 'invAdd') {
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
    } else if (cmd == 'invRemove') {
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
    } else if (cmd == 'invEquip') {
      console.log(`Begin inventory equip.`);
      state.shouldStop = true;
      const itemName = params.replace(LETTER_REGEX, '').trim();
      state.message = `${equipItem(itemName)}`;
      modifiedText = '';
      console.log(`End inventory equip.`);
    } else if (cmd == 'invDebugWi') {
      console.log(`Begin inventory debug.`);
      debugInventory();
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
      state.RPGstate.init = false;
      state.message = "Init reset done.";
    } else if (cmd == 'showdc') {
      if (state.RPGstate.showDC === true) {
        state.RPGstate.showDC = false;
        state.message = "Turned DC display off.";
      } else {
        state.RPGstate.showDC = true;
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
    }
  }

  /*********************/
  /* RPGMech by Gnurro */
  /*********************/
  if (!state.RPGstate.init) {
    RPGmechsLog(`Initializing menus...`)
    if (!state.stats) {
      RPGmechsLog(`Initializing stats object`)
      state.stats = { stats: {} }
    }

    RPGmechsLog(`Stats object is initialized`)
    for (let statID in statConfig.statList) {
      if (!statConfig.statList[statID].ignoreForMenu == true) {
        state.stats.stats[statConfig.statList[statID].name] = { level: statConfig.starting.level, cost: statConfig.starting.cost }
        RPGmechsLog(`Added '${statID}' stat to stats menu as '${statConfig.statList[statID].name}'.`)
      } else {
        RPGmechsLog(`Ignored '${statID}' stat for stats menu adding.`)
      }
    }

    state.stats.statPoints = statConfig.starting.points
    state.skills = {}

    sheetSkillLoop:
    for (let curSkillID of charSheet.skills) {
      RPGmechsLog(`Trying to add '${curSkillID}' skill from character sheet to menu.`)
      for (let skillDef in skillDB) {
        if (skillDef === curSkillID) {
          RPGmechsLog(`Found fitting skill definition '${skillDef}' matching '${curSkillID}' in skillDB.`)
          state.skills[skillDB[skillDef].menuString] = skillConfig.starting.level
          RPGmechsLog(`Added '${skillDB[skillDef].menuString}' to skills menu.`)
          continue sheetSkillLoop
        }
      }

      RPGmechsLog(`ERROR: Couldn't find fitting skill definition for '${curSkillID}' in skillDB!`)
    }

    state.skillPoints = skillConfig.starting.points
    state.disableRandomSkill = skillConfig.forbidRandom
    state.RPGstate.XP = 0
    state.RPGstate.init = true
  }

  if (statConfig.raise) {
    for (let stat in state.stats.stats) {
      for (let curRaise of statConfig.raise) {
        if (state.stats.stats[stat].level >= curRaise.threshold) {
          state.stats.stats[stat]["cost"] = 2
        } else {
          RPGmechsLog(`Raising stat costs: Level of '${stat}' below threshold.`)
        }
      }
    }
  }

  // state.RPGstate = RPGstate

  if (statConfig?.locking) {
    for (let trigger of statConfig.locking.lockTriggers) {
      let curRegEx = new RegExp(trigger, 'gi')
      if (modifiedText.match(curRegEx)) {
        RPGmechsLog(`Found '${trigger}' locking trigger, locking inputBot!`)
        stopBot = true
      }
    }
  }

  for (let skill in state.skills) {
    let skillMod = state.skills[skill]
    for (let skillDef in skillDB) {
      if (skillDB[skillDef].menuString === skill) {
        for (let triggerStr of skillDB[skillDef].triggers) {
          let triggerRegEx = new RegExp(triggerStr, "gi")
          let caughtTrigger = text.match(triggerRegEx)
          if (caughtTrigger) {
            RPGmechsLog(`Caught '${caughtTrigger}' of '${skillDB[skillDef].menuString}'!`)
            if (!state.RPGstate.chkSkillBonus) {
              state.RPGstate.chkSkillBonus = 0
            }

            if (skillMod > state.RPGstate.chkSkillBonus) {
              state.RPGstate.chkSkillBonus = skillMod
              state.RPGstate.chkSitSkill = skillDB[skillDef]
            }
          }
        }
      }
    }
  }

  if (!stop && info.actionCount > 1 && !stopBot) {
    state.inputBot = statConfig.inputBot
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);
