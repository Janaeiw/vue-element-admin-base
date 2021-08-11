export function moveItem(array, index, direction = 'up') {
  let moveIndex = index - 1
  if (direction === 'down') {
    moveIndex = index + 1
  }
  const temp = [...array]
  temp.splice(index, 1, ...temp.splice(moveIndex, 1, temp[index]))
  return temp
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export default {
  moveItem,
  cleanArray
}
