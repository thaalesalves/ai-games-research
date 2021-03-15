const modifier = (text) => {
  const lowered = text.toLowerCase();
  let stop = false;

  if (state.shouldStop) {
    state.shouldStop = false;
    stop = true;
  }

  // BEGIN Encounters
  // for mashing with other context scripts, keep this codeblock before 'const contextMemory'
  // encounter memory stuff:
  if (state.encounterMemories) {
    memoryLoop:
    for (encounterMemory of state.encounterMemories) {
      // take care to not overload memory, unless forced:
      if (!encounterMemory.memoryGreed && (encounterMemory.memoryText.length + memory.length) > 1000) {
        console.log(`Non-greedy encounterMemory too long, not inserting it!`)
        continue memoryLoop
      }
      state.memory.context = memory
      if (encounterMemory.memoryLocation == 'bottom') {
        state.memory.context = `${state.memory.context}\n${encounterMemory.memoryText}`
      } else if (encounterMemory.memoryLocation == 'top') {
        state.memory.context = `${encounterMemory.memoryText}\n${state.memory.context}`
      } else {
        console.log(`No memoryLocation defined for '${encounterMemory.memoryText}', defaulting to 'top'.`)
        state.memory.context = `${encounterMemory.memoryText}\n${state.memory.context}`
      }
    }
  }
  // END Encounters

  const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : ''
  const context = info.memoryLength ? text.slice(info.memoryLength + 1) : text
  const lines = context.split("\n")

  // BEGIN Encounters
  // for mashing with other context scripts, keep this between 'const lines' and 'const combinedLines'
  if (typeof (state.currentEncounter) !== 'undefined') { // if there's an event...
    lines.splice(-3, 0, state.encounterNote) // ...put it right below AN, so AI knows what's up
  }
  // END Encounters

  const combinedLines = lines.join("\n").slice(-(info.maxChars - info.memoryLength));
  const finalText = [contextMemory, combinedLines].join("");
  return { text: finalText, stop: stop };
}

modifier(text);