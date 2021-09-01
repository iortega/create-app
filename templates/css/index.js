module.exports = {
  packages: ['postcss-preset-env'],
  templates: [`${__dirname}/postcss.config.js`],
  webpack: [
    'sass-loader',
    'style-loader',
    'postcss-loader',
    'node-sass',
    'css-loader',
    'css-minimizer-webpack-plugin',
    'mini-css-extract-plugin',
  ],
}
