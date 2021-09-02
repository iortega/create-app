const path = require('path');
const fs = require('fs-extra');

const reactConfig = (project, opts) => {
  const filename = path.join(project, '.babelrc.json');
  const babelConfig = require(filename);
  babelConfig.presets.push('@babel/preset-react');

  fs.writeFileSync(filename, JSON.stringify(babelConfig, null, 2));

  const eslintfile = path.join(project, '.eslintrc.json');
  const eslintConfig = require(eslintfile);
  eslintConfig.extends.push('plugin:react/recommended');

  fs.writeFileSync(eslintfile, JSON.stringify(eslintConfig, null, 2));
};

module.exports = {
  packages: ['react', 'react-dom', 'eslint-plugin-react'],
  webpack: ['@babel/preset-react'],
  srcTemplates: fs
    .readdirSync(path.join(__dirname, 'templates'))
    .map((f) => path.join(__dirname, 'templates', f)),
  configure: reactConfig,
};
