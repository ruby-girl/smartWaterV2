import request from '@/utils/request'

export function getSelectUser() {//获取操作人下拉框(账户无分页)
    return request({
      url: '/User/GetLoginNameList',
      method: 'post'
    })
}

export function getAccountList(data) {//获取账号列表
    return request({
      url: '/User/GetUserList',
      method: 'post',
      data
    })
}
export function getAccountDetail(data) {//获取账号详情
    return request({
      url: `/User/GetUserModel?userId=${data}`,
      method: 'post',
      data
    })
}