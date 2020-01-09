import request from '@/utils/request'

export function ComboBoxListByBice(data) {//获取操作人下拉框(账户无分页)--部门+岗位+姓名 拼接
    return request({
      url: '/Employee/ComboBoxListByBice',
      method: 'post',
      params:data
    })
}
export function AddBasicConfigInfo(data) {//获取操作人下拉框(账户无分页)
  return request({
    url: '/BasicConfigManage/AddBasicConfigInfo',
    method: 'post',
    data:data
  })
}
export function GetBasicConfigVal() {//获取操作人下拉框(账户无分页)
  return request({
    url: '/BasicConfigManage/GetBasicConfigVal',
    method: 'get'
  })
}

// 产销差接口**********************************

export function SelectWaterYieldToFactory(data) {//获取操作人下拉框(账户无分页)
  return request({
    url: '/MonthWaterYieldManage/SelectWaterYieldToFactory',
    method: 'post',
    params:data
  })
}