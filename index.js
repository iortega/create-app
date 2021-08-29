#!/usr/bin/env node

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const inquirer = require('inquirer');
const fs = require('fs-extra');

const argv = yargs(hideBin(process.argv))
  .usage('npn run create-app <app-name>')
  .demandCommand(1)
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .default('v', true)
  .help('h')
  .alias('h', 'help')
  .epilog('Copyright 2021').argv;

const log = (...args) => (argv.verbose ? console.log(...args) : null);

const APP_NAME = argv._[0];
const CURR_DIR = process.cwd();
const TEMPLATE_DIR = `${__dirname}/templates`;

log('Create App Generator', APP_NAME);

const CHOICES = fs.readdirSync(TEMPLATE_DIR);

const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES,
  },
];

inquirer.prompt(QUESTIONS).then((answers) => {
  console.log(answers);
  createProject(answers);
});

const createProject = (props) => {
  const project = `${CURR_DIR}/${APP_NAME}`;
  const templateProject = `${TEMPLATE_DIR}/${props.template}`;

  log(`Creating directory ${project}`);
  fs.mkdirSync(project);

  try {
    fs.copySync(templateProject, project);
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
};
