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
  cells: [
    {
      language: "Markdown",
      code:
        "### Welcome to RedPoint! \n##### Try editing this demo notebook to learn how Redpoint works! A few quick pointers: \n- The cells for each language run top-to-bottom, just like in a code editor \n- Run each cell individually, or click Run All Cells in the Nav bar\n- Shift-Enter will run the current cell\n- Click inside a Markdown cell to edit, then click outside to render\n- Check out the File dropdown, where you can:\n    - save and clone your notebook\n    - interact with APIs and webhooks\n- We support all language features of our current versions: \n    - Node 8.1\n    - Ruby 2.5.1\n    - Python 3.7.4 \n\nOnce you know your way around, click Delete All Cells in the Nav bar to clear this tutorial and start your own notebook!",
      results: {
        stdout: [],
        error: "",
        return: ""
      },
      id: "c25d28c8-a1ab-40bb-9eed-5a5cc7a0a218",
      rendered: true
    },
    {
      language: "Javascript",
      code: "const adjective = 'awesome'",
      results: {
        stdout: [],
        error: "",
        return: ""
      },
      id: "cbbe6c5a-5c6c-457b-bbca-4a1fd8985ff9"
    },
    {
      language: "Ruby",
      code: "noun = 'notebook'",
      results: {
        stdout: [],
        error: "",
        return: ""
      },
      id: "4db26d82-5c86-4e75-8438-ea5dbe88d3fb"
    },
    {
      language: "Python",
      code: "verb = 'started'",
      results: {
        stdout: [],
        error: "",
        return: ""
      },
      id: "8e8ebef1-9098-4e0d-8077-46a71444e3e5"
    },
    {
      language: "Javascript",
      code: "console.log(`This is ${adjective}!`)",
      results: {
        stdout: [],
        error: "",
        return: ""
      },
      id: "ed916fb3-bcc0-4781-860a-d2fb659964b9"
    },
    {
      language: "Ruby",
      code: 'puts("I love my #{noun}...")',
      results: {
        stdout: [],
        error: "",
        return: ""
      },
      id: "e969816c-5c54-4f3a-94af-767634a35adf"
    },
    {
      language: "Python",
      code: 'print("Let\'s get %s!"%(verb))',
      results: {
        stdout: [],
        error: "",
        return: ""
      },
      id: "0bfa02cf-0284-4edd-8c1d-412071fc5109"
    }
  ],
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
