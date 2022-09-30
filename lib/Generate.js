// 获取模板
const ora = require("ora");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const downloadCode = require("download-git-repo");
const fs = require("fs-extra");
const template = require("../template");

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
        choices: ["react"], // "vue", "vue3",
        message: chalk.green(`请选择一个模板来创建项目...`),
      },
      {
        name: "name",
        type: "input",
        message: "请输入项目名称",
        default: "",
      },
      {
        name: "description",
        type: "input",
        message: "请输入项目描述",
        default: "",
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
  async download({ repo, name, description }) {
    const spinner = ora(chalk.green("正在下载模板..."));
    spinner.start();
    await downloadCode(
      `direct:${template[repo]}`,
      path.resolve(process.cwd(), this.targetDir),
      { clone: true },
      (err) => {
        if (err) {
          console.log(chalk.red(spinner.fail("网络波动下载失败，请重试...")));
        } else {
          spinner.succeed();
          console.log(chalk.green(`项目模板下载成功，正在写入配置信息...`));
          this.writeFile(
            path.resolve(process.cwd(), `${this.targetDir}/package.json`),
            name,
            description
          );
        }
      }
    );
  }

  // 修改package文件中的项目名称及描述
  writeFile(path, name, description) {
    const packageData = JSON.parse(fs.readFileSync(path));
    packageData.name = name;
    packageData.description = description;
    // 写入文件
    fs.writeFile(path, JSON.stringify(packageData, null, "\t"), (err) => {
      if (err) {
        console.log(chalk.red(spinner.fail("项目配置信息写入失败...")));
      } else {
        console.log(`\r\n项目创建成功 ${chalk.green(this.name)}`);
        console.log(`\r\n  cd ${chalk.green(this.name)}`);
        console.log("\r\n  npm install");
        console.log("\r\n  npm run dev");
      }
    });
  }
}

module.exports = Generator;
