<template>
  <el-form
    :inline="true"
    :model="dp"
    class="head-search-form form-inline-small-input search-head-otherbox"
    size="small"
    label-width="70px"
    @submit.native.prevent>
    <el-form-item label="部门" style="margin-left: -40px">
      <el-select v-model="dp.Id" placeholder="请选择" size="small" @change="getText(dp.Id,'Id',postArray,'部门')">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in postArray" :key="index" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="岗位">
      <el-input v-model="dp.JobName" maxlength="20" placeholder="请输入岗位名称" @change="getText(dp.JobName,'JobName','','岗位')"/>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" size="mini" @click="searchFun" round><i class="icon iconfont">&#xe694;</i>查询</el-button>
      <el-button round size="mini" class="cl-reset" @click="resetFun()"><i class="icon iconfont">&#xe64e;</i>重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    import { ComboBoxListZhuanYong } from "@/api/operationFlow"
    import { ComboBoxList } from "@/api/organize"// 请求方法
    import { promptInfoFun } from "@/utils/index";
    export default {
      name: "SelectHead",
      data() {
          return {
            postArray:[],
            operatorArray:[],//操作人数据值
            createStartTimes:[],
            dp: {
              Id: "-1",
              JobName: "",
              createUserId: "",
              createStartTime: "",
              createEndTime: "",
              editUserId: "",
              editStartTime: "",
              editEndTime: "",
              limit: 20,
              page: 1,
              sort: "",
              filed: "",
              tableId: "0000001"
            }//查询参数
          }
      },
      methods: {
        /**
         * 触发父组建查询方法
         * */
        searchFun(){
          this.$parent.dp = Object.assign({},this.dp)
          this.$parent.searchFun();
        },
        /**
         * 从日期插件选择值中分割开始，结束时间
         * createStartTime 开始时间
         * createEndTime 结束时间
         * */
        getTime1(data) {
          if(data !=null){
            this.dp.editStartTime = data[0]
            this.dp.editEndTime = data[1]
          }else{
            this.dp.editStartTime = ''
            this.dp.editEndTime = ''
          }
        },
        /**
         * 获取操作人信息
         * */
        GetLoginNameList() {
          ComboBoxListZhuanYong().then(res => {
            if (res.code ==0 ) {
              this.operatorArray = res.data;
            } else {
              promptInfoFun(this, 1, res.message);
            }
          })
        },
        getComboBoxList() {//获取部门信息
          ComboBoxList().then(res => {
            if(res.code==0){
              this.postArray = res.data;
            } else {
              promptInfoFun(this, 1, res.message);
            }
          })
        },
        getText(val, model, arr, name) {
          this.$parent.getText(val, model, arr, name)
        },
        resetFun(){
          this.dp.Id = ''
          this.dp.JobName = ''
          this.$parent.tipsDataCopy = []
          this.searchFun()
        }
      },
      mounted() {
          this.GetLoginNameList()//获取操作员数组信息
          this.getComboBoxList()//获取操作员数组信息
      }
    }
</script>

