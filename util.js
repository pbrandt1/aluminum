var debug = require('debug')('al')

module.exports = {
  notImplemented: function() {
    throw new Error('not implemented')
  },
  status: {
    ADDED: 'A',
    MODIFIED: 'M',
    NEW: '?',
    CONFLICT: 'C',
    CLEAN: ' '
  }
}
