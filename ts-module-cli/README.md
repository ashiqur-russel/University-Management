# ts-mod-cli

A CLI tool to generate modules for TypeScript-based Express applications.

## Features

- Quickly generate controllers, services, routes, models, and interfaces.
- Designed for TypeScript-based Express apps.
- Flexible commands with aliases for convenience.

## Installation

### 1. Using npm

Install the package globally for easy usage:

```bash
npm install -g express-module-cli
```

### 2. As a Development Dependency

Install it as a dev dependency in your project:

```bash
npm install --save-dev create-module-cli
```

## Usage

### 1. Global Usage

Run the CLI tool with the create command:

```bash
create module <module-name>
```

For example:

```bash
create module user
```

or,

```bash
create m user
```

### 2. Using npx

Without installation:

```bash
npx express-module-cli module <module-name>
```

For example:

```bash
npx express-module-cli module user
```

or,

```bash
npx express-module-cli m user
```

## Example Output

```bash
npx create-module-cli module user
```

The following files will be created in src/modules/user:

      - user.controller.ts
      - user.service.ts
      - user.route.ts
      - user.model.ts
      - user.interface.ts

## Prerequisites

This CLI tool is designed specifically for **TypeScript-based Express applications**. Ensure your project meets the following requirements:

- TypeScript installed (`npm install typescript --save-dev`)
- `tsconfig.json` configured in your project root
- Express.js installed (`npm install express`)
