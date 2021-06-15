const DIGIT_REGEX = /\D/g;
const limitCharacterDetails = (text) => {
  return text.replace(/, /g, ',').split(',').slice(0, 3).join('/').trim();
}

const RANDOM_CHARACTERS = [
  {
    name: `Rolff Stone-Fist`,
    gender: `male`,
    race: `Nord`,
    age: '17',
    personality: 'strong, tough, intimidating',
    class: 'peasant',
    eyes: {
      eyeColor: 'light brown'
    },
    hair: {
      hairStyle: 'short and messy',
      hairColor: 'light blond'
    },
    appearance: {
      height: '187',
      weight: '90',
      features: 'muscular, long square jaw, short beard'
    },
    prompt: `You and your cousin Bruno are miners currently working hard to get as much iron as possible. The Empire's demands are high, as always, and you need to work constantly.\nThe mine is currently on a break, with all workers gathered around a tunnel deep in the mine. There's some commotion near the tunnel, and you see an older worker running from a group of soldiers dressed in armor that you don't recognize. He's pleading for them to stop as they are trying to catch him and knocking him down.\nYour boss walks up to the group of soldiers and starts talking to one of them. After a few moments, your boss waves you and Bruno over.\nYou approach your boss, and the soldier he's talking to walks towards you both. He has a shiny insignia on his armor, with an image of scales and the word "Justice".\n"You are?" He asks.\n"I'm the foreman of this mine, and these are the mine's miners." Your boss answers for you both.\nThe soldier looks around, sizing up everyone. He looks intimidating, dressed in full steel armor with a helmet and faceplate, only revealing his eyes. His armor is covered in blood, and a spear and a large knife are attached to his back. His eyes flicker over everyone, everyone but you seem to be intimidated. You see a young girl in the crowd, still only a teenager, staring at the soldier with undisguised admiration.\n"Where are you from?" Your boss asks him.`,
    inventory: () => {
      addToInventory(`loose green breeches and white shirt`, 1);
      addToInventory('pickaxe', 1);
      equipItem(`loose green breeches and white shirt`);
      equipItem('pickaxe');
    }
  },
  {
    name: `Pasha Antine`,
    gender: `female`,
    race: `Dunmer`,
    age: `25`,
    personality: `very intimidating`,
    class: `peasant`,
    eyes: {
      eyeColor: `dark brown`
    },
    hair: {
      hairStyle: `long hair`,
      hairColor: `black`
    },
    appearance: {
      height: `182`,
      weight: `75`,
      features: `beautiful, tall, striking`
    },
    prompt: `You are at your home. You've worked the mine your entire life, just like your parents. But you want more. You want to see the world, to set sail and go abroad. You want adventure. Your father does not approve of your dream, and you get in an argument with him.\n"Pasha, you need to think about life. You can't go around traveling, this is no life for someone like you. Where will you get money to stay alive?", your father asks. He seems angry with your ideals.\n"I can get a job as a mercenary, or perhaps I can travel to the city of Whiterun. There are many jobs there!", you reply.\n"You want to be a mercenary? That's even worse than being a miner! Mercenaries go to fight in wars! You'll die quick!" Your father seems more angry at the idea of you dying, rather than the idea of you being a mercenary.\n"Then I will take the risk! I have to, it's my freedom! I want a life of adventure, not to be stuck in this house for the rest of my days doing this job that you hate!"\nYour father looks at you, and notices that you've made up your mind.\n"You really want this huh? I'll help you get started. Here." He gives you thirty gold coins.`,
    worn: `loose green breeches and white shirt`,
    weapon: 'pickaxe',
    inventory: () => {
      addToInventory(`gold coins`, 30);
      addToInventory(`loose green breeches and white shirt`, 1);
      addToInventory('pickaxe', 1);
      equipItem(`loose green breeches and white shirt`);
      equipItem('pickaxe');
    }
  },
  {
    name: `Sirilias`,
    gender: `male`,
    race: `Imperial`,
    age: `32`,
    personality: `brave, kind, loyal`,
    class: `sailor`,
    eyes: {
      eyeColor: `blue`
    },
    hair: {
      hairStyle: `curly`,
      hairColor: `brown`
    },
    appearance: {
      height: `185`,
      weight: `79`,
      features: `muscular, strong jaw, prominent chin`
    },
    prompt: `Your Imperial Guard patrol was set out to protect the border between Cyrodiil and Skyrim. You had problems with bandits around, but your fellow soldiers managed to kill the bandits off. You watch out for any remaining bandits or for any potential refugees in need of help. You get captured by bandits, and they imprisoned you with intent to ransom, but you managed to escape. You're hiding in the forests in the middle of the night, waiting for the other guards to find you. You have nothing but rags and a shiv to defend yourself, while walking through the forest. You're lost.\nYou decide to walk West through the woods, and you find a clearing with a single house inside. You don't know who lives here, but they're the closest to help you can think of. You walk to the door and knock.\nNo answer. You are about to knock again but you decide against it, remembering the people in this forest are rumored to be unfriendly. You try to peek through the windows, but the shades are drawn. You decide to leave the house, and keep walking through the woods.\nIt's 3 minutes later when you return, this time with a brick in your hands. You smash the window closest to the door and unlock it with the same brick, then open the door and go inside.\n"Ah! What are you doing here?" an old man says.\n"I've escaped from bandits that were intent on ransoming me to my family," You say.\n"You shouldn't have done that. Now they'll kill you for escaping."\n"Please help me!" You beg.\n`,
    inventory: () => {
      addToInventory(`rags`, 1);
      addToInventory('shiv', 1);
      equipItem(`rags`);
      equipItem('shiv');
    }
  },
  {
    name: `Torel Forgewood`,
    gender: `male`,
    race: `Nord`,
    age: `26`,
    personality: `self-centered,arrogant,dishonorable`,
    class: `warrior`,
    eyes: {
      eyeColor: `steely blue`
    },
    hair: {
      hairStyle: `long and straight`,
      hairColor: `dark blonde`
    },
    appearance: {
      height: `180`,
      weight: `90`,
      features: `strong chin and jawline,strong and muscular,tanned skin`
    },
    prompt: `Your work for the Apocryphal Glory Mercenary Company, currently their camp at the outskirts of the Falkreath forest. The captain of the company just came back from scouting ahead, and he seems very excited about something. "We're going to leave this camp soon and march through that forest. We have been hired by a group of travellers to protect them on their travel to the city of Riften." You just nod and prepare your gear, it's not your place to question the captain's orders. The captain looks at you and says "We'll be marching through the night, so get some rest while you still can." He then leaves the tent. You look at your comrade and see him nodding off already, you decide to do the same.\nYou wake up to a shout from your captain, you jump out of your bedroll and run out of the tent. You notice that it's still night, the stars shining bright above your head.\nIt's a beautiful night, actually. The sky is clear, the stars are shining bright. The moons are mostly full, but slightly obscured by some clouds. A light wind blows from the north. The surface of the road is still dusty from the caravan's passing earlier. Everything is still and quiet, as if waiting for something to break the silence.\nYou look at the direction that the captain is pointing at. You see a large group of figures leaving the forest. They don't look friendly... You see your captain pointing towards the forest, you look in that direction and see a large group of figures leaving the forest. Your captain shouts "To arms! We're being attacked!"`,
    inventory: () => {
      addToInventory(`steel longsword`, 1);
      addToInventory('full steel armor with a fur scarf', 1);
      equipItem(`full steel armor with a fur scarf`);
      equipItem('steel longsword');
    }
  },
  {
    name: `Tulla Jenssen`,
    gender: `female`,
    race: `Nord`,
    age: `23`,
    personality: `brave,courageous,foolhardy`,
    class: `warrior`,
    eyes: {
      eyeColor: `blue`
    },
    hair: {
      hairStyle: `long`,
      hairColor: `blonde`
    },
    appearance: {
      height: `180`,
      weight: `75`,
      features: `tall,muscular,strong`
    },
    prompt: `You're in your home town of Riverwood. It is a peaceful town, and the people are hard-working and humble. During the Saturalia celebrations, you went into a secluded area to meet your lover, the local blacksmith. Your father spots you two sitting by the river, and approaches you. He does not like your lover, and start yelling at you two.\n"Stay away from my daughter, blacksmith!", your father yells at your lover. Your lover's face is sad and afraid. He nods, and runs away from the scene. Your father takes you by the hand, and drags you over to your mother.\n"Look, our daughter has been with the blacksmith!", he yells at her.\n"I told you to stay away from him, Tulla!", your mother yells at you while your father agrees with her.\nYou stare at the ground in sadness.\nYou start to get angry at them trying to tell you what to do. You're a 23 years old woman, your parents can't boss you around anymore. You and your parents start to argue.\n"I love him! And he loves me! And there's nothing you can do about it! I don't give a fuck if you don't like him, you can't tell me what to do!", you yell at them.\nYour father looks at you angrily.\n"Don't you dare using that tone with me, young lady!", he says to you.\n"I'm not a fucking young lady, I'm your fucking daughter, and you can't tell me what to do!", you shout at him.\nYour mother stands next to your father, and looks at you disappointingly.\n"Look at you, all grown up and still throwing tantrums like a toddler. Your father is trying to protect you, but you won't listen! You're obsessed with this blacksmith, and it's making you delusional and stupid"`,
    inventory: () => {
      addToInventory(`fine silk dress with a long coat`, 1);
      addToInventory('wooden long bow', 1);
      equipItem(`fine silk dress with a long coat`);
      equipItem('wooden long bow');
    }
  }
];

