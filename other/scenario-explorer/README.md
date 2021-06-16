# AID Scenario Explorer for KoboldAI
This script lets you use scenarios from AID after having extracted them with AIDCAT.

## Requirements
* NodeJS

## Usage
1. Open your terminal and `cd` your way into this directory.
2. Install the dependencies by running `npm install`.
3. You have almost everything you need: but now you'll need [AIDCAT](https://github.com/CuriousNekomimi/AIDCAT) to extract your scenarios.
4. After extracting your scenarios, copy the file AIDCAT saved and paste it in `./scenarios`.
5. Now start the script with the command `npm run start`.
**NOTE:** AIDCAT extracts subscenarios as their own scenarios. When the explorer loads AIDCAT's output, it'll list the name of the available scenarios in the file you provided. Be careful not to select the wrong scenario if the one you want has sub-options.