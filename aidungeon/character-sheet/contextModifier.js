const modifier = (text) => {
  const contextMemory = info.memoryLength ? text.slice(0, info.memoryLength) : '';
  const context = info.memoryLength ? text.slice(info.memoryLength) : text;
  const lines = context.split("\n");
  const lowered = text.toLowerCase();
  let stop = false;
  
  const combinedLines = lines.join("\n").slice(-(info.maxChars - info.memoryLength));
  const finalText = [contextMemory, combinedLines].join("");
  return { text: finalText, stop: stop };
}

modifier(text);