<template>
  <el-form
    :inline="true"
    :model="sbap"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent>
    <el-form-item label="片区  ">
      <el-input v-model="sbap.BlockAreaName" maxlength="20" placeholder="片区名称(长度20)" @keyup.enter.native="searchFun"/>
    </el-form-item>
    <el-form-item label="操作人  ">
      <el-select v-model="sbap.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="操作时间  ">
      <el-date-picker
        :editable="false"
        @keydown.enter.native="searchFun"
        v-model="createStartTimes"
        :unlink-panels="true"
        size="small"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        @change="getTime1"
      />
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" size="mini" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i>
        搜索
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { GetLoginNameList } from "@/api/user"

  export default {
    name: "SelectHead",
    data() {
      return {
        sbap:{
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          BlockAreaName: '',//片区名称
          editUserId: '-1',//操作者
          editStartTime: '',//操作开始结束时间
          editEndTime: '',
          tableId: '0000007'
        },
        createStartTimes:[],
        operatorArray:[]
      }
    },
    methods: {
      /**
       * 触发父组建查询方法
       * */
      searchFun(){
        this.$parent.sbap = Object.assign({},this.sbap)
        this.$parent.searchFun();
      },
      getTime1(data) {
        if(data !=null){
          this.sbap.editStartTime = data[0]
          this.sbap.editEndTime = data[1]
        }else{
          this.sbap.editStartTime = ''
          this.sbap.editEndTime = ''
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
      },
    },
    mounted() {
      this.GetLoginNameList()
    }
  }
</script>
