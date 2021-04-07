# Character Sheet
This simple framework is used to created more interactive prompts for your adventure by parsing the data provided and persisting it into the game as a character sheet, as well as creating a World Info entry formatted with Zaltys' format that is inserted into the AI's memory so it always remembers who you are.

## Does it work out of the box?
It might, if you use a prompt that has the exact same parameters the example uses, which is very unlikely. If your prompt does not have all the info `state.character` object requires, you will need to modify the script to suit your scenario's needs.

## How to use it
### The story prompt
First things first, you need to figure out your prompt. Once you have it written down, you will start altering the script.

#### What's a prompt?
The story prompt is that first thing you see when you start an adventure on AI Dungeon. The classic prompt is `You are a knight in the kingdom of Larion...`. The AI will pick up on your prompt and continue telling the story from there.

#### How do I format the prompt?
Character Sheet uses [Gnurro](https://github.com/Gnurro/AIDscripts)'s placeholder handler to grab stuff inside brackets and handle them in a specific way. Your prompt will need questions, that the player should answer. You can do that by putting, for example, `${Type your race...}`. If something between `${}` is in your prompt, the game will present it to the player as a question that should be answered. 

To use this with Character Sheet (and [Gnurro](https://github.com/Gnurro/AIDscripts)'s scripts, for that matter), these questions should not only be between `${}`, but also between brackets. This way: `[${Type your race...}]`. This will match the script's regular expression that looks for stuff between brackets, and the matching text will be saved to the character's sheet.

### Modifying the script
Once you have your prompt figured out, written down and adapted with the questions between brackets, it's time to actually modify the script. 

#### The `state.character` object
Character's data is saved in `state.character`, and that object will be the focus here. The stuff between brackets will be saved to an array of string called `state.placeholders`, and that's the place where you get your data from. Arrays **always** start at index `0`, so if the first question you asked the player was, for example, `[${Type your name...}]`, then `state.placeholders[0]` will be the character's name, the second question you asked will be at index `1`, and so forth.

The next steps will require this object to be correctly set up.

#### The World Info entry
World Info (WI) entries are bits of text inserted into the story context to help the AI know what's what. With a player WI properly set up, the AI won't forget who you are, and the story will be more solid. I chose Zaltys' format to create this WI entry, but if you know what you're doing, you can experiment with other formats as well. Do notice that this script is not yet ready to work well with EWIJSON, so if that's your goal, some modifications to the player WI key will be required... and you might even want to create two WIs for the player if that fits what you need. Ignore what I just said if you have no idea what the hell I'm talking about, but if you do, be advised.

Anyway, Zaltys' format is separated into categories. You may notice that I used some categories and the values saved in `state.character` will fill said categories and create a WI entry for the AI to use. If plan to use different character details and not the ones in my script example, you'll need to [read more](https://github.com/valahraban/AID-World-Info-research-sheet/tree/main/docs) about the format so you know which categories to use. If you're just removing some character details from your version of the script, you can just remove the stuff you won't need from the WI declaration. If you remove all items from a category, don't leave it empty. Just delete it.

Do note that when a category ends and another one begins, the last item in the former category should be followed by a semicolon (`;`), but the last category of the WI **always** need to be followed by a period (`.`). If you remove `MIND` but decide to keep `APPE`, the semicolon just between `MIND` and `APPE` needs to be removed and replaced by a period.

#### The `possibleLines` array
That's something I did so the initial prompt would get completed by a random sentenced based on the race or class chosen by the player. With this initial prompt completed by the script, the AI would continue telling the story using that as a starting point. That bit is optional if you do not want the initial prompt to be based on what the player chose for their character.

If that's the case, just remove the `return` clause completely in `parseRace()` and then get rid of every mention of `possibleLines`. Then, in `inputModifier.js`, remove `+ parseRace();` from line 43.

## Example
I will use my Elder Scrolls scenario prompt, since it fits the code contained in this repo perfectly - afterall, I created this repo after making it for my scenario.

```
Your name is [${character.name}], and you are a [${Enter your character's gender...}] [${Enter your character's race: Altmer (High Elf), Bosmer (Wood Elf), Dunmer (Dark Elf), Orsimer (Orc), Nord, Imperial, Breton, Khajiit, Argonian or Redguard}] [${Enter your character's class: Mage, Warrior, Ranger, Thief or Nightblade}] that has just arrived in the city of Whiterun. You are [${Enter your character's age...}] years old, and your personality traits are: [${Enter your character's three main personality traits separated by commas...}]. You eyes are [${Enter your character's eye color...}], and your hair is of the style [${Enter your character's hair style...}] and of color [${Enter your character's hair color...}]. You are [${Enter your character's height in centimeters...}] centimeters tall, and you weigh [${Enter your character's weight in kilos...}] kg. Your physical features are: [${Enter your character's three main physical features...}].
```

Notice the questions are asked in a certain order, **always** between brackets. These info will then be saved into `state.placeholders`, and the character's name will be at `state.placeholders[0]`. This goes on until `state.placeholders[11]`, which is the character's physical features. The info recovered from this prompt will then be formatted and saved in `state.character` like this.

```javascript
state.character = {
    name: state.placeholders[0].trim(),
    gender: state.placeholders[1].trim(),
    race: state.placeholders[2].trim(),
    class: state.placeholders[3].trim(),
    age: state.placeholders[4].trim(),
    personality: limitCharacterDetails(state.placeholders[5]),
    eyes: {
        eyeColor: state.placeholders[6].trim()
    },
    hair: {
        hairStyle: state.placeholders[7].trim(),
        hairColor: state.placeholders[8].trim(),
    },
    appearance: {
        height: state.placeholders[9].replace(DIGIT_REGEX, ''),
        weight: state.placeholders[10].replace(DIGIT_REGEX, ''),
        features: limitCharacterDetails(state.placeholders[11])
    }
};
```

From then on, when you use `state.character.name` anywhere in the script, you will get the character's name. Same goes for `state.character.class` or `state.character.eyes.eyeColor`. After all the player's data is formatted, it will be used to build the WI.

```javascript
playerWorldInfo = {
    keys: `${state.character.name},you`,
    hidden: false,
    entry: 'you:['
        + `NAME:${state.character.name}; `
        + `SUMM:age<${state.character.age}>/race<${state.character.race}>/${state.character.appearance.height}cm&${state.character.appearance.weight}kg; `
        + `APPE<you>:${state.character.appearance.features}/eyes<${state.character.eyes.eyeColor}>/hair<${state.character.hair.hairStyle}&${state.character.hair.hairColor}>; `
        + `MIND:${state.character.personality}.`
        + ']'
};
```

Once this object gets inserted into the `worldInfo` array, the AI will always know who your character is every time their name or the word "you" is mentioned.