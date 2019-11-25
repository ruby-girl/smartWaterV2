import request from '@/utils/request'
/*****************用户设置区域接口********************/

/**
 * 自动生成区域编码
 * */
export function CreateAreaNo(data) {
  return request({
    url: '/UserArea/CreateAreaNo',
    method: 'post',
    params: data
  })
}

/**
 * 新增区域
 * */
export function AddArea(data) {
  return request({
    url: '/UserArea/AddArea',
    method: 'post',
    data: data
  })
}

/**
 * 编辑区域名称
 * */
export function UpdateAreaName(data) {
  return request({
    url: '/UserArea/UpdateAreaName/{id}',
    method: 'post',
    params: data
  })
}


/**
 * 删除某区域
 * */
export function DelCustomerArea(data) {
  return request({
    url: '/UserArea/DelCustomerArea/{id}',
    method: 'post',
    params: data
  })
}


/**
 * 获取区域列表
 * */
export function GetAreaList(data) {
  return request({
    url: '/UserArea/GetAreaList',
    method: 'get',
    params: data
  })
}


/**
 * 根据区域名称查询区域对象
 * */
export function SelectAreaObjByName(data) {
  return request({
    url: '/UserArea/SelectAreaObjByName',
    method: 'post',
    params: data
  })
}

/**
 * 根据水厂获取区域列表
 * */
export function GetAreaListByWaterFactory(data) {
  return request({
    url: '/UserArea/GetAreaListByWaterFactory',
    method: 'get',
    params: data
  })
}

/**
 * 根据用户id获取用户区域数据 返回值string 如"四川省 成都市 高新区 XXXX区 YYYY街道"
 * */
export function GetAreaStrByCustomerId(data) {
  return request({
    url: '/UserArea/GetAreaStrByCustomerId',
    method: 'get',
    params: data
  })
}


// 欠费管理-按水厂/全部，查询区域列表
export function GetAreaListNotPNode(data) {
  return request({
    url: '/UserArea/GetAreaListNotPNode',
    method: 'get',
    params: data
  })
}