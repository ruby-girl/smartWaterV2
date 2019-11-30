<template>
  <el-form
    :inline="true"
    :model="dp"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent>

    <el-form-item label="部门：">
      <el-select v-model="dp.Id" placeholder="请选择" size="small" filterable>
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in postArray" :key="index" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="岗位：">
      <el-input v-model="dp.JobName" maxlength="20" placeholder="角色名称(长度20)" @keyup.enter.native="handleFilter" />
    </el-form-item>
    <el-form-item label=""><el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i> 搜索</el-button></el-form-item>
  </el-form>
</template>

<script>
    import { GetLoginNameList } from "@/api/user"
    import { ComboBoxList } from "@/api/organize"// 请求方法
    import { promptInfoFun } from "@/utils/index";
    export default {
      name: "SelectHead",
      data() {
          return {
            postArray:[],
            operatorArray:[],//操作人数据值
            createStartTimes:[],
            dp: {}//查询参数
          }
      },
      methods: {
        /**
         * 触发父组建查询方法
         * */
        searchFun(){
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
          GetLoginNameList().then(res => {
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
        }
      },
      mounted() {
          this.dp = this.$parent.dp;//从父组件获取初始化查询参数
          this.GetLoginNameList()//获取操作员数组信息
          this.getComboBoxList()//获取操作员数组信息
      }
    }
</script>

