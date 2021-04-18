const { commandList } = state;
const { prefix, prefixSymbol } = state.config;
const modifier = (text) => {
  let stop = false;
  let modifiedText = nameReplace(text);
  const lowered = modifiedText.toLowerCase();
  const commandMatcher = modifiedText.match(/\n? ?(?:> You |> You say "|)\/(.+?)["]?[.]?\n?$/i);
  const commandPrefix = text.match(prefix);
  delete state.message

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

    playerSheetWorldInfo = {
      keys: `(${state.character.name}|you)#[t=0l=2f=2S=1]`,
      hidden: true,
      entry: 'you:['
        + `NAME:${state.character.name}; `
        + `SUMM:age<${state.character.age}y>/race<${state.character.race}>/${state.character.appearance.height}cm&${state.character.appearance.weight}kg; `
        + `APPE<you>:${state.character.appearance.features}/eyes<${state.character.eyes.eyeColor}>/hair<${state.character.hair.hairStyle}&${state.character.hair.hairColor}>; `
        + `MIND:${state.character.personality}.`
        + ']'
    };

    playerInventoryWorldInfo = {
      keys: `(${state.character.name}|you)#[t=1l=2f=2S=1]`,
      hidden: true,
      entry: 'you:['
        + `WORN<you>:nothing; `
        + `INV<you>:nothing.`
        + ']'
    };

    addWorldEntry(playerInventoryWorldInfo.keys, playerInventoryWorldInfo.entry, false);
    addWorldEntry(playerSheetWorldInfo.keys, playerSheetWorldInfo.entry, false);
    state.character.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes(state.character.name));

    getInventory();
    parseRace(state.character);
    parseClass(state.character);
    state.init = true;
    state.shouldStop = false;
    modifiedText = modifiedText.replace(BRACKETS, '') + generatePrompt();
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

  // BEGIN EWIJSON
  if (info.actionCount == 0) {
    parseAsRoot(text, 'you');
  }

  console.log(commandPrefix)
  if (commandPrefix && commandPrefix[0]) {
    const args = text.slice(commandPrefix[0].length).replace(/"\n$|.\n$/, '').split(/ +/);
    const commandName = args.shift().replace(/\W*/gi, '');
    if (!(commandName in commandList)) {
      state.message = "Invalid Command!";
      return { text: '', stop: true };
    }

    const command = commandList[commandName];
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments!\n`
      if (command.usage) {
        reply += `Example: ${prefixSymbol}${command.name} ${command.usage}\n`;
      }

      if (command.description) {
        reply += `${command.description}`;
      }

      state.message = reply;
      return { text: '', stop: true };
    }


    try {
      command.execute(args);
      return { text: '', stop: true }
    } catch (error) {
      state.message = `There was an error!\n${error}`;
      console.log(`There was an error!\n${error}`);
    }
  }
  // END EWIJSON

  // BEGIN Encounters

  // Debugging action counter: (uncomment to better check global timer-only encounters)
  // state.displayStats = [{key:'Actions', value: `${info.actionCount}`}]

  // encounter trigger processing
  if (!state.currentEncounter) {
    globalLoop:
    for (encounter in encounterDB) { // go through encounters
      console.log(`Global checking '${encounter}'...`)
      if (encounterDB[encounter].inputLock) {
        console.log(`Input checking disabled on '${encounter}'.`)
        continue globalLoop
      }
      //for outputMod:
      /*
      if (encounterDB[encounter].outputLock) {
        console.log(`Output checking disabled on '${encounter}'.`)
        continue globalLoop
      }
      */
      // limiting encounter recurrence:
      if (state.limitedEncounters) {
        limitLoop:
        for (limiter of state.limitedEncounters) {
          if (limiter[0] == encounter) {
            console.log(`'${encounter}' recurrence has an active limit.`)
            if (limiter[1] > 0) {
              console.log(`'${limiter[0]}' can still happen ${limiter[1]} times.`)
              break limitLoop
            } else {
              console.log(`'${limiter[0]}' can't happen anymore.`)
              continue globalLoop
            }
          }
        }
      }
      if (typeof (state.cooldownEncounters) !== 'undefined') {
        cooldownLoop:
        for (cooldown of state.cooldownEncounters) {
          if (cooldown[0] == encounter) {
            console.log(`'${encounter}' has an active cooldown.`)
            continue globalLoop
          }
        }
      }
      if (typeof (encounterDB[encounter].globalActionDelay) == 'undefined') {
        console.log(`No global delay on '${encounterDB[encounter].encounterID}'!`)
        globalActionDelay = 0
      } else {
        globalActionDelay = encounterDB[encounter].globalActionDelay
      }
      if (info.actionCount < globalActionDelay) {
        console.log(`It's too early for '${encounterDB[encounter].encounterID}'.`)
        continue globalLoop
      }
      console.log(`Hit more then ${globalActionDelay} total actions, allowing '${encounter}'!`)
      if (encounterDB[encounter].triggers) {
        console.log(`'${encounterDB[encounter].encounterID}' has triggers!`)
        triggerLoop:
        for (triggerStr of encounterDB[encounter].triggers) {
          // console.log(triggerStr)
          triggerRegEx = new RegExp(triggerStr, "gi")
          caughtTrigger = text.match(triggerRegEx)
          if (caughtTrigger) {
            console.log(`Caught '${caughtTrigger}', checking '${encounter}' chance...`)
            if (!encounterDB[encounter].chance) {
              console.log(`No chance on triggered '${encounterDB[encounter].encounterID}' detected, this is probably an error!`)
            } else {
              console.log(`${encounterDB[encounter].chance}% chance detected!`)
              if (getRndInteger(1, 100) <= encounterDB[encounter].chance) {
                console.log(`Rolled below ${encounterDB[encounter].chance} chance, running '${encounter}'!`)
                updateCurrentEncounter(encounter)
                break globalLoop
              } else {
                console.log(`Rolled above ${encounterDB[encounter].chance} chance, so no '${encounter}'!`)
              }
            }
          }
        }
        console.log(`None of the triggers of '${encounterDB[encounter].encounterID}' detected in (text), moving on.`)
      } else {
        console.log(`No triggers for '${encounter}' found, check chance...`)
        if (encounterDB[encounter].chance) {
          console.log(`${encounterDB[encounter].chance}% chance for '${encounter}' detected!`)
          if (getRndInteger(1, 100) <= encounterDB[encounter].chance) {
            console.log(`Rolled below ${encounterDB[encounter].chance} chance, running '${encounter}'!`)
            updateCurrentEncounter(encounter)
            break globalLoop
          } else {
            console.log(`Rolled above ${encounterDB[encounter].chance} chance, so no '${encounter}'!`)
          }
        } else {
          console.log(`No chance on '${encounterDB[encounter].encounterID}' detected, so it's probably a chain-only encounter!`)
          continue globalLoop
        }
      }
    }
  }

  // current encounter processing:
  if (state.currentEncounter) {
    if (state.currentEncounter.activationDelay) {
      console.log(`Delaying by ${state.currentEncounter.activationDelay} actions before running '${state.currentEncounter.encounterID}'!`)
      state.currentEncounter.activationDelay -= 1
    } else {
      console.log(`No delay, running '${state.currentEncounter.encounterID}'!`)
      // activating encounters:
      updateCurrentEffects()
      if (!state.currentEncounter.memoryAdded && state.currentEncounter.memoryAdd) {
        if (!state.encounterMemories) {
          state.encounterMemories = []
        }
        state.encounterMemories.push(state.currentEncounter.memoryAdd)
        state.currentEncounter.memoryAdded = true
      }

      if (!state.currentEncounter.textInserted && state.currentEncounter.textNotes) {
        curTextNote = getRndFromList(state.currentEncounter.textNotes)
        // random wordlist inserts:
        if (typeof (curTextNote) !== 'undefined') {
          curTextNote = fillPlaceholders(curTextNote)
          // for outputs:
          // modifiedText += ` ${curTextNote}`
          modifiedText += `\n${curTextNote}`
          state.currentEncounter.textInserted = true
        }
      }

      if (!state.currentEncounter.WIadded && state.currentEncounter.addWI) {
        for (WIentry in state.currentEncounter.addWI) {
          console.log(`Adding '${state.currentEncounter.addWI[WIentry].keys}' WI entry.`)
          addWorldEntry(state.currentEncounter.addWI[WIentry].keys, state.currentEncounter.addWI[WIentry].entry, state.currentEncounter.addWI[WIentry].hidden)
        }
        state.currentEncounter.WIadded = true
      }

      // branching encounters:
      // for outputMod:
      // if (state.currentEncounter.branches && !state.currentEncounter.outputLock) {
      if (state.currentEncounter.branches && !state.currentEncounter.inputLock) {
        branchLoop:
        for (chkBranch of state.currentEncounter.branches) {
          console.log(`Checking '${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}'...`)

          if (!chkBranch.branchChance) {
            console.log(`'${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}' has no chance, this is most likely an error!`)
            continue branchLoop
          }

          if (chkBranch.branchTriggers) {
            console.log(`'${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}' has triggers!`)
            branchTriggerLoop:
            for (triggerStr of chkBranch.branchTriggers) {
              triggerRegEx = new RegExp(triggerStr, "gi")
              caughtTrigger = text.match(triggerRegEx)
              if (caughtTrigger) {
                console.log(`Caught trigger '${caughtTrigger}' for '${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}', checking chance...`)
                if (getRndInteger(1, 100) <= chkBranch.branchChance) {
                  console.log(`Rolled below ${chkBranch.branchChance} chance for '${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}', branching!`)

                  if (chkBranch.branchTextNotes) {
                    curTextNote = getRndFromList(chkBranch.branchTextNotes)
                    // random wordlist inserts:
                    if (typeof (curTextNote) !== 'undefined') {
                      curTextNote = fillPlaceholders(curTextNote)
                      // for outputs:
                      // modifiedText += ` ${curTextNote}`
                      modifiedText += `\n${curTextNote}`
                      // state.currentEncounter.textInserted = true
                    }
                  }

                  if (chkBranch.branchChained) {
                    updateCurrentEncounter(getRndFromList(chkBranch.branchChained))
                    break branchLoop
                  } else {
                    console.log(`'${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}' has no chained encounter, but this might be intentional.`)
                  }
                }
              }
            }
          } else {
            console.log(`'${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}' has no triggers, using pure chance!`)
            if (getRndInteger(1, 100) <= chkBranch.branchChance) {
              console.log(`Rolled below ${chkBranch.branchChance} chance for '${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}', branching!`)
              if (chkBranch.branchTextNotes) {
                modifiedText += ` ${getRndFromList(chkBranch.branchTextNotes)}`
              }
              if (chkBranch.branchChained) {
                updateCurrentEncounter(getRndFromList(chkBranch.branchChained))
                break branchLoop
              } else {
                console.log(`'${state.currentEncounter.encounterID}' branch '${chkBranch.branchID}' has no chained encounter, but this might be intentional.`)
              }
            }
          }
        }
      }

      // ending encounters:
      if (typeof (state.currentEncounter) == 'undefined') {
        console.log(`state.currentEncounter doesn't exist! This can happen due to branching.`)
      } else {
        if (state.currentEncounter.endTriggers) {
          console.log(`${state.currentEncounter.encounterID} has end triggers!`)
          for (triggerStr of state.currentEncounter.endTriggers) {
            triggerRegEx = new RegExp(triggerStr, "gi")
            caughtTrigger = text.match(triggerRegEx)
            if (caughtTrigger) {
              console.log(`Caught ${caughtTrigger}, ending '${state.currentEncounter.encounterID}'!`)
              if (state.currentEncounter.chained) {
                console.log(`Detected chained encounter(s) on ${state.currentEncounter.encounterID}!`)
                delete state.message
                delete state.encounterNote
                updateCurrentEncounter(getRndFromList(state.currentEncounter.chained))
              } else {
                updateCurrentEncounter()
                updateCurrentEffects()
              }
            }
          }
        }

        if (typeof (state.currentEncounter) !== 'undefined') {
          if (typeof (state.currentEncounter.duration) !== 'undefined') {
            if (state.currentEncounter.duration > 0) {
              console.log(`Keeping up ${state.currentEncounter.encounterID} for ${state.currentEncounter.duration} more actions!`)
              state.currentEncounter.duration -= 1
            } else {
              console.log(`Duration of ${state.currentEncounter.encounterID} over!`)
              if (state.currentEncounter.chained) {
                console.log(`Detected chained encounter(s) on ${state.currentEncounter.encounterID}!`)
                delete state.message
                delete state.encounterNote
                updateCurrentEncounter(getRndFromList(state.currentEncounter.chained))
              } else {
                updateCurrentEncounter()
                updateCurrentEffects()
              }
            }
          } else {
            console.log(`No duration on ${state.currentEncounter.encounterID}, keeping it up infinitely!`)
          }
        }
      }
    }
  }


  // encounter memory stuff:
  if (state.encounterMemories) {
    for (encounterMemory of state.encounterMemories) {
      if (encounterMemory.memoryLingerDuration >= 1) {
        console.log(`'${encounterMemory.memoryText}' will stay in memory for ${encounterMemory.memoryLingerDuration} more actions.`)
        encounterMemory.memoryLingerDuration -= 1
      } else {
        console.log(`'${encounterMemory.memoryText}' will no longer stay in memory.`)
        state.encounterMemories.splice(state.encounterMemories.indexOf(encounterMemory), 1)
      }
    }
  }

  if (state.cooldownEncounters) {
    console.log(`Cooldowns detected!`)
    cooldownLoop:
    for (cooldown in state.cooldownEncounters) {
      if (state.cooldownEncounters[cooldown] == null) { // safety/legacy...
        state.cooldownEncounters.splice(cooldown, 1)
        continue cooldownLoop
      }
      console.log(`'${state.cooldownEncounters[cooldown][0]}' (${cooldown}) cooldown: ${state.cooldownEncounters[cooldown][1]}.`)
      state.cooldownEncounters[cooldown][1] -= 1
      if (state.cooldownEncounters[cooldown][1] <= 0) {
        console.log(`${state.cooldownEncounters[cooldown][0]} cooldown over, removing.`)
        state.cooldownEncounters.splice(cooldown, 1)
      }
    }
    if (state.cooldownEncounters[0] == null) {
      console.log(`No more cooldowns, removing array.`)
      delete state.cooldownEncounters
    }
  }
  // END Encounters

  return { text: modifiedText, stop: stop };
}

modifier(text);