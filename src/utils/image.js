import { fileToBase64 } from './file'

/**
 * 将图片压缩为对应尺寸
 * @param {Object} options
 * @param {String} options.image 图片的url或者base64数据
 * @param {Number} options.width 目标图片的宽度
 * @param {Number} options.height 目标图片的高度
 * @param {Number} options.quality 生成目标图片质量
 * @param {String} options.fit 图片压缩填充模式默认 scale：按比例缩放，可选 fill：按使用目标尺寸
 * @param {String} options.type 图片压缩类型默认 jpg，可选 png
 * @param {Number} options.rotate 图片旋转，由于手机拍照的角度和我们使用的头像不一致，需要旋转 默认0 仅支持 90 180 -90
 * @returns {Promise} then {width,height,image}
 */
export function pictureCompress(options) {
  return new Promise((resolve, reject) => {
    if (!options.image) {
      reject(new Error('need image'))
      return
    }
    const imgSrc = options.image
    const width = options.width || 640
    const height = options.height || 640
    const type = options.type || 'jpg'
    const quality = options.quality || 0.92
    const fit = options.fit || 'scale'
    const rotate = options.rotate || 0
    if (width <= 0 || height <= 0) {
      reject(new Error('dist width or height need > 0'))
      return
    }
    if (!/jpg|png|jpeg/.test(type)) {
      reject(new Error('type need jpg or png!'))
      return
    }
    if (rotate !== 90 && rotate !== -90 && rotate !== 0 && rotate !== 180) {
      reject(new Error('rotate mast be 0 90 -90 180!'))
      return
    }
    const changeWidthAndHeight = rotate === 90 || rotate === -90
    const image = new Image()
    image.src = imgSrc
    image.onload = function() {
      const distSize = getDistSize({
        width: changeWidthAndHeight ? this.naturalHeight : this.naturalWidth,
        height: changeWidthAndHeight ? this.naturalWidth : this.naturalHeight
      }, {
        width: changeWidthAndHeight ? height : width,
        height: changeWidthAndHeight ? width : height
      }, fit)
      const imgData = compress(this, distSize.width, distSize.height, type, quality, rotate)
      resolve({
        width: distSize.width,
        height: distSize.height,
        image: imgData
      })
    }
    image.onerror = function(err) {
      reject(err)
    }
  })
}

export async function imageCompress(options) {
  if (options.image instanceof File) {
    options.image = await fileToBase64(options.image)
  }
  return pictureCompress(options)
}

/**
 * 将图片转换为固定尺寸的
 * @param {Image} image 图片数据
 * @param {Number} width 转换之后的图片宽度
 * @param {Number} height 转换之后的图片高度
 * @param {String} type base64的图片类型 jpg png
 * @param {Number} quality 转换之后的图片质量
 */
function compress(image, width, height, type, quality, rotate) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const types = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png'
  }
  canvas.width = width
  canvas.height = height
  if (rotate === 90) {
    ctx.translate(width, 0)
    ctx.rotate(90 * Math.PI / 180)
    ctx.drawImage(image, 0, 0, height, width)
  } else if (rotate === -90) {
    ctx.translate(0, height)
    ctx.rotate(-90 * Math.PI / 180)
    ctx.drawImage(image, 0, 0, height, width)
  } else if (rotate === 180) {
    ctx.translate(width, height)
    ctx.rotate(180 * Math.PI / 180)
    ctx.drawImage(image, 0, 0, width, height)
  } else {
    ctx.drawImage(image, 0, 0, width, height)
  }
  return canvas.toDataURL(types[type], quality)
}

/**
 * 选择源尺寸与目标尺寸比例中较小的那个，保证图片可以完全显示
 * 最大值不超过1，如果图片源尺寸小于目标尺寸，则不做处理，返回图片原尺寸
 * @param {Object} source 源图片的宽高
 * @param {Object} dist 目标图片的宽高
 */
function getDistSize(source, dist, fit) {
  if (fit === 'fill') return dist
  const scale = Math.min(dist.width / source.width, dist.height / source.height, 1)
  return {
    width: Math.round(source.width * scale),
    height: Math.round(source.height * scale)
  }
}
