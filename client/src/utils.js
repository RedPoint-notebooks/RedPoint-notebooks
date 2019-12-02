export const findLastIndexOfEachLanguageInNotebook = allCells => {
  const languages = [];
  const indexes = [];

  for (let i = allCells.length - 1; i >= 0; i -= 1) {
    let cell = allCells[i];
    if (!languages.includes(cell.language) && cell.language !== "Markdown") {
      languages.push(cell.language);
      indexes.unshift(i);
    }
  }

  return indexes;
};
