#!/usr/bin/env node
import create from "@create-web-app-cli/create";
import { Command } from "commander";
import fse from "fs-extra";
import path from "node:path";

// 获取当前包的package.json 文件
// import.meta.dirname 当前文件所在目录 最终是dist下面
const pkgJson = fse.readJSONSync(
  path.join(import.meta.dirname, "../package.json")
);

const program = new Command();

program
  .name("create-web-app-cli")
  .description("脚手架 cli")
  .version(pkgJson.version);

program
  .command("create")
  .description("创建项目")
  .action(async () => {
    create();
  });

program.parse();
