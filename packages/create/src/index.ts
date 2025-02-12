import { select, input } from "@inquirer/prompts";
import { NpmPackage } from "@create-web-app-cli/utils";
import ora from "ora";
import path from "node:path";
import os from "node:os";

// 睡 1 秒，防止看不到进度条
function sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function create() {
  const projectTemplate = await select({
    message: "请选择项目模版",
    choices: [
      {
        name: "react 项目",
        value: "@create-web-app-cli/template-react",
      },
      {
        name: "vue 项目",
        value: "@create-web-app-cli/template-vue",
      },
    ],
  });

  const projectName = await input({
    message: "请输入项目名",
    validate: function (value) {
      if (value.trim() === "") {
        return "项目名必填!"; // 返回提示信息，表示必填
      }
      return true; // 输入有效
    },
  });

  // 下载模板，注意这个地方下载模板是到用户的主目录
  const pkg = new NpmPackage({
    name: projectTemplate,
    targetPath: path.join(os.homedir(), ".create-web-app-cli-template"),
  });

  if (!(await pkg.exists())) {
    const spinner = ora("下载模版中...").start();
    await pkg.install();
    await sleep(1000);
    spinner.stop();
  } else {
    const spinner = ora("更新模版中...").start();
    await pkg.update();
    await sleep(1000);
    spinner.stop();
  }
}

export default create;
