let possibleLines = [
  '"Welcome to the Bloated Goat! If you need anything, talk to me or to my wife Sigrid. We have warm beds and quality mead!". Isekaid smiles.\n',
  '"Need a room? We have warm beds and nice mead!". Isekaid smiles.\n',
  `"Need a room? Talk to me or my wife Sigrid, and we'll set you up!"\n`,
];

const generatePrompt = () => {
  return possibleLines[Math.floor(Math.random() * possibleLines.length)];
}

const parseClass = (character) => {
  let charClass = character.class.toLowerCase();
  switch (charClass) {
    case 'mage':
      addToInventory('Apprentice Mage Robes', 1);
      equipItem('Apprentice Mage Robes');
      possibleLines.push(
        `"Oh, a mage? That's an impressive craft, friend. Have a mug of mead on the house!". Isekaid smiles.\n`,
        `"Oh, a mage? I'm impressed your types haven't blown up all of the world yet. No magic allowed in my inn!". Isekaid seems annoyed by the fact that you're a mage.\n"`
      );
      break;
    case 'warrior':
      addToInventory('Rusty Iron Sword', 1);
      addToInventory('Rusty Iron Armor', 1);
      equipItem('Rusty Iron Sword');
      equipItem('Rusty Iron Armor');
      possibleLines.push(
        `"You look strong, friend. Here to join the Companions? Go up to Jorrvaskr. They need folk like you.". Isekaid smiles.\n`,
        `"A fellow warrior? ${character.race.toLowerCase().includes('nord') ? `A true Nord. Here's a mug od mead. And that's on me, friend! May you be worthy of Sovngarde!`
          : `I respect warriors. Here's a mug of mead on the house!`}". Isekaid smiles.\n`
      );
      break;
    case 'ranger':
      addToInventory('Wooden Bow', 1);
      addToInventory('Leather Tights', 1);
      equipItem('Wooden Bow');
      equipItem('Leather Tights');
      possibleLines.push(
        `"Oh, you fancy the bow? Smart techniques. Bet you never run out of good meat to eat, huh?". Isekaid laughs.\n`,
        `"A hunter! Hunters and farmers alike are the ones who provide us with food. May your hunt be fruitful, friend!". Isekaid smiles.\n`
      );
      break;
    case 'peasant':
      addToInventory('White Jerkin', 1);
      addToInventory('Brown Breeches', 1);
      equipItem('White Jerkin');
      equipItem('Brown Breeches');
      break;
    case 'thief':
      addToInventory('Rusty Iron Dagger', 1);
      addToInventory('Leather Tights', 1);
      equipItem('Rusty Iron Dagger');
      equipItem('Leather Tights');
      break;
    case 'assassin':
      addToInventory('Rusty Iron Dagger', 1);
      addToInventory('Leather Tights', 1);
      equipItem('Rusty Iron Dagger');
      equipItem('Leather Tights');
      break;
  }
}

