export const findSyntaxErrorIdx = (
  message,
  rubyPending,
  jsPending,
  pyPending
) => {
  const cellIdx = message.data.location[0];

  switch (message.language) {
    case "Ruby":
      return rubyPending[cellIdx];
    case "Javascript":
      return jsPending[cellIdx];
    case "Python":
      return pyPending[cellIdx];
    default:
      break;
  }
};

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

export const findCellIndex = (message, state) => {
  switch (message.language) {
    case "Ruby":
      return state.RubyPendingIndexes[state.RubyWriteToIndex];
    case "Javascript":
      return state.JavascriptPendingIndexes[state.JavascriptWriteToIndex];
    case "Python":
      return state.PythonPendingIndexes[state.PythonWriteToIndex];
    default:
      console.log("Error in findCellIndex");
      return null;
  }
};

export const findWriteToPendingIndex = language => {
  switch (language) {
    case "Ruby":
      return "RubyWriteToIndex";
    case "Javascript":
      return "JavascriptWriteToIndex";
    case "Python":
      return "PythonWriteToIndex";
    default:
      console.log("Error: Invalid Language Supplied in Server Message");
  }
};

export const findPendingIndex = language => {
  switch (language) {
    case "Ruby":
      return "RubyPendingIndexes";
    case "Javascript":
      return "JavascriptPendingIndexes";
    case "Python":
      return "PythonPendingIndexes";
    default:
      console.log("Error: Invalid Language Supplied in Server Message");
      return null;
  }
};
