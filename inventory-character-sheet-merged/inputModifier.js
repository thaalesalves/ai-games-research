const { commandList } = state;
const { prefix, prefixSymbol } = state.config;
const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();
  delete state.message;

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

    state.enableInventory = true;
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

  const commandMatcher = modifiedText.match(prefix);
  if (commandMatcher) {
    console.log(`Command detected`);
    console.log(commandMatcher);

    stop = true;
    modifiedText = '';

    const commandName = commandMatcher[1].split(' ')[0];
    const args = commandMatcher[1].replace(commandName, '') != null ? commandMatcher[1].replace(commandName, '').trim() : '';
    if (!(commandName in commandList)) {
      state.message = `Invalid command! Type ${prefixSymbol}scenarioHelp for a list of commands and ${prefixSymbol}scenarioHelp <command> for instructions on a specific command.`;
      return { text: modifiedText, stop: stop };
    }

    const command = commandList[commandName];
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments!\n`;
      if (command.usage) {
        reply += `Example: ${prefixSymbol}${command.name} ${command.usage}\n`;
      }

      if (command.description) {
        reply += `${command.description}`;
      }

      state.message = reply;
      return { text: modifiedText, stop: stop };
    }

    try {
      command.execute(args);
      return { text: modifiedText, stop: stop };
    } catch (error) {
      state.message = `There was an error. Stacktrace:\n${error}`;
      console.log(`There was an error. Stacktrace:${error}`);
    }
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);