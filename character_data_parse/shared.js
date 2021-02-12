const BRACKETED = /\[(.*?)\]/g;
const BRACKETS = /\[|\]/g;

/**
 * Bracker handler by Gnurro.
 * More of Gnurro's scripts: https://github.com/Gnurro/AIDscripts
 * 
 * Removes backets from input text to handle them as placeholders
 */
const grabAllBrackets = (text) => {
  for (entry of text.match(BRACKETED)) {
    entry = entry.replace(BRACKETS, '');
    if (!state.placeholders) {
      state.placeholders = new Array();
    }

    state.placeholders.push(entry);
  }

  console.log(state.placeholders);
}

/**
 * Function that parses the character's race when they're created. This determines Dagur's behavior towards the player.
 * 
 * @param {string} race
 * @param {string} gender
 */
const parseRace = (race, gender) => {
  race = race.toLowerCase();
  let modifiedText = ' ';
  let possibleLines = [
    '\"Let me guess... you\'re only here because you want to the join the College? That\'s all folks come here for. This city is no longer what it was.\"\n',
    '\"Welcome to the Fronzen Hearth! If you need anything, talk to me or to my wife Haran. We have warm beds and quality mead!\". He smiles.\n',
  ];

  state.memory.context = "The continent is called Tamriel. The capital of the Empire is the Imperial City in the province of Cyrodiil. "
      + "The capital of the Aldmeri Dominion is Alinor, in the province of Alinor. The province of Alinor is also known as the Summerset Isles. There are 10 sentient races in Tamriel. "
      + "The Nords, the Imperials, the Bretons, the Redguards, the Bosmer, the Dunmer, the Altmer, the Orsimer, the Argonians and the Khajiit. "
      + "The Bosmer, the Altmer and the Khajiit are allies, these three races form the Aldmeri Dominion. The Imperials and the Bretons are allied, and they form the Empire. "
      + "The Nords are divided, half of the country supports the Empire, and the other half wants independence. The Argonians and the Dunmer fight each other. "
      + "The Dunmer have enslaved the Argonians for millenia, and now the Argonians are warring against them and taking their territory. "
      + "Haran is a female Nord. Eirid is a child. A young female Nord. Dagur is an old male Nord. "
      + "The Arcanaeum is the College's library. The Arcanaeum is the largest library in Skyrim. Urag gro-Shub is an old male Orc, and he oversees the Arcanaeum. "
      + "Mirabelle Ervine is the Master Wizard at the College of Winterhold. Mirabelle Ervine is an old female Breton. "
      + "Savos Aren is the Arch-Mage at the College of Winterhold. He's an old male Dunmer. Dunmer are also called Dark Elves."
      + "Faralda is an old female Altmer. She guards the gate of the College of Winterhold. She only lets those worthy pass and join the College.";

  if (race.includes("altmer") || race.includes("high elf")) {
    state.memory.context += "The player is a High Elf. High Elves are also called Altmer. Humans, especially Nords, hate elves. "
      + "Most Nords hate Elves. Most Nords will be rude towards the player because they're an elf. Most humans will be rude towards the player because they're an elf. "
      + "Some humans will even want to fight with the player because they're an elf. Even if the player isn't related to the Aldmeri Dominion, some humans will think they are. "
      + "They will curse the player and call the player names.";

    altmerLines = [
      '\"What do you want here, elf? Here to enslave us simple Nord folks and make us kneel to your Dominion?\"\n',
      '\"Another elf? Your kind is not welcome here. Skyrim belongs to the Nords!\"\n',
      '\"Haran, hide Eirid. There\'s an elf coming in.\"\n',
      '\"You may stay, but I\'m watching you, damn elf. One false movement and I\'ll have you thrown in the Sea of Ghosts!\"\n',
      '\"Oh, a High Elf. Don\'t worry, friend, we\'re not the racist types here in this inn. Need a room? We have warm beds and nice mead!\"\n'
    ];

    possibleLines.push(...altmerLines);
  } else if (race.includes("dunmer") || race.includes("dark elf")) {
    state.memory.context += "The player is a Dark Elf. Dark Elves are also called Dunmer. Humans, especially Nords, hate elves. "
      + "Most Nords hate Elves. Most Nords will be rude towards the player because they're an elf. Most humans will be rude towards the player because they're an elf. "
      + "Some humans will even want to fight with the player because they're an elf. If the player is a Dark Elf, Nords will tell the player to go back to Morrowind. "
      + "They use slurs against Dark Elves. Nords call Dark Greys greyskins. ";

    dunmerLines = [
      '\"What do you want here, elf? Go back to where you can from, greyskin.\"\n',
      '\"Haran, hide Eirid. There\'s an elf coming in.\"\n',
      '\"You may stay, but I\'m watching you, damn elf. One false movement and I\'ll have you thrown in the Sea of Ghosts!\"\n',
      '\"Oh, a Dark Elf. Don\'t worry, friend, we\'re not the racist types here in this inn. Need a room? We have warm beds and nice mead!\"\n',
      '\"What do you want here? Is your kind trying to take over Skyrim? Go back to Morrowind, filthy elf!\"'
    ];

    possibleLines.push(...dunmerLines);
  } else if (race == 'nord') {
    state.memory.context += "The player is a Nord. Nords are gentle and corteous to other Nords. They're friendly to each other. Nords are corageous and strong. They're fearless. "
      + "Nords will call cowards milk-drinkers. Nords do not like cowards people. Nords go to Sovngarde after they die. Sovngarde is a place of honor for Nords. ";

    nordLines = [
      '\"Need a room? Talk to me or my wife Haran, and we\'ll set you up!\"\n',
      gender == 'male' ? '\"Welcome, friend! How can I help a brother Nord?\"\n' : '\"Welcome, friend! How can I help a sister Nord?\"\n',
    ];

    possibleLines.push(...nordLines);
  } else {
    let otherLines = [
      '\"Oh, you\'re a weird one. What race are you? Doesn\'t matter, my family and I don\'t judge. What do you need, friend?\"\n',
      '\"Oh... helo...\". Dagur looks at you and raises his eyebrow. He\'s clearly confused because you don\'t look like any known race. \"Do... you need something?\", he says.\n'
    ];

    possibleLines.push(...otherLines);
  }

  return modifiedText + possibleLines[Math.floor(Math.random() * possibleLines.length)];
}

/**
 * Simple frunction to capitalize the first letter of a string
 * 
 * @param {string} string 
 */
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
