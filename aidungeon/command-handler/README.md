# Command handler
This is a simple command parser that detects and execute commands for your scenarios. It was developed by [Zynj](https://github.com/Zynj-git) for [EWIJSON](https://github.com/Zynj-git/AIDungeon/tree/master/AID-Script-Examples/EWIJSON), but since it's modular and follows the factory design pattern, it's a very interesting option for people to use with their scenarios.

## How to use it
You only need to change stuff inside the `state.commandList` object in `shared.js` to use this framework. Create objects following the format and inside the `execute` property, include the logic your command should perform. Example:

```javascript
state.commandList = {
  invAdd: {
    name: "invAdd",
    description: "Adds objects to the player's inventory",
    args: true,
    usage: '<object name> <quantity>',
    execute: (args) => {
      console.log(`Begin inventory add.`);
      const itemName = args.replace(LETTER_REGEX, '').trim();
      const itemQuantity = Number.isNaN(parseInt(args.replace(DIGIT_REGEX, '').trim())) ? 1 : parseInt(args.replace(DIGIT_REGEX, '').trim());

      if (itemQuantity >= 1) {
        state.message = `${addToInventory(itemName, itemQuantity)}`;
      } else {
        state.message = `You cannot add less than 1 unit of an item to your inventory.`;
      }

      console.log(`End inventory add.`);
    }
  }
};
```