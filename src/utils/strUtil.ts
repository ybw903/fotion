export const highlightPatternInText = (pattern: string, text: string) => {
  const regExp = new RegExp(pattern, "g");

  return text.replace(
    regExp,
    `<span className = 'highlight'>${pattern}</span>`
  );
};

export const removeHightPatternInText = (text: string) => {
  const regExp = new RegExp(
    "<(/span|span className = 'highlight')([^>]*)>",
    "g"
  );
  return text.replace(regExp, "");
};
