module.exports = {
  notImplemented: function() {
    throw new Error('not implemented')
  },
  status: {
    ADDED: 'A',
    MODIFIED: 'M',
    NEW: '?',
    CONFLICT: '!',
    DELETED: 'D',
    CLEAN: ' '
  },
  debug: require('debug')('al')
}
