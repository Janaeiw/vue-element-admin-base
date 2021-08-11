import axios from 'axios'

export default async function(res) {
  let blob = null
  let filename = ''
  if (/\/([\w\\.]+\/)+[^.]+\.[a-zA-Z]+/.test(res)) {
    filename = res.replace(/(.*\/)*([^.]+).*/ig, '$2')
    res = await downloadFile(res)
  } else {
    filename = resolveFileName(res.headers['content-disposition'])
  }
  blob = new Blob([res.data], {
    type: res.headers['content-type']
  })
  const url = URL.createObjectURL(blob)
  toDownload(url, filename)
}

function toDownload(fileUrl, fileName) {
  const aElem = document.createElement('a')
  aElem.download = fileName
  aElem.style.display = 'none'
  aElem.href = fileUrl
  document.body.appendChild(aElem)
  aElem.click()
  document.body.removeChild(aElem)
  URL.revokeObjectURL(fileUrl)
}

function resolveFileName(str) {
  if (!str) {
    return ''
  }
  str = decodeURI(str)
  let match = str.match(/.*?\*=utf-8''\s*(.*)/) || []
  if (match.length > 1) {
    return match[1]
  }
  match = str.match(/.*?=\s*(.*)/) || []
  if (match.length > 1) {
    return match[1]
  }
  return ''
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    axios({
      headers: {
        'content-type': '*/*'
      },
      url,
      method: 'get',
      responseType: 'blob'
    }).then((res) => {
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}
