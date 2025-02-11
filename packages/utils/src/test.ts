/*
 * @Author: stephenHe
 * @Date: 2025-02-11 11:15:09
 * @LastEditors: stephenHe
 * @LastEditTime: 2025-02-11 17:32:22
 * @Description:
 * @FilePath: /create-web-app-cli/packages/utils/src/test.ts
 */
// import { getLatestVersion } from "./versionUtils.js";

// getLatestVersion("create-vite").then((r) => {
//   console.log(r);
// });

import NpmPackage from "./NpmPackage.js";
import {
  // getLatestSemverVersion,
  getLatestVersion,
  getNpmInfo,
  // getNpmLatestSemverVersion,
  getNpmRegistry,
  getVersions,
} from "./versionUtils.js";
import path from "node:path";

async function main() {
  const pkg = new NpmPackage({
    targetPath: path.join(import.meta.dirname, "../aaa"),
    name: "create-vite",
  });

  if (await pkg.exists()) {
    pkg.update();
  } else {
    pkg.install();
  }

  console.log(await pkg.getPackageJSON());
}

main();

