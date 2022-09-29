// 获取模板
const ora = require("ora");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const downloadCode = require("download-git-repo");
const template = require("../template");

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();
  try {
    const result = await fn(...args);
    console.log(result);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    // 状态为修改为失败
    spinner.fail("下载失败，请重试....");
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
  }

  // 创建
  create() {
    // 获取用户选择的模板
    const promptList = [
      {
        name: "repo",
        type: "list",
        choices: ["react"], //"vue", "vue3",
        message: chalk.green(`请选择一个模板来创建项目...`),
      },
      {
        name: "name",
        type: "input",
        message: "请输入昵称",
        default: "hy",
      },
      {
        name: "synopsis",
        type: "input",
        message: "请输入项目简介",
        default: "这是一段项目简介",
      },
    ];
    inquirer.prompt(promptList).then((res) => {
      if (res.repo !== "react") {
        console.log(
          chalk.yellow("暂时只有react模板哦，请耐心等待作者更新！！！")
        );
      } else {
        this.download(res);
      }
    });
  }

  // 下载
  async download({ repo, name, synopsis }) {
    const spinner = ora(chalk.green("正在下载模板..."));
    spinner.start();
    await downloadCode(
      `direct:${template[repo]}`,
      path.resolve(process.cwd(), this.targetDir),
      { clone: true },
      (err) => {
        if (err) {
          chalk.red(spinner.fail("下载失败，请重试...."));
        } else {
          spinner.succeed();
          console.log(`\r\n项目创建成功 ${chalk.green(this.name)}`);
          console.log(`\r\n  cd ${chalk.green(this.name)}`);
          console.log("\r\n  npm install");
          console.log("\r\n  npm run dev");
        }
      }
    );
  }
}

module.exports = Generator;
