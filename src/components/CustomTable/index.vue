<template>
  <div class="customTableBox">
    <div v-show="isCustom" class="customOption">
      <span class="fl">自定义选项：</span>
      <div class="fl">
        <el-checkbox v-for="check in checkData" :key="check.Id" v-model="check.IsCheck" v-dragging="{ item: check, list: checkData, group: 'check' }">{{ check.ColDesc }}</el-checkbox>
      </div>
      <el-button class="saveBtn" type="success" size="mini" @click="seveTableInfo">保存</el-button>
    </div>
  </div>
</template>

<script>
import { GetTable, AddTableStyle } from '@/api/table'
export default {
  name: 'CustomTable',
  data() {
    return {
      isCustom: false,
      checkData: []
    }
  },
  methods: {
    /**
     *
     * */
    seveTableInfo() {
      let data =this.checkData
      console.log(data)
      console.log("================")
      for(let i = 0;i<data.length; i++){
         data[i].Sort = i + 1
      }
      console.log(data)
      AddTableStyle(data).then(res => {
        if(res.code==0){
          this.$message({
            message: res.message,
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
     * 根据ID获取表头信息
     * */
    GetTable(id) {
      GetTable({Id:id}).then(res => {
        if(res.code==0){
          let data = res.data
          for(let i = 0;i <data.length; i++){
            if(data[i].IsShow){
              this.checkData.push(data[i])
            }
          }
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    }
  },
  mounted() {
    this.$dragging.$on('dragged', () => {})
  }
}
</script>
<style lang="scss">
  .customTableBox{
    margin-top: 10px;
    .customOption {
        position: relative;
        padding:0 70px 0 30px;border: solid 1px #eee;margin-bottom: 16px;background: #ffffe7;border: solid 1px #fbdb14;line-height: 50px;overflow: auto;
        color: #8b8c89;font-size: 14px;max-height: 100px;display: flex;
      >span{display: inline-block;width: 85px}
      >div{flex: 1}
      .dragging {border-left: dashed 1px #fbdb14;padding-left: 25px}
      .saveBtn { position: absolute;right: 5px;top: 10px;}
   }
  }
</style>
