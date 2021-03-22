import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

import {
  Cloud, Request
} from 'less-api-client'

export const cloud = new Cloud({
  entryUrl: process.env.VUE_APP_BASE_API + '/admin/entry',
  getAccessToken: getToken,
  requestClass: (config) => new CloudRequest(config)
})

export const db = cloud.database()

/**
 * 自定义请求类
 */
class CloudRequest extends Request {
  async request(data) {
    try {
      const res = await super.request(data)
      return res
    } catch (error) {
      Message({
        message: '您没有该操作权限',
        // message: error.message,
        type: 'info',
        duration: 5 * 1000
      })
      return {
        code: 1,
        error: error.message
      }
    }
  }
}
