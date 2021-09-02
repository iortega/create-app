module.exports = {
  packages: [
    'typescript ts-loader declaration-bundler-webpack-plugin @types/node @types/webpack',
  ],
  templates: [`${__dirname}/tsconfig.json`, `${__dirname}/config`],
  srcTemplates: [`${__dirname}/index.ts`],
};
