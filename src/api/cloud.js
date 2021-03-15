import { getToken } from '@/utils/auth'
import {
  Cloud
} from 'less-api-client'

export const cloud = new Cloud({
  entryUrl: process.env.VUE_APP_BASE_API + '/admin/entry',
  getAccessToken: getToken
})

export const db = cloud.database()
