var fs = require('fs')
var path = require('path')

module.exports = function(argv) {
  fs.createReadStream(path.join(__dirname, '..', 'help.txt')).pipe(process.stdout);
}
