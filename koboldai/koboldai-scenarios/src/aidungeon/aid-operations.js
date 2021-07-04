const fs = require(`fs`);
const rl = require('readline-sync');
const scenarios = require('./graphql/aid-scenarios.js');
const stories = require('./graphql/aid-stories.js');

const configFile = "./aid-credentials.txt";
let option;
let username;
let userToken;
let credentials;
let message;
let menuOptions = [
  {
    text: `Exit`,
    execute: () => {
      process.exit(0);
    }
  },
  {
    text: `Convert story from AI Dungeon`,
    execute: (username, userToken) => {
      stories.execute(username, userToken);
    }
  },
  {
    text: `Convert scenario from AI Dungeon (from your own scenarios)`,
    execute: (username, userToken) => {
      scenarios.execute(username, userToken, false);
    }
  },
  {
    text: `Convert scenario from AI Dungeon (from your favorite scenarios)`,
    execute: (username, userToken) => {
      scenarios.execute(username, userToken, true);
    }
  }
];

const printMenu = () => {
  console.clear();
  console.log(message ? `Message: ${message}` : '');
  console.log(`========================= SELECT AN OPERATION =========================`);
  menuOptions.forEach((menuOption, i) => console.log(`${i}. ${menuOption.text}`));
  console.log(`=======================================================================`);
  return rl.question(`Choose an option: `);
}

const execute = () => {
  try {
    credentials = fs.readFileSync(configFile, 'utf8');
  } catch (e) {
    username = rl.question("Type your AI Dungeon username: ");
    userToken = rl.question("Paste your user token: ", { hideEchoBack: true });
    fs.writeFileSync(configFile, `${username}\n${userToken}`);
  }

  username = credentials.split("\n")[0];
  userToken = credentials.split("\n")[1];

  while (!option) {
    option = printMenu();
    if (!option) {
      message = "Please choose an option.";
      execute();
    } else if (option != "0") {
      menuOptions[option].execute(username, userToken);
      return;
    }

    menu.showMenu("Back from scenario file selection.");
  }
}

module.exports.execute = execute;