const SHOOT_AGAIN = new RegExp(/(?:(another|more) arrow(s|)|shoot bow( again|)|you (try to |)shoot)/i);
const AMMO_REGEX = new RegExp(/(?:(arrow(s|)|bullet(s|)))/i);

const modifier = (text) => {
  let modifiedText = text;
  const lowered = text.toLowerCase();

  if (state.inputAction == 'shoot') {
    const shotAgain = lowered.match(SHOOT_AGAIN);
    const ammoUsed = lowered.match(AMMO_REGEX);
    if (ammoUsed && shotAgain) {
      Inventory.removeFromInventory(ammoUsed[0], 1);
    }

    state.inputAction = '';
  }

  return { text: modifiedText }
}

modifier(text);
