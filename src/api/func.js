import request from '@/utils/request'

/**
 * 运行云函数
 */
export function launchFunction(functionName, params) {
  return request({
    url: `/admin/func/invoke/${functionName}`,
    method: 'post',
    data: {
      params
    }
  })
}
