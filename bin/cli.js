#! /usr/bin/env node
const program = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");

//创建命令
program
  .command("create <app-name>")
  .description("初始化新项目")
  .option("-f, --force", "如果存在目标目录则直接覆盖")
  .action((name, options) => {
    require("../lib/create.js")(name, options);
  });

program
  // 配置版本号信息
  .version(`v${require("../package.json").version}`)
  .usage("<command> [option]");

program.on("--help", () => {
  // 绘制 Logo
  console.log(
    chalk.blue.bold(
      "\r\n" +
        figlet.textSync("fireHua", {
          font: "Standard",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 80,
          whitespaceBreak: true,
        })
    )
  );
  // 新增说明信息
  console.log(
    `\r\n运行 ${chalk.cyan(`hyCli <命令> --help`)} 命令来查看详细的命令用法\r\n`
  );
});

// 解析用户执行命令传入参数
program.parse(process.argv);