const parseRace = (character) => {
  let race = character.race.toLowerCase();
  if (race.includes("orsimer") || race.includes("orc")) {
    race = 'Orsimer/Orc';
    possibleLines.push(
      `"Oh, great. An Orc. Don't bash into my stuff, freak.". You notice disdain in his voice.\n`,
      `"An Orc? Damn brutes. If you so much break a cup, I'll have the guards kick you from the city.". You notice disdain in his voice.\n`
    );
  } else if (race.includes("altmer") || race.includes("high elf")) {
    race = 'Altmer/High Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the White River!"\n`,
      `"Good, an Altmer. Now I'm happy.". He speech seems sarcastic.\n`
    );
  } else if (race.includes("dunmer") || race.includes("dark elf")) {
    race = 'Dunmer/Dark Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the White River!"\n`,
      `"What do you want here? Is your kind trying to take over Skyrim? Now a damn Dunmer is Empress!". You notice disdain in his voice.\n`
    );
  } else if (race.includes("bosmer") || race.includes("wood elf")) {
    race = 'Bosmer/Wood Elf';
    possibleLines.push(
      '"What do you want here, elf?"\n',
      '"Another elf? Your kind is not welcome here."\n',
      `"You may stay, but I'm watching you, damn elf. One false movement and I'll have you thrown in the White River!"\n`,
      `"Are you... a Bosmer? I've never seen one in real life. You ain't gonna eat me, right?". He seems frightened.\n`,
      `"You're a Bosmer? Is it true that you eat people's flesh?". He seems frightened.\n`
    );
  } else if (race == 'nord') {
    possibleLines.push(
      `"Welcome, friend! How can I help a ${character.gender == 'male' ? 'brother' : 'sister'} Nord?"\n`,
      `"You must be cold, friend. Here, have a mug of mead on the house.". He hands you a mug of mead.\n`
    );
  } else if (race == 'breton') {
    possibleLines.push(
      `"Oh, a midget. How can I help you, friend?", Isekaid laughs.\n`,
      `"A Breton in these parts? Are you lost, friend?"\n`
    );
  } else if (race == 'imperial') {
    possibleLines.push(
      `"An Imperial in these parts? Are you lost, friend?"\n`,
      `"An Imperial? It's a long way from Cyrodiil, friend. Need a bed to rest?"\n`
    );
  } else if (race == 'khajiit') {
    possibleLines.push(
      `"Here, kitty kitty kitty.". He laughs out loud. "I'm just joking, friend. What do you need?"\n`,
      `"Oh, a cat on two legs. Don't leave fur in our stuff. We're a hygienic bunch."\n`
    );
  } else if (race == 'argonian') {
    possibleLines.push(
      `"Good day, lizard. How may I help you?"\n`,
      `"A lizard? Nasty.". He seems disgusted at you.\n`
    );
  } else if (race == 'redguard') {
    possibleLines.push(
      `"Good day, friend. Keeping well? It's a long way from Hammerfell. Enjoy your stay in Whiterun."\n`,
      `"A Redguard? You're good people. Strong and foolhardy like us Nords, not a bunrch of milk-drinkers like these damned elves."\n`
    );
  } else {
    possibleLines.push(
      `"Oh, you're a weird one, aren't you?". He laughs. "What race are you, ${character.gender == 'male' ? 'lad' : 'lass'}?"`,
      `"Oh, you're a weird one. What race are you? Doesn't matter, my family and I don't judge. What do you need, friend?". Isekaid smiles.\n`,
      `"Oh... hello...". Isekaid looks at you and raises his eyebrow. He's clearly confused because you don't look like any known race. "Do... you... need something?"\n`,
      `"Oh... you're on of those... people.". Isekaid looks at you and raises his eyebrow. He's clearly confused because you don't look like any known race. "Do you... need something?"\n`
    );
  }
}

module.exports = {
  customCharacterPrompt: (character) => {
    parseRace(character);
    parseClass(character);
    return `Your name is ${character.name}, and you are a ${character.gender} ${character.race} ${character.class}. You are ${character.age} years old, and your personality traits are: ${character.personality}. You eyes are ${character.eyes}, and your hair is of the style ${character.hair.style} and of color ${character.hair.color}. You are ${character.appearance.height} centimeters tall, and you weigh ${character.appearance.weight} kg. Your physical features are: ${character.appearance.features}.\n\n` +
      `You have just arrived in the city of Whiterun. The city is lively and filled with people of all kinds. There's the guards, walking around keeping order. There's the bards, singing lovely songs that make you want to dance and be happy. There are children running around in the streets, playing games and having fun. ` +
      `The market is bustling with people selling things, from food to weapons to cloth. There's a group of men over there fixing up a broken wagon, and there's a blacksmith over there, working away at the forge. You can already see the tall shape of the tavern in front of you, where you intend to go. The sun is setting over the city, making it look like it's on fire. The sky is turning a marvelous shade of orange, and the clouds are turning an astonishing red at their centres. It's truly beautiful.` +
      `You see the two moons, Masser and Secunda, raising high in the sky as the sun sets. They're almost full, and so very bright. The larger one, Masser, is a hazy circle, while the smaller, Secunda, is a sharp crescent. You stand and watch the sun set for a little while, the colours shifting through the spectrum until it finally sets, and darkness shrouds the city.` +
      `You stand and watch the sun set for a little while, the colours shifting through the spectrum until it finally sets, and darkness shrouds the city. The stars shine brightly above you, a million lights glittering like diamond dust on an endless black canvas.\nYou smile.\n\nA guard approaches you and stops by your side, also looking at the sky.\n"The Gods did a good job with this world, didn't they?", he asks.\nYou smile again. Looking at the stars makes you wonder what else is out there. You turn to the guard and nod at him, smiling.\nYou then continue into the Bloated Goat. The tavern is the typical sort of place you'd find in any city. A bunch of Nords drinking together, a couple of fights, and a whole lot of smoke from pipes and cigarettes. The scent of sweat and booze is thick in the air as you enter, and you're immediately greeted by the owner, a tall, bearded man with a stained apron and a rowdy attitude. His name is Isekaid.\n` +
      `He looks at you and says ${generatePrompt()}`;
  }
}