import { Message } from 'element-ui'

const showMessage = Symbol('showMessage')

export default class SingleMessage {
  success (options) {
    this[showMessage]('success', options)
  }
  warning (options) {
    this[showMessage]('warning', options)
  }
  info (options) {
    this[showMessage]('info', options)
  }
  error (options) {
    this[showMessage]('error', options)
  }

  [showMessage] (type, options) {
    Message.closeAll()
    Message[type](options)
  }
}
