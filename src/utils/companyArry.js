import { planConpanySelect } from "@/api/plan"; //http 请求
let comanyArry=[]
planConpanySelect().then(res => {
    //获取水厂
    if (res.code == 0) {
        comanyArry=res.data
        return comanyArry
    }
})
