#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { configure } = require('./templates/addons/react');

const log = console.log;

// const hyphenToCamelCase = (string) =>
//   string.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
// const underscoreToCamelCase = (string) =>
//   string.replace(/_([a-z])/g, (g) => g[1].toUpperCase())

const CURR_DIR = process.cwd();
const ADDONS_DIR = `${__dirname}/templates/addons`;
const MANAGERS = ['npm', 'yarn'];
const BUNDLERS = ['webpack'];
const ADDONS = fs.readdirSync(ADDONS_DIR);

const nameValidator = (value) =>
  /[a-z0-9]+(?:(?:(?:[._]|__|[-]*)[a-z0-9]+)+)?/.test(value) ||
  'Name not valid';

const QUESTIONS = [
  {
    name: 'app',
    type: 'input',
    message: 'Choose your app name:',
    validate: nameValidator,
  },
  {
    name: 'manager',
    message: 'Choose package manager:',
    type: 'list',
    choices: MANAGERS,
  },
  {
    name: 'bundler',
    message: 'Choose bundler:',
    type: 'list',
    choices: BUNDLERS,
  },
];

ADDONS.forEach((addon) => {
  QUESTIONS.push({
    name: addon,
    type: 'confirm',
    message: `Setup ${addon}?`,
    default: false,
  });
});

inquirer.prompt(QUESTIONS).then((answers) => {
  console.log(answers);
  createProject(answers);
});

const createProject = (props) => {
  const { app, manager, bundler } = props;
  const project = `${CURR_DIR}/${app}`;

  log(chalk.yellowBright(`Creating directory ${project}`));
  fs.mkdirSync(project);

  process.chdir(project);

  initProject(manager);

  createGitIgnore(project);

  const libraries = [bundler, 'babel', 'prettier', 'eslint', 'css', 'basic'];
  // const libraries = [bundler, 'basic']

  libraries.forEach((library) => {
    log(chalk.greenBright(`Setting up ${library}`));
    const libSetup = require(`./templates/${library}`);

    setupLib(libSetup, project, props);
  });

  ADDONS.forEach((addon) => {
    if (props[addon]) {
      log(chalk.yellow(`Setting up ${addon}`));

      const addonSetup = require(`./templates/addons/${addon}`);

      setupLib(addonSetup, project, props);
    }
  });

  updateScripts(project);
};

const setupLib = (library, project, opts) => {
  const { manager, bundler } = opts;
  if (library.packages) install(manager, library.packages);
  if (library[bundler]) install(manager, library[bundler]);
  if (library.templates) copyTemplates(library.templates, project);
  if (library.srcTemplates)
    copyTemplates(library.srcTemplates, path.join(project, 'src'));
  if (library.configure) configure(project, opts);
};

const initProject = (manager) => {
  switch (manager) {
    case 'npm':
      npmInit();
      break;

    case 'yarn':
      yarnInit();
      break;
  }
};

const npmInit = () => execSync('npm init -y');
const yarnInit = () => execSync('yarn init -y');

const install = (manager, packages) => {
  switch (manager) {
    case 'npm':
      npmInstallDev(packages);
      break;

    case 'yarn':
      yarnInstallDev(packages);
      break;
  }
};

const npmInstallDev = (packages) =>
  execSync(`npm install -D ${packages.join(' ')}`);
const yarnInstallDev = (packages) =>
  execSync(`yarn add -D ${packages.join(' ')}`);

const copyTemplates = (templates, project) => {
  templates.forEach((template) => {
    const name = path.basename(template);
    const dest = path.join(project, name);
    log(chalk.yellowBright(`Copying ${template} to ${dest}`));
    fs.copySync(template, path.join(project, name));
  });
};

const createGitIgnore = (project) => {
  log(chalk.greenBright('Creating .gitignore'));

  fs.writeFileSync(
    path.join(project, '.gitignore'),
    '**/.DS_Store\n/node_modules\n/dist'
  );
};

const updateScripts = (project) => {
  const filename = path.join(project, 'package.json');
  const packageFile = require(filename);
  packageFile.scripts.start =
    'NODE_ENV=development webpack serve --config config/webpack.dev.js';
  packageFile.scripts.build =
    'NODE_ENV=production webpack --config config/webpack.prod.js';
  packageFile.scripts.lint = 'eslint . src config || true';

  fs.writeFileSync(filename, JSON.stringify(packageFile, null, 2));
};
