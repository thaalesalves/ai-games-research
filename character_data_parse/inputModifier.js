const modifier = (text) => {
  let stop = false;
  let modifiedText = text;

  if (!state.init && info.actionCount < 1) {
    grabAllBrackets(modifiedText);
    state.character = {
      name: state.placeholders[0],
      gender: state.placeholders[1],
      race: state.placeholders[2],
      class: state.placeholders[3],
      age: state.placeholders[4],
      personality: state.placeholders[5].replace(/,/g, '/'),
      eyes: {
        eyeColor: state.placeholders[6]
      },
      hair: {
        hairStyle: state.placeholders[7],
        hairColor: state.placeholders[8],
      },
      appearance: {
        height: state.placeholders[9].replace(DIGIT_REGEX, ''),
        weight: state.placeholders[10].replace(DIGIT_REGEX, ''),
        features: state.placeholders[11].replace(/,/g, '/')
      },
      story: state.placeholders[12]
    };

    playerWorldInfo = {
      keys: `you`,
      hidden: false,
      entry: ' You:['
        + ` NAME: ${state.character.name};`
        + ` DESC: age< ${state.character.age}>/ race< ${state.character.race}>/${state.character.appearance.features}/ eyes< ${state.character.eyes.eyeColor}>/ hair< ${state.character.hair.hairStyle}& ${state.character.hair.hairColor}/${state.character.appearance.height}cm& ${state.character.appearance.weight}kg>;`
        + ` SUMM: ${state.character.story};`
        + ` MIND: ${state.character.personality};`
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