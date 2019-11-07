const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell

const userScript = {
  script: "",
  scriptExecCmd: "",
  execOptions: (execOptions = {
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 200 * 1024, // this is 1mb, default is 204 kb
    killSignal: "SIGTERM",
    cwd: null,
    env: null
  }),

  execute: (cellIdx, resultObj) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE EXECUTING SCRIPT");
      // console.log(userScript.execOptions);
      exec(
        `${this.command} ./codeCellScripts/cell_${cellIdx}${this.fileType}`,
        userScript.execOptions,
        (error, stdout, stderr) => {
          resultObj[cellIdx] = { error, stderr, stdout };

          if (error || stderr) {
            console.log("ERROR EXECUTING SCRIPT");
            reject();
          } else {
            console.log("AFTER EXECUTING SCRIPT");
            resolve();
          }
        }
      );
    });
  },

  writeFile: (codeString, lang) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE WRITING SCRIPT");

      switch (lang) {
        case "RUBY":
          this.fileType = `.rb`;
          this.command = "ruby";
          break;
        case "JAVASCRIPT":
          this.fileType = `.js`;
          this.command = "node";
          break;
      }

      fs.writeFile(
        `./codeCellScripts/user_script${this.fileType}`,
        codeString,
        error => {
          if (error) {
            debugger;

            console.log("ERROR WRITING SCRIPT");
            reject(error);
          } else {
            console.log("AFTER WRITING SCRIPT");
            resolve();
          }
        }
      );
    });
  }
};

module.exports = userScript;
