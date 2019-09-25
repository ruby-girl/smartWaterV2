<template>
  <el-form
    :inline="true"
    :model="dp"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent>
    <el-form-item label="部门：">
      <el-input v-model="dp.DeptName" maxlength="20" placeholder="角色名称(长度20)" @keyup.enter.native="handleFilter" />
    </el-form-item>
    <el-form-item label="操作人：">
      <el-select v-model="dp.createUserId" placeholder="请选择" size="small"  @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="操作时间：">
      <el-date-picker
        :editable="false"
        @keydown.enter.native="searchFun"
        v-model="createStartTimes"
        :unlink-panels="true"
        size="small"
        type="datetimerange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        @change="getTime1"
      />
    </el-form-item>
    <el-form-item label=""><el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i> 搜索</el-button></el-form-item>
  </el-form>
</template>

<script>
    import { GetLoginNameList } from "@/api/user"
    export default {
      name: "SelectHead",
      data() {
          return {
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
            this.dp.createStartTime = data[0]
            this.dp.createEndTime = data[1]
          }else{
            this.dp.createStartTime = ''
            this.dp.createEndTime = ''
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
              this.$message({
                message: res.message,
                type: 'warning',
                duration: 4000
              });
            }
          })
        }
      },
      mounted() {
          this.dp = this.$parent.dp;//从父组件获取初始化查询参数
          this.GetLoginNameList()//获取操作员数组信息
      }
    }
</script>

