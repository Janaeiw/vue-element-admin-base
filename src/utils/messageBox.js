import Vue from 'vue'
import { MessageBox } from 'element-ui'

export function confirm({ message = '', title = '', type = 'warning', forever = false, subMessage = '' }, errorCallback) {
  return new Promise((resolve) => {
    const VNode = Vue.extend()
    const createElement = new VNode().$createElement
    MessageBox.confirm(createElement('div', null, [
      createElement('div', null, message),
      (forever || subMessage)
        ? createElement('div', {
          style: {
            'margin-top': '10px',
            'line-height': '16px',
            'font-size': '12px',
            color: '#999'
          }
        }, (subMessage || '此操作不能撤销，请谨慎操作~'))
        : ''
    ]), title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type
    }).then(() => {
      resolve()
    }).catch((error) => {
      errorCallback && errorCallback(error)
    })
  })
}
