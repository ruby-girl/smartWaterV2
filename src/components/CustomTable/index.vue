<template>
  <div class="customTableBox">
    <div v-show="isCustom" class="customOption">
      <p><span class="iconfont iconbiaogezidingyi-tishi"></span>勾选需要显示的列，拖动列表进行排序
        <label class="fr" @click="defaultTableInfo">恢复默认</label>
        <label class="fr" @click="seveTableInfo"  style="color: #00B3A1">应用设置</label>
      </p>
        <span class="fl">自定义选项：</span>
        <div class="fl">
          <el-checkbox v-for="check in checkData" :key="check.Id" v-show="check.IsShow" :disabled="check.ifDisable"  v-model="check.IsCheck" v-dragging="{ item: check, list: checkData, group: 'check' }">{{ check.ColDesc }}</el-checkbox>
        </div>
    </div>
  </div>
</template>

<script>
import { GetTable, AddTableStyle, InitTableStyle } from '@/api/table'//http 请求方法
export default {
  name: 'CustomTable',
  data() {
    return {
      isCustom: false,//是否显示属性
      checkData: [],
      curID:'',
    }
  },
  methods: {
    /**
     * 保存自定义修改
     * */
    seveTableInfo() {
      let data =this.checkData
      for(let i = 0;i<data.length; i++){
         data[i].Sort = i + 1
      }
      let tsp ={
        sutList:data
      }
      AddTableStyle(tsp).then(res => {
        if(res.code==0){
          this.$message({
            message: res.message,
            type: 'success'
          });
          sessionStorage.removeItem(this.curID)
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })

    },
    /**
     * 获取默认信息
     * */
    defaultTableInfo() {
      let tsp = {
        Id:this.curID
      }
      InitTableStyle(tsp).then(res => {
        if(res.code==0){
          sessionStorage.removeItem(this.curID)
          let data = res.data
          for(let i=0;i<data.length;i++){
             for(let j=0;j<this.checkData.length;j++){
               if(data[i].IsShow && data[i].Id == this.checkData[j].Id){
                 this.checkData[j].IsCheck = false
                 this.checkData[j].IsCheck = true
                 this.checkData[j].Sort =  data[i].Sort
               }
            }
          }
          this.sort(this.checkData)
          this.$message({
            message: '已恢复默认设置',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    /**
     * 重新排序
     * */
    sort(arr){
      for(var j=0;j<arr.length-1;j++){
        for(var i=0;i<arr.length-1-j;i++){
          if(arr[i].Sort>arr[i+1].Sort){
            var temp = arr[i];
            arr[i] = arr[i+1];
            arr[i+1] = temp;
          }
        }
      }
    },
    /**
     * 根据ID获取表头信息
     * */
    GetTable(id) {
      this.curID = id;
      let curData = JSON.parse(sessionStorage.getItem(id))
      if(curData!=null){//先从缓存取
        for(let i = 0;i <curData.length; i++){
          this.checkData.push(curData[i])
        }
      }else {
        GetTable({Id:id}).then(res => {
          if(res.code==0){
            let data = res.data
            sessionStorage.setItem(id,JSON.stringify(data))
            for(let i = 0;i <data.length; i++){
              data[i].ifDisable = false//手动添加是否禁用字段
              this.checkData.push(data[i])
            }
          } else {
            this.$message({
              message: res.message,
              type: 'warning'
            });
          }
        })
      }
    }
  },
  watch: {
    checkData:{//深度监听，可监听到对象、数组的变化
      handler(val){
        let isCheckArr = []
        for(let i=0;i<val.length;i++){
          if(val[i].IsCheck){
           isCheckArr.push(val[i].IsCheck)
          }
        }
        if(isCheckArr.length<=1){
          for(let i=0;i<val.length;i++){
            if(val[i].IsCheck){
              val[i].ifDisable = true
            }
          }
        }else{
          for(let i=0;i<val.length;i++){
              val[i].ifDisable = false
          }
        }
      },
      deep:true
    }
  },
  mounted() {
    this.$dragging.$on('dragged', () => {})//拖拽自定义字段排序
  }
}
</script>
<style lang="scss">
  .customTableBox{
    margin-top: 10px;
    .customOption {
      >p{position: absolute;color: #D4B106;font-size: 12px;top: 0px;margin: 0;width: calc(100% - 60px);
        label{font-size:14px;margin-left: 20px;color: #FF3D3D;cursor: pointer}
      }
        position: relative;
        padding:28px 30px 0 30px;border: solid 1px #eee;margin-bottom: 16px;background: #ffffe7;border: solid 1px #fbdb14;line-height: 50px;overflow: auto;
        color: #8b8c89;font-size: 14px;max-height: 100px;display: flex;
      >span{display: inline-block;width: 85px}
      >div{flex: 1}
      .dragging {border-left: dashed 1px #fbdb14;padding-left: 25px}
      .saveBtn { position: absolute;right: 5px;top: 10px;}
   }
  }
</style>
