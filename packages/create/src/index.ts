import { select, input } from "@inquirer/prompts";

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

  console.log(projectTemplate, projectName);
}

export default create;
