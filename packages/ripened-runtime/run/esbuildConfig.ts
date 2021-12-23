#!/usr/bin/env node

import { build } from "esbuild";
import serve, { log } from "create-serve";
import cssModulesPlugin from "esbuild-css-modules-plugin";
import { join } from "path";
import type { Config } from "../types";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFile, writeFile } from "fs";

const isDev = process.argv.includes("--dev");

import(join(process.cwd(), "ripened.config.cjs"))
  .then(function (c) {
    const config: Config = c.default;
    run({ config });
  })
  .catch(function () {
    run({
      config: {},
      message:
        "If you are in need of configuration. You can add a ripened.config.cjs file in the root directory",
    });
  });

function run({ config, message }: { config: Config; message?: string }) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const publicDir = config.publicDirectory ? config.publicDirectory : "public";
  build({
    entryPoints: [config.entryPoint ? config.entryPoint : "app/main.tsx"],
    outfile: `${publicDir}/bundle.js`,
    bundle: true,
    target: config.target
      ? config.target
      : ["chrome58", "firefox57", "safari11", "edge18"],
    inject: [__dirname + "/slim.js"],
    jsxFactory: "createDomElement",
    jsxFragment: "Fragment",
    watch: isDev &&
      config.liveReload && {
        onRebuild(error) {
          setCorrectFormatting(publicDir + "/bundle.js");
          serve.update();
          if (error) console.error("watch build failed:", error);
          if (config.showDevUpdates) log("[WATCH]: Rebuild");
        },
      },
    plugins: [cssModulesPlugin()],
  })
    .then(function () {
      log("[WATCH]: Watching...");
      if (message) log(message);
      setCorrectFormatting(publicDir + "/bundle.js");
    })
    .catch(function () {
      process.exit(1);
    });

  if (isDev) {
    serve.start({
      port: config.devServerPort ? config.devServerPort : 3000,
      root: publicDir,
      live: true,
    });
  }
}

function setCorrectFormatting(bundleFile: string) {
  readFile(bundleFile, "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    const result = data
      .split("createDomElement(")
      .map(function (item, idx) {
        if (idx === 0) return item;
        const endOfHFunction = item.lastIndexOf(")") + 1;
        const rest = item.substring(endOfHFunction);
        const items = item.substring(0, endOfHFunction).split(",");
        const res = items.map(function (val, i) {
          if (val.includes("\n")) return val;
          if (item[item.lastIndexOf(val) + val.length] === ";") return val;
          // TODO: Implement props as function
          if (i >= 2 && idx !== 0) {
            return "() => " + val;
          }
          return val;
        });
        if (idx === 0) return res.join(",") + rest;
        return "() => createDomElement(" + res.join(",") + rest;
      })
      .join("");

    writeFile(bundleFile, result, "utf8", function (err) {
      if (err) return console.error(err);
    });
  });
}
