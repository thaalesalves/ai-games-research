const modifier = (text) => {
  let stop = false;
  let modifiedText = text;

  if (!state.init && info.actionCount < 1) {
    grabAllBrackets(modifiedText);
    state.character = {
      name: state.placeholders[0],
      gender: state.placeholders[1],
      race: state.placeholders[2],
      age: state.placeholders[3],
      personality: state.placeholders[4].replace(/,/g, '/'),
      class: 'Mage',
      eyes: {
        eyeColor: state.placeholders[5]
      },
      hair: {
        hairStyle: state.placeholders[6],
        hairColor: state.placeholders[7],
      },
      appearance: {
        height: state.placeholders[8],
        weight: state.placeholders[9],
        features: state.placeholders[10].replace(/,/g, '/')
      },
      story: state.placeholders[11]
    };

    state.init = true;
    modifiedText = modifiedText.replace(BRACKETS, '') + parseRace(state.character.race, state.character.gender);
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);