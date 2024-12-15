#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("CLI to create a backend admin template")
    .argument("<project-name>", "Name of the project")
    .option("-l, --latest", "Update dependencies to the latest version")
    .action((projectName, options) => {
    const targetPath = path_1.default.join(process.cwd(), projectName);
    // Step 1: Clone template repository
    console.log(chalk_1.default.blue("Cloning the template repository..."));
    try {
        (0, child_process_1.execSync)(`git clone https://github.com/X29w/X-DashBoard.git ${targetPath}`, { stdio: "inherit" });
    }
    catch (error) {
        console.error(chalk_1.default.red("Error cloning repository!")); // 错误处理
        process.exit(1);
    }
    // Step 2: Remove the .git directory
    console.log(chalk_1.default.yellow("Removing .git directory to detach from the template repository..."));
    try {
        const gitPath = path_1.default.join(targetPath, ".git");
        if (fs_1.default.existsSync(gitPath)) {
            fs_1.default.rmSync(gitPath, { recursive: true, force: true });
            console.log(chalk_1.default.green(".git directory removed successfully."));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("Error removing .git directory:"), error);
        process.exit(1);
    }
    // Step 3: Reinitialize a new .git repository
    console.log(chalk_1.default.yellow("Initializing a new Git repository..."));
    try {
        (0, child_process_1.execSync)("git init", { cwd: targetPath, stdio: "inherit" });
        console.log(chalk_1.default.green("New Git repository initialized."));
    }
    catch (error) {
        console.error(chalk_1.default.red("Error initializing Git repository:"), error);
        process.exit(1);
    }
    // Step 4: Update dependencies if --latest is specified
    if (options.latest) {
        console.log(chalk_1.default.green("Updating dependencies to the latest version..."));
        try {
            (0, child_process_1.execSync)("npm install -g npm-check-updates", { stdio: "inherit" });
            (0, child_process_1.execSync)("ncu -u", { cwd: targetPath, stdio: "inherit" });
        }
        catch (error) {
            console.error(chalk_1.default.red("Error updating dependencies:"), error);
            process.exit(1);
        }
    }
    // Step 5: Install dependencies
    console.log(chalk_1.default.yellow("Installing project dependencies..."));
    try {
        (0, child_process_1.execSync)("npm install", { cwd: targetPath, stdio: "inherit" });
    }
    catch (error) {
        console.error(chalk_1.default.red("Error installing dependencies:"), error);
        process.exit(1);
    }
    // Step 6: Display success message and next steps
    console.log(chalk_1.default.green("Project setup complete!"));
    console.log("Next steps:");
    console.log(chalk_1.default.cyan(`  cd ${projectName}`));
    console.log(chalk_1.default.cyan("  git add ."));
    console.log(chalk_1.default.cyan('  git commit -m "Initial commit"'));
    console.log(chalk_1.default.cyan("  npm start"));
});
program.parse(process.argv);
