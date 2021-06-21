# Javaman's AID Scenario Explorer
This program helps you migrate from [AI Dungeon](http://aidungeon.io/) to other AI platforms with less effort. This tool will extract your stories, favorite scenarios and own scenarios from AI Dungeon so you can save them locally, create prompts from scenarios and convert them to [KoboldAI](https://github.com/KoboldAI/KoboldAI-Client) or [NovelAI](https://novelai.net/), and convert your stories from AI Dungeon to KAI or NAI so you can continue them (world info, memory and author's notes are kept from the scenario/story).

## About Javaman's AID Scenario Explorer
### What does it not do?
* This tool will not obfuscate and scramble your data on AI Dungeon. For that, [you might want to use AIDCAT](https://github.com/CuriousNekomimi/AIDCAT).
* This tool will not download other user's private data, only public scenarios you have bookmarked or your own private/public scenarios and stories.
* This tool will not saved data downloaded anywhere except in your own computer. No external APIs or addresses are accessed except for AI Dungeon's.

### What is its main use?
AI Dungeon was a popular AI game, but now we have other options. NovelAI is a platform much like AID, but it uses open-sourced models GPT-Neo and GPT-J instead of OpenAI's GPT-2 and GPT-3 like AID does. KoboldAI is an AI game that works locally, and supports all of OpenAI's models, both locally and externalized (on Google Colab, external APIs and many other). This tool is made for people that are migrating from AI Dungeon to these other two options.

### How does it work?
It works much like [AIDCAT](https://github.com/CuriousNekomimi/AIDCAT), and is also capable of using AIDCAT's output files. If you use from an AIDCAT file, it will open the file and list the scenarios/stories contained in the file, and prompt you to choose one. If you choose to download directly from AID, it will query AID's GraphQL API much like AIDCAT does, but with less parameters so the output gets only the important stuff needed for conversion. It will then save the file in a format compatible with [KoboldAI](https://github.com/KoboldAI/KoboldAI-Client) or [NovelAI](https://novelai.net/).

**NOTE:** when you choose a scenario with placeholders, the app will ask you to fill the placeholders much like on AID, so when you import the story generated from a scenario into the other games, the placeholders will be properly filled and the world info will also be there.

**NOTE 2:** part of the difference between the GraphQL this program does and the one that AIDCAT does is that this supports subscenarios as sub-options of their parent scenarios, just like things work in AI Dungeon. This will make the process more familiar to AI Dungeon players.

### Technologies used
* NodeJS
* JavaScript (obviously)
* AI Dungeon's GraphQL API

## Usage
1. Open your terminal and `cd` your way into this directory.
2. Install the dependencies by running `npm install`.
3. You have almost everything you need: but now you'll need [AIDCAT](https://github.com/CuriousNekomimi/AIDCAT) to extract your scenarios.
4. After extracting your scenarios, copy the file AIDCAT saved and paste it in `./scenarios`.
5. Now start the script with the command `npm run start`.

**NOTE:** AIDCAT extracts subscenarios as their own scenarios. When the explorer loads AIDCAT's output, it'll list the name of the available scenarios in the file you provided. Be careful not to select the wrong scenario if the one you want has sub-options.