import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export  function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    return false
  }
}

export function getDictionaryOption(value) {//获取具体的字典项
  if(store.getters.dictionaryItem.length>0){
    let items = store.getters.dictionaryItem.filter(item => {
      return item.Id == value
    })
    // if(all==true){
    //   let obj={
    //     Id:"-1",
    //     Name:"全部"
    //   }
    //   items[0].CboList.unshift(obj)
    // }
    return items[0].CboList//这里是option数据
  }else{
    return false
  }
}
