state.config = {
  prefix: /\n? ?(?:> You |> You say "|)\/(.+?)["]?[.]?\n?$/i,
  prefixSymbol: '/',
}

state.commandList = {
  example: {
    name: "example",
    description: "Example command. Prints the arguments provided.",
    args: true,
    usage: '<arg>',
    execute: (args) => {
      state.message = `You have used the example command. Parameters provided: ${args}`;
    }
  },
  scenarioHelp: {
    name: "scenarioHelp",
    description: "Prints a list of commands",
    args: false,
    usage: `Really? You need help with the help command and expected this to work?`,
    execute: (args) => {
      console.log(`Begin help command.`);
      let availableCommands = '';
      Object.keys(state.commandList).forEach(key => {
        availableCommands += ` ${state.commandList[key].name}`
      });

      availableCommands = availableCommands.trim().replace(/\s/g, ', ');
      console.log(`Begin help command.`);
      if (args == '') {
        state.message = `List of available commands: ${availableCommands}`;
      } else if ((!(args in commandList))) {
        state.message = `This command was not found. List of available commands: ${availableCommands}`;
      } else {
        let cmd = commandList[args];
        state.message = `Example: /${cmd.name} ${cmd.usage}\n${cmd.description}`;
      }

      console.log(`End help command.`);
    }
  }
};