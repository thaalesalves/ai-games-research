# AI Dungeon scripts
A few scripts for my scenarios to make the game more fun. Scripts are written in JS (boy oh boy, loose types give the shivers).

## Contents
* **[Tamriel: The Third Era](tamriel/):** scripts I'm using for my custom scenario. A lot of the functions defined in the topics are used here.
* **[Inventory](inventory/):** a simple inventory system for your scenarios.
* **[Character sheet](character-sheet/):** simple functions to parse and persist character data such as name, race and class. (shoutout to [Gnurro](https://github.com/Gnurro/AIDscripts) for some functions)
* **[Command handler](command-handler/):** a simple command handler for your frameworks, a mix between my matcher and Zynj's handler from EWIJSON. (shoutout to [Zynj](https://github.com/Zynj-git/AIDungeon/tree/master/AID-Script-Examples/EWIJSON))
* **[Inventory system + Character Sheet](inventory-character-sheet-merged):** Inventory and Character sheet merged into one script set
* **[AID scenario explorer for KoboldAI](koboldai-scenarios):** This is a simple NodeJS app that will interpret [CuriousNekomimi's script](https://github.com/CuriousNekomimi/AIDCAT) scenario extraction output into something readable by KAI, with all WIs, AN, prompt, actions, memory and everything. You will be able to type in placeholders and everything just like in AID, and keep a list of scenarios in an easy to use interface for later. It also supports reading your stories scenarios and bookmarked scenarios directly from AID.
* **[AID scenario explorer for KoboldAI](koboldai-docker):** This is a simple Docker image that contains KoboldAI. It is setup and configured, so you just need to run it to play. Either Docker or Podman are required to run this, so you don't need to worry about installing Pythong, dealing with its confusing dependencies and stuff.