const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell

const userScript = {
  script: "",
  scriptExecCmd: "",
  execOptions: (execOptions = {
    encoding: "utf8",
    timeout: 1000,
    maxBuffer: 200 * 1024, // this is 1mb, default is 204 kb
    killSignal: "SIGTERM",
    cwd: null,
    env: null
  }),

  execute: resultObj => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE EXECUTING SCRIPT");
      // console.log(userScript.execOptions);
      exec(
        this.scriptExecCmd,
        userScript.execOptions,
        (error, stdout, stderr) => {
          if (error) {
            resultObj.error = String(error); // pretty print this?
            console.log("ERROR EXECUTING SCRIPT");
            reject(error);
          } else {
            console.log(stdout);
            console.log("AFTER EXECUTING SCRIPT");
            resultObj.output = stdout;
            resultObj.error = stderr;
            fs.unlinkSync(this.script);
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
          this.script = "script.rb";
          this.scriptExecCmd = "ruby script.rb";
          break;
        case "JAVASCRIPT":
          this.script = "script.js";
          this.scriptExecCmd = "node script.js";
          break;
      }

      fs.writeFile(this.script, codeString, error => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("AFTER WRITING SCRIPT");
          resolve();
        }
      });
    });
  }
};

module.exports = userScript;
