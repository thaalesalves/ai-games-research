
// Checkout the repo examples to get an idea of other ways you can use scripting 
// https://github.com/latitudegames/Scripting/blob/master/examples

const modifier = (text) => {
    let modifiedText = text
    const lowered = text.toLowerCase()
  
    // The text passed in is either the user's input or players output to modify.
    if (lowered.includes('you become king') || lowered.includes('you are now king')) {
      // You can modify the state variable to keep track of state throughout the adventure
      state.isKing = true
  
      // Setting state.memory.context will cause that to be used instead of the user set memory
      state.memory = { context: 'You are now the king.' }
  
      // You can modify world info entries using the below commands
      // addWorldEntry(keys, entry)
      // removeWorldEntry(index)
      // updateWorldEntry(index, keys, entry)
  
      // You can read world info keys with worldInfo 
      const entries = worldInfo
  
      // Setting state.message will set an info message that will be displayed in the game
      // This can be useful for debugging
      state.message = JSON.stringify(entries)
  
      // You can log things to the side console when testing with console.log
      console.log('Player is now king')
  
      modifiedText = text + '\nYou are now the king!'
    }
  
    // You must return an object with the text property defined.
    return { text: modifiedText }
  }
  
  // Don't modify this part
  modifier(text)
  