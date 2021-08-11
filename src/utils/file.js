/**
 * 将base64转化为blob对象
 * @param {string} base64Data base64数据
 */
export function base64ToBlob(base64Data) {
  const arr = base64Data.split(',')
  const fileType = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let l = bstr.length
  const u8Arr = new Uint8Array(l)

  while (l--) {
    u8Arr[l] = bstr.charCodeAt(l)
  }
  return new Blob([u8Arr], {
    type: fileType
  })
}

/**
 * 将file对象转为base64
 * @param {File} file 文件对象
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target.result)
    }
    reader.onerror = (e) => {
      reject(e)
    }
    reader.readAsDataURL(file)
  })
}
