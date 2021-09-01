const fs = require('fs-extra')
const path = require('path')

const templateDir = path.join(__dirname, 'templates')

module.exports = {
  templates: fs
    .readdirSync(templateDir)
    .map((filename) => path.join(__dirname, 'templates', filename)),
}
