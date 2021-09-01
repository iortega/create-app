module.exports = {
  packages: [
    'eslint',
    'eslint-config-airbnb-base',
    'eslint-config-prettier',
    'eslint-import-resolver-webpack',
    'eslint-plugin-import',
    'eslint-plugin-prettier',
    'eslint-webpack-plugin',
  ],
  templates: [`${__dirname}/.eslintrc.json`],
  webpack: ['eslint-webpack-plugin'],
}
