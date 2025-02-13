import { select, input, confirm } from "@inquirer/prompts";
import os from "node:os";
import path from "node:path";
import OpenAI from "openai";
import fse from "fs-extra";
import { remark } from "remark";
import ora from "ora";

import { systemContent } from "./prompt.js";

async function generate() {
  const componentDir = await input({
    message: "生成组件的目录:",
    default: "src/components",
    required: true,
  });

  const componentDesc = await input({
    message: "组件描述:",
    default:
      "生成一个 Table 的 React 组件，有包含 name、age、email 属性的data 数组参数",
    required: true,
  });

  const apiKey = await input({
    message: "您的apiKey:",
    default: "",
    required: true,
  });

  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.302.ai/v1/chat/completions",
  });

  const spinner = ora("🔨 AI 生成代码中...").start();

  const res = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: componentDesc },
    ],
  });

  spinner.stop();

  const markdown = res.choices[0].message.content || "";

  await remark()
    .use(function (...args) {
      return function (tree: any) {
        let curPath = "";

        for (let i = 0; i < tree.children.length; i++) {
          const node = tree.children[i];
          if (node.type === "heading") {
            curPath = path.join(componentDir, node.children[0].value);
          } else {
            try {
              fse.ensureFileSync(curPath);
              fse.writeFileSync(curPath, node.value);

              console.log("✅ 文件创建成功：", curPath);
            } catch (e) {}
          }
        }
      };
    })
    .process(markdown);
}

export default generate;
