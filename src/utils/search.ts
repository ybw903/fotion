export const searchPattern = (text: string, pattern: string) => {
  const indexes = [];
  const skipTable = createSkipTable(pattern);

  let textPointer = pattern.length - 1;
  while (textPointer > 0 && textPointer <= text.length - pattern.length) {
    let patternPointer = pattern.length - 1;
    let matchCnt = 0;

    while (
      patternPointer >= 0 &&
      text[textPointer] === pattern[patternPointer]
    ) {
      textPointer--;
      patternPointer--;
      matchCnt++;
    }

    if (patternPointer < 0) {
      indexes.push(++textPointer);
      textPointer += pattern.length + (pattern.length - 1);
    } else {
      textPointer +=
        (skipTable[text[textPointer]] ?? pattern.length) - matchCnt + matchCnt;
    }
  }
  return indexes;
};

const createSkipTable = (pattern: string) => {
  const skipTable = {} as Record<string, number>;
  let cnt = pattern.length - 1;
  for (const character of pattern) {
    skipTable[character] = cnt--;
  }
  return skipTable;
};
