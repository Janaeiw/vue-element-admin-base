/**
 * 防抖
 * @param {function} fn
 * @param {number} delay
 */
export function debounce(fn, delay = 500) {
  let timer = null
  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}

/**
 * 节流
 * @param {function} fn
 * @param {number} delay
 */
export function throttle(fn, delay = 100) {
  let timer = null
  return function () {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}

/**
 * 单例函数（只执行一次）
 * @param {function} fn
 */
export function once(fn) {
  let done = false
  return function () {
    if (!done) {
      done = true
      fn.apply(this, arguments)
    }
  }
}
