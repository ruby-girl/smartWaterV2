import request from '@/utils/request'

export function login(data) {//登录
  return request({
    url: '/api/Login/Login',
    method: 'post',
    data
  })
}

export function getKey() {//获取密码解密前的ID等
  return request({
    url: '/api/Login/GetLoginPublicKey',
    method: 'post'
  })
}

export function getInfo() {//获取权限
  return request({
    url: '/api/Login/GetAuthInfo',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

export function getUserInfo() {//获取首页登录信息
  return request({
    url: '/api/FirstPage/GetFirstPageRoleInfo',
    method: 'post'
  })
}

export function GetLoginNameList() {//获取所有账户信息
  return request({
    url: '/api/User/GetLoginNameList',
    method: 'post'
  })
}


