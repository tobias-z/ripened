const { join, resolve } = require("path");
const { execSync } = require("child_process");

const packages = ["reactive", "runtime"];

function deploy(buildDir, package) {
  execSync(
    `cp ./packages/ripened-${package}/package.json ${buildDir} && npm publish --access public ${buildDir}`
  );
}

const removeBuild = () => execSync("rm -rf build");

function execute() {
  removeBuild();
  execSync("yarn build");
  execSync(
    "mv ./build/@ripened/runtime/run/esbuildConfig.js ./build/@ripened/runtime/run/esbuildConfig.mjs"
  );
  const packagesDirectory = resolve(__dirname, "../build");
  for (const package of packages) {
    deploy(join(packagesDirectory, "@ripened", package), package);
  }
  removeBuild();
}

execute();
