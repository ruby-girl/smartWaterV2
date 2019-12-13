/*******表册管理接口********/
import request from '@/utils/request'

/**
 * 添加表册
 * */
export function registerAdd(data) {
  return request({
    url: '/RegisterBook/Add',
    method: 'post',
    data: data
  })
}

/**
 * 表册更新
 * */
export function registerUpDate(data) {
  return request({
    url: '/RegisterBook/UpDate',
    method: 'post',
    data: data
  })
}

/**
 * 表册列表
 * */
export function GetRegisterList(data) {
  return request({
    url: '/RegisterBook/GetList',
    method: 'post',
    data: data
  })
}

/**
 * 表册导出
 * */
export function GetRegisterList_Execl(data) {
  return request({
    url: '/RegisterBook/GetList_Execl',
    method: 'post',
    data: data
  })
}

/**
 * 定位用户所在表册
 * */
export function GetOrientationList(data) {
  return request({
    url: '/RegisterBook/GetOrientationList',
    method: 'post',
    data: data
  })
}

/**
 * 清空表册
 * */
export function ClearRegisterBook(data) {
  return request({
    url: '/RegisterBook/ClearRegisterBook',
    method: 'post',
    params: data
  })
}

/**
 * 通过水厂获取表册
 * */
export function ComboBoxListByWaterFactory(data) {
  return request({
    url: '/RegisterBook/ComboBoxListByWaterFactory',
    method: 'post',
    params: data
  })
}
/**
 * 通过抄表员获取表册
 * */
export function ComboBoxListByMeterReader(data) {
  return request({
    url: '/RegisterBook/ComboBoxListByMeterReader',
    method: 'post',
    params: data
  })
}
/**
 * 移除表册
 * */
export function RegisterMoveOut(data) {
  return request({
    url: '/RegisterBookDetail/MoveOut',
    method: 'post',
    data: data
  })
}
/**
 * 移入表册
 * */
export function RegisterMoveIn(data) {
  return request({
    url: '/RegisterBookDetail/MoveIn',
    method: 'post',
    data: data
  })
}
/**
 * 同表册移动
 * */
export function SortRegisterBookDetailMoveOut(data) {
  return request({
    url: '/RegisterBookDetail/SortRegisterBookDetailMove',
    method: 'post',
    data: data
  })
}
/**
 * 详情获取集合
 * */
export function RegisterDetailGetList(data) {
  return request({
    url: '/RegisterBookDetail/GetList',
    method: 'post',
    data: data
  })
}

/**
 * 根据ID 获取编辑信息
 * */
export function GetObjById(data) {
  return request({
    url: '/RegisterBook/GetObjById',
    method: 'post',
    params: data
  })
}

/**
 * 删除
 * */
export function DeleteBlObj(data) {
  return request({
    url: '/RegisterBook/Delete',
    method: 'post',
    params: data
  })
}

/**
 * 获取临时表册数据
 * */
export function GetDefaultList(data) {
  return request({
    url: '/RegisterBookDetail/GetDefaultList',
    method: 'post',
    data: data
  })
}

/**
 * 获取水厂抄表员表册树
 * */
export function GetWFMRRBITree(data) {
  return request({
    url: '/RegisterBook/GetWFMRRBITree',
    method: 'post',
    data: data
  })
}
