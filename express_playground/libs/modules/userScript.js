const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell

// const userScript = {
//   execute: resultObj => {
//     const rubyScript = exec("ruby script.rb");

//     rubyScript.stdout.on("data", data => {
//       resultObj.output = data;
//     });

//     rubyScript.stdout.on("end", () => {
//       // processesEnded.scriptEnded = true; set flag to true
//     });

//     rubyScript.stderr.on("data", data => {
//       resultObj.error = data;
//     });
//   },
//   writeFile: codeString => {
//     // TODO hardcoded script name
//     fs.writeFile("script.rb", codeString, err => {
//       if (err) {
//         // file write error handling goes here
//       }
//     });
//   }
// };

const userScript = {
  execute: resultObj => {
    const jsScript = exec("node script.js");
    // console.log(jsScript);

    jsScript.stdout.on("data", data => {
      resultObj.output = data;
    });

    jsScript.stdout.on("end", () => {
      // processesEnded.scriptEnded = true; set flag to true
    });

    jsScript.stderr.on("data", data => {
      resultObj.error = data;
    });
  },
  writeFile: codeString => {
    // TODO hardcoded script name
    fs.writeFile("script.js", codeString, err => {
      if (err) {
        // file write error handling goes here
      }
    });
  }
};

module.exports = userScript;

// const deleteScript = () => {
//   exec("rm script.rb", (err, stdout, stderr) => {
//     if (err) {
//       // console.error(`error from delete: ${err}`);
//     } else {
//       console.log("script deleted!");
//     }
//   });
// };
