import { select, input, confirm } from "@inquirer/prompts";
import { NpmPackage } from "@create-web-app-cli/utils";
import ora from "ora";
import path from "node:path";
import os from "node:os";
import fse from "fs-extra";
import ejs from "ejs";
import { glob } from "glob";

// 睡 1 秒，防止看不到进度条
function sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function create() {
  // 1: 交互
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

  // 最终在用户的目录下生成的可以用的地址。
  const targetPath = path.join(process.cwd(), projectName);

  // 输入的是已经存在的目录，提示是否清空
  if (fse.existsSync(targetPath)) {
    const empty = await confirm({ message: "该目录不为空，是否清空" });
    if (empty) {
      fse.emptyDirSync(targetPath);
    } else {
      process.exit(0);
    }
  }

  // 2：下载模板
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

  // 3：拷贝模板
  const spinner = ora("创建项目中...").start();
  await sleep(1000);

  // 下载的地址，在home-path下
  const templatePath = path.join(pkg.npmFilePath, "template");

  fse.copySync(templatePath, targetPath);

  spinner.stop();

  // 4: ejs模板渲染
  // 将变量渲染到模板中
  const files = await glob("**", {
    cwd: targetPath,
    nodir: true,
    ignore: "node_modules/**",
  });

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(targetPath, files[i]);
    const renderResult = await ejs.renderFile(filePath, {
      projectName,
    });
    fse.writeFileSync(filePath, renderResult);
  }

  console.log(`✅✅✅ 项目创建成功： ${targetPath}`);
}

export default create;
