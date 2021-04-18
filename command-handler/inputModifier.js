const { commandList } = state;
const { prefix, prefixSymbol } = state.config;
const modifier = (text) => {
  let stop = false;
  let modifiedText = nameReplace(text);
  const lowered = modifiedText.toLowerCase();
  delete state.message

  if (modifiedText.match(prefix)) {
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