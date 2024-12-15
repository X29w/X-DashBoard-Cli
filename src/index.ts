#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program
  .version("1.0.0")
  .description("CLI to create a backend admin template")
  .argument("<project-name>", "Name of the project")
  .option("-l, --latest", "Update dependencies to the latest version")
  .action((projectName, options) => {
    const targetPath = path.join(process.cwd(), projectName);

    // Step 1: Clone template repository
    console.log(chalk.blue("Cloning the template repository..."));
    try {
      execSync(
        `git clone https://github.com/X29w/X-DashBoard.git ${targetPath}`,
        { stdio: "inherit" }
      );
    } catch (error) {
      console.error(chalk.red("Error cloning repository!")); // 错误处理
      process.exit(1);
    }

    // Step 2: Remove the .git directory
    console.log(
      chalk.yellow(
        "Removing .git directory to detach from the template repository..."
      )
    );
    try {
      const gitPath = path.join(targetPath, ".git");
      if (fs.existsSync(gitPath)) {
        fs.rmSync(gitPath, { recursive: true, force: true });
        console.log(chalk.green(".git directory removed successfully."));
      }
    } catch (error) {
      console.error(chalk.red("Error removing .git directory:"), error);
      process.exit(1);
    }

    // Step 3: Reinitialize a new .git repository
    console.log(chalk.yellow("Initializing a new Git repository..."));
    try {
      execSync("git init", { cwd: targetPath, stdio: "inherit" });
      console.log(chalk.green("New Git repository initialized."));
    } catch (error) {
      console.error(chalk.red("Error initializing Git repository:"), error);
      process.exit(1);
    }

    // Step 4: Update dependencies if --latest is specified
    if (options.latest) {
      console.log(
        chalk.green("Updating dependencies to the latest version...")
      );
      try {
        execSync("npm install -g npm-check-updates", { stdio: "inherit" });
        execSync("ncu -u", { cwd: targetPath, stdio: "inherit" });
      } catch (error) {
        console.error(chalk.red("Error updating dependencies:"), error);
        process.exit(1);
      }
    }

    // Step 5: Install dependencies
    console.log(chalk.yellow("Installing project dependencies..."));
    try {
      execSync("npm install", { cwd: targetPath, stdio: "inherit" });
    } catch (error) {
      console.error(chalk.red("Error installing dependencies:"), error);
      process.exit(1);
    }

    // Step 6: Display success message and next steps
    console.log(chalk.green("Project setup complete!"));
    console.log("Next steps:");
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan("  git add ."));
    console.log(chalk.cyan('  git commit -m "Initial commit"'));
    console.log(chalk.cyan("  npm start"));
  });

program.parse(process.argv);
