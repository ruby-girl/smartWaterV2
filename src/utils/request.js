import axios from 'axios'
import router from '../router'
import Element from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import commonJS from "./common.js"


// create an axios instance
const service = axios.create({
  baseURL:commonJS.basePath, // url = base url + request url
  //baseURL: commonJS.basePath, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests

})
var loadinginstace
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    loadinginstace = Element.Loading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0)',text:'加载中...' })
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    loadinginstace.close()
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {

    loadinginstace.close()
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Element.Message.error({
        message: res.message || 'Error',
        type: 'error',
        duration: 4000
      })
      return Promise.reject(res)
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //   confirmButtonText: 'Re-Login',
    //   cancelButtonText: 'Cancel',
    //   type: 'warning'
    // }).then(() => {
      loadinginstace.close()
      Element.Message.error({
        message:"请求错误，请重新登录！",
        duration: 4000
      })
      store.dispatch('user/resetToken').then(() => {
        // location.reload()
        router.push(`/login`)
      })
    // })

    return Promise.reject(error)
  }
)

export default service
