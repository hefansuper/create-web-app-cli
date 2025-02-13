import { select, input, confirm } from "@inquirer/prompts";
import os from "node:os";
import path from "node:path";

async function generate() {
  const componentDir = await input({
    message: "生成组件的目录:",
    default: "src/components",
    required: true,
  });

  const componentDesc = await input({
    message: "组件描述:",
    default: "",
    required: true,
  });

  console.log(componentDir, componentDesc);
}

generate();

export default generate;
