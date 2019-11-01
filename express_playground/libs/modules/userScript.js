const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell
const execOptions = {
  encoding: "utf8",
  timeout: 1000,
  maxBuffer: 1024 * 1024,
  killSignal: "SIGTERM",
  cwd: null,
  env: null
};

const userScript = {
  execute: resultObj => {
    return new Promise((resolve, reject) => {
      exec("node script.js", execOptions, (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(stdout);
          console.log("AFTER EXECUTING SCRIPT");
          resultObj.output = stdout;
          resultObj.error = stderr;
          resolve(resultObj);
        }
      });
    });
  },
  writeFile: codeString => {
    return new Promise((resolve, reject) => {
      fs.writeFile("script.js", codeString, error => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
};

module.exports = userScript;
