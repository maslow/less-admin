
/**
 * 将数组转换成映射表(Map)
 * @param {Array} arr 原数组
 * @param {string} map_field 映射键
 * @param {boolean} unique 映射键值是否唯一，默认为 true；如果为 false，则映射值为数组
 */
export function array2map(arr, map_field, unique = true) {
  const map = {}
  for (const el of arr) {
    const key = el[map_field]
    if (unique) {
      map[key] = el ?? null
    } else {
      map[key] = map[key] ?? []
      map[key].push(el)
    }
  }
  return map
}

/**
 * 将映射表合并到数组，即映射表中的键值插入到数组元素中对应的键中
 * @param {*} map
 * @param {*} arr
 * @param {*} map_field
 * @param {*} as_field
 * @returns
 */
export function applyMap2array(map, arr, map_field, as_field) {
  as_field = as_field ?? map_field

  for (const el of arr) {
    const key = el[map_field]
    el[as_field] = map[key]
  }

  return arr
}

/**
 * 功能同 @applyMap2array ，区别在于，数组的映射键值也为数组
 * @param {*} map
 * @param {*} arr
 * @param {*} map_field
 * @param {*} as_field
 * @returns
 */
export function applyMap2arrayInArray(map, arr, map_field, as_field) {
  as_field = as_field ?? map_field

  for (const el of arr) {
    // const key = el[field]
    const sub_arr = el[map_field] || []
    const rets = sub_arr.map(s => map[s])
    el[as_field] = rets
  }

  return arr
}
