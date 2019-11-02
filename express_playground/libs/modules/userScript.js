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
      console.log("BEFORE EXECUTING SCRIPT");
      exec("node script.js", execOptions, (error, stdout, stderr) => {
        if (error) {
          console.log("ERROR EXECUTING SCRIPT");
          console.log(error);
          reject(error);
        } else {
          console.log(stdout);
          console.log("AFTER EXECUTING SCRIPT");
          console.log(`stdout within exec: ${stdout}`);
          resultObj.output = stdout;
          resultObj.error = stderr;
          fs.unlinkSync("script.js");
          console.log(
            `resultObj.output after executing script: ${resultObj.output}`
          );
          resolve();
        }
        // console.log([resultObj.output, resultObj.error]);
        // resultObj.output || resultObj.error ? resolve() : reject();
      });
    });
  },
  // execute: resultObj => {
  //   return new Promise((resolve, reject) => {
  //     console.log("BEFORE EXECUTING SCRIPT");
  //     let nodeScript = exec("node script.js", execOptions);

  //     nodeScript.stdout.on("data", data => resultObj.output += data);
  //     nodeScript.stderr.on("data", data => resultObj.error += data);
  //     nodeScript.stdout.on("end", () => {
  //       console.log("Script ended");
  //       resolve();
  //     });
  // },

  writeFile: codeString => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE WRITING SCRIPT");
      fs.writeFile("script.js", codeString, error => {
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
