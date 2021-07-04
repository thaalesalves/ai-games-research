# Inventory system
This is an inventory system that works by declaring a WI entry for the player using Zaltys' format along with Gnurro's placehold script. It modifies the **INV** and **WORN** categories of the player's WI whenever there's a change to the inventory. For now, you are able to add, remove and equip items from your inventory. To check what's in your inventory, you may use a command, but you can also open the Inventory menu by clicking the three point icon on top-right screen and selecting the _Inventory_ option.

## Commands included
This is a list of commands that are available in the script. Note that the commands are case sensitive, so type them as you see them here. Item name is not case sensitive, though. It will always save items in your inventory in lower case.

* `/invCheck`: checks what's inside your inventory. Also outputs what's equipped at the moment.
* `/invAdd <item-name> <number>`: if empty, `number` defaults to 1. Adds a new item to your inventory.
* `/invRemove <item-name> <number>`: if empty, `number` defaults to 1. Removes an item from your inventory.
* `/invEquip <item-name>`: equips an item if you have at least one instance of it in your inventory.
* `/invDebugWi`: reloads player WI and fixes it with the current inventory and equipped items. Use this command if you run into issues with the player WI not being found (or `undefined`).
* `/invHardcoreMode`: toggles hardcore mode. With hardcore mode enabled, the AI goes nuts when you try to use a weapon you don't have ammo for. With it disabled, a friendly message appears letting you know you don't have enough ammo, but the AI has no output.

### Usage with examples
Adding an iron sword to the inventory
```
/invAdd iron sword 1
You have added 1 iron sword to your inventory.
```

Removing the only iron sword in the inventory
```
/invRemove iron sword 1
You have removed all iron sword from your inventory.
```

If there are more than 1 of the item in the inventory
```
/invRemove iron sword 1
You have removed 1 iron sword from your inventory.
```

Checking inventory
```
/invCheck
Your inventory contains: wooden bow (1x), leather tights (1x). Items equipped: wooden bow, leather tights.
```

Debugging inventory
```
/invDebug
Your inventory and player WI have been debugged.
```

Command reference
```
/scenarioHelp
List of available commands: invAdd, invRemove..........
```

Specific command reference
```
/scenarioHelp
Example: /invAdd <object name> <quantity>
Adds objects to the player's inventory
```

Toggle inventory mechanics
```
/invMechanics
Example: /invMechanics enable
Toggles inventory mechanics
```

## Future ideas for this framework (still need to be studied, they won't be available for some time, if at all)
* Integration with Gnurro's RPGMech - being worked on!
* Ammunition tracking - being worked on!
* Item removal after use (for some item types, at least)
* Better item categorization (for now it's a simple array that sorts weapons, clothing, ammo and misc)
* A crafting system linked to inventory items (such as alchemy, enchating and smithing)
* Chests and homebase containers (suggested by birb)
* Other ideas? Open an issue with suggestions! o/
