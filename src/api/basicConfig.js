import request from '@/utils/request'

export function ComboBoxListByBice(data) {//获取操作人下拉框(账户无分页)
    return request({
      url: '/Employee/ComboBoxListByBice',
      method: 'post',
      params:data
    })
}