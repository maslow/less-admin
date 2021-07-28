import request from '@/utils/request'

/**
 * 部署访问策略
 */
export function deployPolicy(data) {
  return request({
    url: '/deploy/policy',
    method: 'post',
    data
  })
}
