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
const parseRace = (character) => {

  let race = character.race.toLowerCase();
  let returnText = ' ';
  let possibleLines = [];

  worldEntries.push({
    id: (Math.random() * (0.120 - 0.0200) + 0.0200).toString(),
    keys: `you,character,${character.name}`,
    isNotHidden: true,
    entry: character.name + ':[' 
      + character.race.toUpperCase() + `<${character.gender}/${character.appearance.height} centimeters tall/${character.appearance.weight} kilos>;`
      + `APPEARANCE<${character.name}>:${character.appearance.features}/eyes<${character.eyes.eyeColor}>/hair<${character.hair.hairStyle}&${character.hair.hairColor}/${character.appearance.height} centimeters tall/${character.appearance.weight} kilos>;`
      + `SUMM<${character.name}>:${character.story};`
      + `TRAITS<${character.name}>:${character.personality};`
      + ']'
  });

  if (race == "elf") {
    elfLines = [
      '\"Another elf? Your kind is not welcome here. Skyrim belongs to the Nords!\"\n',
      '\"You may stay, but I\'m watching you, damn elf. One false movement and I\'ll have you thrown in the well!\"\n',
      '\"Oh, an elf. Don\'t worry, friend, we\'re not the racist types here in this inn. Need a room? We have warm beds and nice mead!\"\n'
    ];

    possibleLines.push(...elfLines);
  } else if (race == 'human') {
    humanLines = [
      '\"Need a room? Talk to me or my wife Astrid, and we\'ll set you up!\"\n',
      character.gender == 'male' ? '\"Welcome, friend! How can I help a brother Nord?\"\n' : '\"Welcome, friend! How can I help a sister Nord?\"\n',
    ];

    possibleLines.push(...humanLines);
  }

  return returnText + possibleLines[Math.floor(Math.random() * possibleLines.length)];
}

/**
 * Simple frunction to capitalize the first letter of a string
 * 
 * @param {string} string 
 */
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
