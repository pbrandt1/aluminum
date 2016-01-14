var fs = require('fs')
var path = require('path')
var os = require('os')

var default_repo_config = {
  origin: process.cwd()
}

module.exports = function(argv) {
  if (fs.existsSync('.al')) {
    console.log('cannot initialize aluminum repo here, ".al" already exists')
    return;
  }

  console.log('initializing aluminum repo...')
  fs.mkdirSync('.al');
  fs.writeFileSync(path.join('.al', 'repo_config.json'), JSON.stringify(default_repo_config, null, 2) + os.EOL, 'utf8')
}
