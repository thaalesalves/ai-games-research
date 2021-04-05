const modifier = (text) => {
  let stop = false;
  let modifiedText = text;

  if (!state.init && info.actionCount < 1) {
    grabAllBrackets(modifiedText);
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

    playerWorldInfo = {
      keys: `you`,
      hidden: false,
      entry: 'You:['
        + `NAME:${state.character.name}; `
        + `SUMM:age<${state.character.age}>/race<${state.character.race}>/${state.character.appearance.height}cm&${state.character.appearance.weight}kg; `
        + `APPE<You>:${state.character.appearance.features}/eyes<${state.character.eyes.eyeColor}>/hair<${state.character.hair.hairStyle}&${state.character.hair.hairColor}>; `
        + `MIND:${state.character.personality}.`
        + ']'
    };

    addWorldEntry(playerWorldInfo.keys, playerWorldInfo.entry, false);
    state.character.worldInfoIndex = worldEntries.findIndex(wi => wi.keys.includes(state.character.name));

    state.init = true;
    modifiedText = modifiedText.replace(BRACKETS, '') + parseRace();
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);