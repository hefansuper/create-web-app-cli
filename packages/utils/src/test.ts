/*
 * @Author: stephenHe
 * @Date: 2025-02-11 11:15:09
 * @LastEditors: stephenHe
 * @LastEditTime: 2025-02-11 11:19:19
 * @Description:
 * @FilePath: /create-web-app-cli/packages/utils/src/test.ts
 */
import { getLatestVersion } from "./versionUtils.js";

getLatestVersion("create-vite").then((r) => {
  console.log(r);
});
