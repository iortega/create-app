module.exports = {
  packages: [
    '@babel/core',
    '@babel/plugin-proposal-class-properties',
    '@babel/preset-env',
  ],
  webpack: ['babel-loader'],
  templates: [`${__dirname}/.babelrc.json`],
}
