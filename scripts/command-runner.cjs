const { readdirSync } = require("fs");
const { join } = require("path");
const { exec } = require("child_process");

module.exports = function (command) {
  const path = join(`${process.cwd()}`);
  const packages = readdirSync(`${path}/packages`);
  for (const pack of packages) {
    exec(`cd packages && cd ${pack} && ${command}`, function (_, stdout) {
      console.log(stdout);
    });
  }
};