module.exports = {
  buildWorldInfo: (character) => {
    return {
      key: `${character.name},you,You,YOU`,
      content: '{ ' +
        `You description:< name: < ${character.name}>>/< age: <${character.age}>>/< ${character.gender}>/< height: < ${character.appearance.height}>>/< weight: < ${character.appearance.weight}>>/< class: < ${character.class}>>.` +
        `You appearance:< ${character.appearance.features}>/< eyes: < ${character.eyes}>>/< hair: < ${character.hair.style}& ${character.hair.color}>>/< race: < ${character.race}>>. ` +
        `You mental:< ${character.personality}>.` +
        '}'
    };
  },
  create: () => {
    console.log('\n');
    return {
      name: rl.question("Type your character's name: ").trim(),
      gender: rl.question("Type your character's gender: ").trim(),
      race: rl.question("Choose a race: Altmer (High Elf), Bosmer (Wood Elf), Dunmer (Dark Elf), Orsimer (Orc), Nord, Imperial, Breton, Khajiit, Argonian or Redguard: ").trim(),
      class: rl.question("Choose a class: Mage, Warrior, Ranger, Peasant, Thief, Assassin: ").trim(),
      age: rl.question("Enter your character's age: ").trim(),
      personality: limitCharacterDetails(rl.question("Enter you character's three main personality traits: ")),
      eyes: rl.question("Enter your character's eye color: ").trim(),
      hair: {
        style: rl.question("Enter your character's hairstye: "),
        color: rl.question("Enter your character's hair color: "),
      },
      appearance: {
        height: rl.question("Enter your character's height in centimeters: ").replace(DIGIT_REGEX, ''),
        weight: rl.question("Enter your character's weight in kilos: ").replace(DIGIT_REGEX, ''),
        features: limitCharacterDetails(rl.question("Enter your character's three main physical features: "))
      }
    };
  },
  createCustomPrompt: () => {
    console.log('\n');
    return {
      name: rl.question("Type your character's name: ").trim(),
      gender: rl.question("Type your character's gender: ").trim(),
      race: rl.question("Choose a race: Altmer (High Elf), Bosmer (Wood Elf), Dunmer (Dark Elf), Orsimer (Orc), Nord, Imperial, Breton, Khajiit, Argonian or Redguard: ").trim(),
      class: rl.question("Choose a class: Mage, Warrior, Ranger, Peasant, Thief, Assassin: ").trim(),
      age: rl.question("Enter your character's age: ").trim(),
      personality: limitCharacterDetails(rl.question("Enter you character's three main personality traits: ")),
      eyes: rl.question("Enter your character's eye color: ").trim(),
      hair: {
        style: rl.question("Enter your character's hairstye: "),
        color: rl.question("Enter your character's hair color: "),
      },
      appearance: {
        height: rl.question("Enter your character's height in centimeters: ").replace(DIGIT_REGEX, ''),
        weight: rl.question("Enter your character's weight in kilos: ").replace(DIGIT_REGEX, ''),
        features: limitCharacterDetails(rl.question("Enter your character's three main physical features: "))
      },
      prompt: rl.question("Enter your custom prompt: ").trim()
    };
  },
  generateCharacter: () => {
    return RANDOM_CHARACTERS[Math.floor(Math.random() * RANDOM_CHARACTERS.length)];
  }
}