#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import yargs from "yargs";

// Utility function to capitalize the first letter of a string
const capitalize = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

// Main CLI logic
yargs(hideBin(process.argv))
  .scriptName("create") // Allows using "npx create" or "create" if globally installed
  .command(
    ["module <module>", "m <module>"],
    "Create a new module",
    (yargs) => {
      return yargs.positional("module", {
        describe: "The name of the module",
        type: "string",
      });
    },
    async (args) => {
      const moduleName = (args.module as string).toLowerCase();
      const modulePath = path.join(process.cwd(), "src", "modules", moduleName);

      // Define templates for files
      const files = [
        {
          name: `${moduleName}.controller.ts`,
          content: `
import { Request, Response } from "express";
import { ${capitalize(moduleName)}Service } from "./${moduleName}.service";

const findAll = async (req: Request, res: Response) => {
  const data = await ${capitalize(moduleName)}Service.findAll();
  res.json(data);
};

export const ${capitalize(moduleName)}Controller = {
  findAll,
};
          `,
        },
        {
          name: `${moduleName}.service.ts`,
          content: `
const findAll = async (): Promise<string> => {
  return "hello world";
};

export const ${capitalize(moduleName)}Service = {
  findAll,
};
          `,
        },
        {
          name: `${moduleName}.route.ts`,
          content: `
import { Router } from "express";
import { ${capitalize(
            moduleName
          )}Controller } from "./${moduleName}.controller";

const router = Router();

router.get("/", ${capitalize(moduleName)}Controller.findAll);

export default router;
          `,
        },
        {
          name: `${moduleName}.model.ts`,
          content: `// ${moduleName} model`,
        },
        {
          name: `${moduleName}.interface.ts`,
          content: `// ${moduleName} interface`,
        },
      ];

      // Check if the module folder already exists
      if (fs.existsSync(modulePath)) {
        console.log(chalk.red(`The module "${moduleName}" already exists.`));
        process.exit(1);
      }

      // Create the module folder
      fs.mkdirSync(modulePath, { recursive: true });
      console.log(chalk.green(`Module folder created at: ${modulePath}`));

      // Create the files in the module folder
      files.forEach((file) => {
        const filePath = path.join(modulePath, file.name);
        fs.writeFileSync(filePath, file.content.trimStart());
        console.log(chalk.green(`Created file: ${filePath}`));
      });

      console.log(chalk.blue(`Module "${moduleName}" created successfully.`));
    }
  )
  .demandCommand(1, "You need to specify a valid command")
  .strict()
  .help().argv;
