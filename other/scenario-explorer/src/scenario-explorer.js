const menu = require('./menu.js');

const main = () => {
  let menuReturn = menu.showMenu();
  if (menuReturn.prop) { // TODO replace with actual prop
    // TODO what to do?
    return;
  }

  console.log(menuReturn);
  pressAnyKey('Press any key to go back to the menu...', {
    ctrlC: "reject"
  }).then(() => {
    main();
  }).catch(() => {
    process.exit(1);
  });
}

main();