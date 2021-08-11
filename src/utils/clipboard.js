import Clipboard from 'clipboard'

export function copyToClipboard(text, event) {
  return new Promise((resolve, reject) => {
    const clipboard = new Clipboard(event.target, {
      text: () => text
    })
    clipboard.on('success', () => {
      resolve()
      clipboard.destroy()
    })
    clipboard.on('error', (err) => {
      reject(err)
      clipboard.destroy()
    })
    clipboard.onClick(event)
  })
}
