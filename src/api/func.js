import request from '@/utils/request'

/**
 * 运行云函数
 */
export function launchFunction(functionName, data, debug = false) {
  return request({
    url: `/func/invoke/${functionName}?debug=${debug}`,
    method: 'post',
    data: data
  })
}
