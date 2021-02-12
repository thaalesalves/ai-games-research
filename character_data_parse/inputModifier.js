const modifier = (text) => {
  let stop = false;
  let modifiedText = text;
  const lowered = text.toLowerCase();

  if (!state.init && info.actionCount < 1) {
    grabAllBrackets(modifiedText);
    state.character = {
      name: state.placeholders[0],
      gender: state.placeholders[1],
      race: state.placeholders[2],
      class: 'Mage'
    };

    const dataBasedOnRace = parseRace(state.character.race, state.character.gender);
    state.init = true;
    modifiedText = modifiedText.replace(BRACKETS, '') + dataBasedOnRace;
  }

  return { text: modifiedText, stop: stop };
}

modifier(text);