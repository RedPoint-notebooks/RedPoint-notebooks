export const syntaxErrorIdx = (message, rubyPending, jsPending, pyPending) => {
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
