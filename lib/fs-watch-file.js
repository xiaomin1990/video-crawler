const fs = require('fs')
const EventEmitter = require('events')

const createError = (code, filepath, message) => {
  const error = new Error(message)
  error.code = code
  error.filepath = filepath

  return error
}

module.exports = (options) => {
  const persistent = !(options && !options.persistent)
  const files = {}
  const events = new EventEmitter()

  const add = (filepath,key) => {
    if (files[filepath]) {
      return
    }

    const watcher = fs.watch(filepath, { persistent: persistent }, (eventType) => {
      if (watcher._fwf_invalid || watcher._fwf_closed) {
        return
      }

      if (eventType === 'change') {
        return events.emit('change', { filepath: filepath,key:key })
      }

      delete files[filepath]
      watcher._fwf_invalid = true

      if (eventType === 'close') {
        return events.emit('error', createError('UnexpectedClose', filepath, 'watcher closed unexpectedly'))
      }

      if (eventType === 'error') {
        return events.emit('error', createError('UnexpectedError', filepath, 'watcher errored'))
      }

      return events.emit('error', createError('UnexpectedEvent', filepath, 'watcher behaved unexpectedly'))
    })

    files[filepath] = watcher
  }

  const remove = (filepath) => {
    const watcher = files[filepath]

    if (!watcher) {
      return
    }

    watcher._fwf_closed = true
    watcher.close()
    delete files[filepath]
  }

  const close = () => {
    events.removeAllListeners()

    for (let file in files) {
      remove(file)
    }
  }

  return {
    add,
    remove,
    close,
    options: { persistent: persistent },
    on: events.on.bind(events),
    once: events.once.bind(events),
    off: events.removeListener.bind(events)
  }
}
