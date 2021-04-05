const BRACKETED = /\[(.*?)\]/g;
const BRACKETS = /\[|\]/g;
const DIGIT_REGEX = /\D/g;

/**
 * Bracket handler by Gnurro.
 * More of Gnurro's scripts: https://github.com/Gnurro/AIDscripts
 * 
 * Removes backets from input text to handle them as placeholders
 */
function grabAllBrackets(text) {
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
function parseRace() {

  let character = state.character;
  let race = character.race.toLowerCase();
  let possibleLines = [];

  if (race == "elf") {
    possibleLines.push(...[
      '\"Another elf? Your kind is not welcome here. Skyrim belongs to the Nords!\"\n',
      '\"You may stay, but I\'m watching you, damn elf. One false movement and I\'ll have you thrown in the well!\"\n',
      '\"Oh, an elf. Don\'t worry, friend, we\'re not the racist types here in this inn. Need a room? We have warm beds and nice mead!\"\n'
    ]);
  } else if (race == 'human') {
    possibleLines.push(...[
      '\"Need a room? Talk to me or my wife Astrid, and we\'ll set you up!\"\n',
      character.gender == 'male' ? '\"Welcome, friend! How can I help a brother Nord?\"\n' : '\"Welcome, friend! How can I help a sister Nord?\"\n',
    ]);
  }

  return possibleLines[Math.floor(Math.random() * possibleLines.length)];
}

/**
 * Simple frunction to capitalize the first letter of a string
 * 
 * @param {string} string 
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Limits player details provided in prompt to only three items
 * 
 * @param {string} text 
 */
function limitCharacterDetails(text) {
  console.log(`START limitCharacterDetails(): parsing character details: ${text}`);
  return text.replace(/, /g, ',').split(',').slice(0, 3).join('/').trim();
}