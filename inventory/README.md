# Inventory system
This is an inventory system that works by declaring a WI entry for the player using Zaltys' format along with Gnurro's placehold script. It modifies the **INV** and **WORN** categories of the player's WI whenever there's a change to the inventory. For now, you are able to add, remove and equip items from your inventory. To check what's in your inventory, you may use a command, but you can also open the Inventory menu by clicking the three point icon on top-right screen and selecting the _Inventory_ option.

## Commands included
This is a list of commands that are available in the script. Note that the commands are case sensitive, so type them as you see them here. Item name is not case sensitive, though. It will always save items in your inventory in lower case.

* `/invCheck`: checks what's inside your inventory. Also outputs what's equipped at the moment.
* `/invAdd <item-name> <number>`: if empty, `number` defaults to 1. Adds a new item to your inventory.
* `/invRemove <item-name> <number>`: if empty, `number` defaults to 1. Removes an item from your inventory.
* `/invEquip <item-name>`: equips an item if you have at least one instance of it in your inventory.
* `/invDebugWi`: reloads player WI and fixes it with the current inventory and equipped items. Use this command if you run into issues with the player WI not being found (or `undefined`).

### Usage with examples
Adding an iron sword to the inventory
```
/invAdd iron sword 1
> You add 1 iron sword to your inventory.
You have added 1 iron sword to your inventory.
```

Removing the only iron sword in the inventory
```
/invRemove iron sword 1
> You remove 1 iron sword from your inventory.
You have removed all iron sword from your inventory.
```

If there are more than 1 of the item in the inventory
```
/invRemove iron sword 1
> You remove 1 iron sword from your inventory.
You have removed 1 iron sword from your inventory.
```

Checking inventory
```
/invCheck
> You check your inventory.
Your inventory contains: wooden bow (1x), leather tights (1x). Items equipped: wooden bow, leather tights.
```

Debugging inventory
```
/invDebugWi
> Your inventory and player WI have been debugged. New player WI saved at index 52
```