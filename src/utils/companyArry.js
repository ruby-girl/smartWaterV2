import store from '@/store'
import { planConpanySelect } from '@/api/plan'
export function getCompany() {//获取具体的字典项
  if (store.state.app.companyArr.length>0) {
    return store.state.app.companyArr
  }else {
    planConpanySelect().then(res => {
      store.state.app.companyArr=res.data
      return false
   })
   
  }
}