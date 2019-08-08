import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/Login/Login',
    method: 'post',
    data
  })
}
