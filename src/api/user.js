import request from '@/utils/request'

export function login(data) {//登录
  return request({
    url: '/Login/Login',
    method: 'post',
    data
  })
}

export function getKey() {//获取密码解密前的ID等
  return request({
    url: '/Login/GetLoginPublicKey',
    method: 'post'
  })
}

export function getInfo() {//获取权限
  return request({
    url: '/Login/GetAuthInfo',
    method: 'post'    
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserInfo() {//获取首页登录信息
  return request({
    url: '/FirstPage/GetFirstPageRoleInfo',
    method: 'post'
  })
}



