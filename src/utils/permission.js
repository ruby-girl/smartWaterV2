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
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

export function getDictionaryItem(value) {//获取具体的字典项
  if(store.getters.dictionaryItem){
   let item=store.getters.dictionaryItem.filter(item=>{
      return item.Id==value
    })
    return item.CboList//这里是option数据
  }else{
    console.error(`没有获取到字典项`)
    return false
  }
}