import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/Login/Login',
    method: 'post',
    data
  })
}
// 获取配置项
export function getDictionaryItem() {
  return request({
    url: '/Dictionary/GetDictionaryListAll',
    method: 'get',
  })
}
