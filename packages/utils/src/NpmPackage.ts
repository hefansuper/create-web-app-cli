/*
 * @Author: stephenHe
 * @Date: 2025-02-11 11:21:37
 * @LastEditors: stephenHe
 * @LastEditTime: 2025-02-11 17:30:05
 * @Description:下载npm相关的信息
 * @FilePath: /create-web-app-cli/packages/utils/src/NpmPackage.ts
 */
import fs from "node:fs";
import fse from "fs-extra";
// @ts-ignore
import npminstall from "npminstall";
import { getLatestVersion, getNpmRegistry } from "./versionUtils.js";
import path from "node:path";

export interface NpmPackageOptions {
  // 下载包的名字
  name: string;
  // 下载包的目标路径
  targetPath: string;
}

class NpmPackage {
  name: string;
  version: string = "";
  targetPath: string;
  storePath: string; // 拼接了node_modules后的完整的地址

  constructor(options: NpmPackageOptions) {
    this.targetPath = options.targetPath;
    this.name = options.name;

    this.storePath = path.resolve(options.targetPath, "node_modules");
  }

  // 准备
  // 1：下载目录不存在就新建
  // 2：全局更新最新的包的地址
  async prepare() {
    if (!fs.existsSync(this.targetPath)) {
      fse.mkdirpSync(this.targetPath);
    }
    const version = await getLatestVersion(this.name);
    this.version = version;
  }

  // 安装
  async install() {
    await this.prepare();

    return npminstall({
      pkgs: [
        {
          name: this.name,
          version: this.version,
        },
      ],
      registry: getNpmRegistry(),
      root: this.targetPath,
    });
  }

  // 获取下载后包的路径，需要注意的是这个拼接的路径是在node_modules下的，并且有转换。
  get npmFilePath() {
    return path.resolve(
      this.storePath,
      `.store/${this.name.replace("/", "+")}@${this.version}/node_modules/${
        this.name
      }`
    );
  }

  // 是否存在
  async exists() {
    await this.prepare();

    return fs.existsSync(this.npmFilePath);
  }

  // 获取当前包的package.json信息
  async getPackageJSON() {
    if (await this.exists()) {
      return fse.readJsonSync(path.resolve(this.npmFilePath, "package.json"));
    }
    return null;
  }

  async getLatestVersion() {
    return getLatestVersion(this.name);
  }

  // 更新包
  async update() {
    const latestVersion = await this.getLatestVersion();
    return npminstall({
      root: this.targetPath,
      registry: getNpmRegistry(),
      pkgs: [
        {
          name: this.name,
          version: latestVersion,
        },
      ],
    });
  }
}

export default NpmPackage;
