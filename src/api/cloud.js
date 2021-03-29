import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import axios from 'axios'
import * as less from 'less-api-client'

export class Cloud extends less.Cloud {
  fileUrl = ''
  funcUrl = ''

  constructor({ baseUrl, getAccessToken, requestClass, timeout, environment, requestOptions, primaryKey }) {
    baseUrl = baseUrl ?? process.env.VUE_APP_BASE_API
    const entryUrl = baseUrl + '/admin/entry'
    super({ entryUrl, getAccessToken, requestClass, timeout, environment, requestOptions, primaryKey })

    this.fileUrl = baseUrl + '/file'
    this.funcUrl = baseUrl + '/func'
  }

  /**
   * 运行云函数
   */
  async invokeFunctin(functionName, data, debug = false) {
    const token = this.config?.getAccessToken()
    const res = await axios.request({
      url: this.funcUrl + `/invoke/${functionName}?debug=${debug}`,
      data: data,
      method: 'post',
      headers: {
        authorization: `Bearer ${token}`
      }
    })

    return res.data
  }

  /**
   * 上传文件
   */
  async uploadFile(file) {
    const form = new FormData()
    form.append('file', file)
    const token = this.config?.getAccessToken()
    const res = await axios.request({
      method: 'post',
      url: this.fileUrl + '/upload',
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${token}`
      },
      data: form
    })
    return res.data
  }
}

export const cloud = new Cloud({
  entryUrl: process.env.VUE_APP_BASE_API + '/admin/entry',
  getAccessToken: getToken,
  requestClass: (config) => new CloudRequest(config)
})

export const db = cloud.database()

/**
 * 自定义请求类
 */
class CloudRequest extends less.Request {
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
