const modifier = (text) => {
  let modifiedText = text
  const lowered = text.toLowerCase()
  return { text: modifiedText }
}

modifier(text)