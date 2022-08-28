export const highlightPatternInText = (pattern: string, text: string) => {
  const regExp = new RegExp(pattern, "g");

  return text.replace(regExp, `<span class = 'highlight'>${pattern}</span>`);
};

export const removeHightPatternInText = (text: string) => {
  const regExp = new RegExp("<(/span|span class = 'highlight')([^>]*)>", "g");
  return text.replace(regExp, "");
};
