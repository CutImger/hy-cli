const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const Generator = require("./Generate");
const figlet = require("figlet");

module.exports = async function (name, options) {
  // 打印logo
  console.log(
    chalk.blue.bold(
      "\r\n" +
        figlet.textSync("fireHua", {
          font: "Standard",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 80,
          whitespaceBreak: true,
        }) +
        "\r\n"
    )
  );
  const cwd = process.cwd();
  // 获取当前目录地址
  const targetAir = path.join(cwd, name);
  // 目录是否已经存在
  if (fs.existsSync(targetAir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetAir);
    } else {
      // 询问用户是否确定要覆盖
      let { action } = await inquirer.prompt([
        {
          name: "action",
          type: "list",
          message: chalk.green("该目录已存在是否删除"),
          choices: [
            {
              name: "是",
              value: "empty",
            },
            {
              name: "否",
              value: false,
            },
          ],
        },
      ]);

      if (!action) {
        return;
      } else if (action === "empty") {
        // 移除已存在的目录
        console.log(chalk.green(`移除成功`));
        await fs.remove(targetAir);
      }
    }
  }
  // 创建项目
  const generator = new Generator(name, targetAir);
  generator.create();
};
