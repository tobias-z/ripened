const { join, resolve } = require("path");
const { exec } = require("child_process");
const commandRunner = require("./command-runner.cjs");

const packages = ["reactive", "runtime"];

function deploy(buildDir, package) {
  console.log(buildDir);
  exec(
    `cp ./packages/ripened-${package}/package.json ${buildDir} && npm publish --access public ${buildDir}`,
    printError
  );
}

const removeBuild = () => exec("rm -rf ../build", printError);

async function execute() {
  removeBuild();
  exec("cd .. && yarn build", printError);
  await commandRunner("npm version patch");
  const packagesDirectory = resolve(__dirname, "../build");
  for (const package of packages) {
    deploy(join(packagesDirectory, "@ripened", package), package);
  }
  removeBuild();
}

function printError(error, stdout) {
  console.error(error);
  console.log(stdout);
}

execute()
  .then(() => {
    process.exit(0);
  })
  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
