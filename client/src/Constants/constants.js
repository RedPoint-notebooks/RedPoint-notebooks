import uuidv4 from "uuid";

export const LANGUAGES = ["Markdown", "Javascript", "Ruby", "Python"];
export const SIGTERM_ERROR_MESSAGE = `Timeout Error: the request to the server timed out.
              The maximum timeout threshold for server requests is currently 5 seconds.
              Check your code for infinite loops, or timeouts greater than the threshold.`;
const domain = window.location.host
  .split(".")
  .splice(-2)
  .join(".");
export const PROXY_URL = "https://www." + domain;

export const DEFAULT_STATE = {
  id: uuidv4(),
  title: "My Notebook",
  presentation: false,
  isClone: false,
  cells: [],
  Ruby: {
    pendingIndexes: [],
    writeToIndex: 0, // the index of the pending indexes array
    codePending: false
  },
  Javascript: {
    pendingIndexes: [],
    writeToIndex: 0,
    codePending: false
  },
  Python: {
    pendingIndexes: [],
    writeToIndex: 0,
    codePending: false
  }
};

export const HELP_CELL = {
  language: "Markdown",
  code: `### Welcome to RedPoint! 
  ##### A few quick pointers: 
  - The cells for each language run top-to-bottom, just like in a code editor 
  - Run each cell individually, or click Run All Cells in the Nav bar
  - Shift-Enter will run the current cell
  - Click inside a Markdown cell to edit, then click outside to render
  - Check out the File dropdown, where you can:
      - save and clone your notebook
      - interact with APIs and webhooks
  - To delete:
      - a single cell, click the 'x' in the upper right corner of the cell
      - all cells, click the trash icon in the Nav bar
  - Give a title to your notebook:
      - Click the 'My Notebook' placeholder in the Nav bar
  - Clean up the Notebook for presentation by toggling the slider in the upper-right hand corner of the notebook`,
  results: {
    stdout: [],
    error: "",
    return: ""
  },
  id: "c25d28c8-a1ab-40bb-9eed-5a5cc7a0a218",
  rendered: true
};
