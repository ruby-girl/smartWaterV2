<template>
  <div class="table_custom_box" v-show="isCustom">
    <p class="clearfix">
      <i class="iconfont iconbiaogezidingyi-tishi"></i>
      <span>勾选需要显示的列，拖动列名进行排序</span>
     </p>
    <div class="check_box">
      <el-checkbox v-for="(check,i) in checkData" :key="i" v-show="check.IsShow" :disabled="check.IsCompelShowBol"
                   v-model="check.IsCheck" v-dragging="{ item: check, list: checkData, group: 'check' }">{{
        check.ColDesc }}
      </el-checkbox>
    </div>
    <p class="table_save_btn">
      <label class="el-icon-check" @click="seveTableInfo"></label>
      <label class="el-icon-refresh" @click="defaultTableInfo"></label>
    </p>
  </div>
</template>

<script>
  import {GetTable, AddTableStyle, InitTableStyle} from '@/api/table'//http 请求方法
  export default {
    name: "TableCustom",
    data() {
      return {
        isCustom: false,//是否显示属性
        checkData: [],
        curID: '',
      }
    },
    methods: {
      /**
       * 保存自定义修改
       * */
      seveTableInfo() {
        let data = this.checkData
        for (let i = 0; i < data.length; i++) {
          data[i].Sort = i + 1
        }
        let tsp = {
          sutList: data
        }
        AddTableStyle(tsp).then(res => {
          if (res.code == 0) {
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
          Id: this.curID
        }
        InitTableStyle(tsp).then(res => {
          if (res.code == 0) {
            sessionStorage.removeItem(this.curID)
            let data = res.data
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < this.checkData.length; j++) {
                if (data[i].IsShow && data[i].Id == this.checkData[j].Id) {
                  this.checkData[j].IsCheck = false
                  this.checkData[j].IsCheck = true
                  this.checkData[j].Sort = data[i].Sort
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
      sort(arr) {
        for (var j = 0; j < arr.length - 1; j++) {
          for (var i = 0; i < arr.length - 1 - j; i++) {
            if (arr[i].Sort > arr[i + 1].Sort) {
              var temp = arr[i];
              arr[i] = arr[i + 1];
              arr[i + 1] = temp;
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
        if (curData != null) {//先从缓存取
          for (let i = 0; i < curData.length; i++) {
            this.checkData.push(curData[i])
          }
        } else {
          GetTable({Id: id}).then(res => {
            if (res.code == 0) {
              let data = res.data
              sessionStorage.setItem(id, JSON.stringify(data))
              for (let i = 0; i < data.length; i++) {
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
      checkData: {//深度监听，可监听到对象、数组的变化
        handler(val) {
          let isCheckArr = []
          for (let i = 0; i < val.length; i++) {
            if (val[i].IsCheck) {
              isCheckArr.push(val[i].IsCheck)
            }
          }
          if (isCheckArr.length <= 1) {
            for (let i = 0; i < val.length; i++) {
              if (val[i].IsCheck) {
                val[i].ifDisable = true
              }
            }
          } else {
            for (let i = 0; i < val.length; i++) {
              val[i].ifDisable = false
            }
          }
        },
        deep: true
      }
    },
    mounted() {
      this.$dragging.$on('dragged', () => {
      })//拖拽自定义字段排序
    }
  }
</script>
<style lang="scss">
  .table_custom_box{
    box-shadow: -3px 4px 6px #ddd;
    -webkit-box-shadow: -3px 4px 6px #ddd;
    width: 152px;
    position: absolute;
    right: 15px;
    background: #fff;
    z-index: 999;
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #00B3A1 !important;
    }
    .check_box {height: 260px;overflow: overlay;margin-top: 10px;padding: 0 12px}
    >p:first-child{
      padding: 16px 0 0 10px;
      i{display: inline-block;vertical-align: middle;margin-top: -27px;}
      span{display: inline-block;width: 80%}
      font: normal 12px/14px 'Microsoft YaHei';color: #D4B106;margin: 0;}
    .table_save_btn{
      border-top:solid 1px #D8E2E7;margin:0;
      label:first-child{border-right: solid 1px #D8E2E7;height: 32px;}
      label {
        display: inline-block;
        width: 50%;
        float: left;
        font-size: 22px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        font-weight: 600;
      }
      label:first-child{color: #00B3A1;}
      label:last-child{color: #FF3E3E;}
    }
    label.el-checkbox.is-checked{margin-right: 0;width: 100%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;display: block}
  }
</style>
