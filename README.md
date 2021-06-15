# AI Dungeon scripts
A few scripts for my scenarios to make the game more fun. Scripts are written in JS (boy oh boy, loose types give the shivers).

## Contents
* **[Tamriel: The Third Era](tamriel/):** scripts I'm using for my custom scenario. A lot of the functions defined in the topics are used here.
* **[Inventory](inventory/):** a simple inventory system for your scenarios.
* **[Character sheet](character-sheet/):** simple functions to parse and persist character data such as name, race and class. (shoutout to [Gnurro](https://github.com/Gnurro/AIDscripts) for some functions)
* **[Command handler](command-handler/):** a simple command handler for your frameworks, a mix between my matcher and Zynj's handler from EWIJSON. (shoutout to [Zynj](https://github.com/Zynj-git/AIDungeon/tree/master/AID-Script-Examples/EWIJSON))
* **[Inventory system + Character Sheet](inventory-character-sheet-merged):** Inventory and Character sheet merged into one script set
* **[Tamriel KoboldAI scenario](other/tamriel-scenario):** Tamriel scenario for KoboldAI. Works exactly like it does on AID, except it doesn't have scripts (KoboldAI doesn't allow scripts yet).
* **[AID adventure converter for KoboldAI](other/convert_story_for_koboldai.js):** This is a simple NodeJS script that will convert [CuriousNekomimi's script](https://github.com/CuriousNekomimi/AIDCAT) output into something readable by KAI, with all WIs, AN, prompt, actions, memory and everything.