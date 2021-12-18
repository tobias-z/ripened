import { build } from "esbuild";
import serve, { log } from "create-serve";
import cssModulesPlugin from "esbuild-css-modules-plugin";
import { join } from "path";
import type { Config } from "../types/config";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
    jsxFactory: "h",
    jsxFragment: "Fragment",
    watch: isDev &&
      config.liveReload && {
        onRebuild(error) {
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
