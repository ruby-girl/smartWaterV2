<template>
  <el-form
    ref="formName"
    :inline="true"
    :model="sbap"
    :class="ifMore?'head-search-form form-inline-small-input search-head-otherbox on':'head-search-form form-inline-small-input search-head-otherbox'"
    size="small"
    label-width="70px"
    @submit.native.prevent>
    <el-form-item label="片区" prop="BlockAreaName" style="margin-left: -40px">
      <el-input v-model="sbap.BlockAreaName" maxlength="20" placeholder="片区 (长度1-20内)" @keyup.enter.native="searchFun" @change="getText(sbap.BlockAreaName,'BlockAreaName','','片区')"/>
    </el-form-item>
    <el-form-item label="操作人" prop="editUserId">
      <el-select v-model="sbap.editUserId" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(sbap.editUserId,'editUserId',operatorArray,'操作人')">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <transition name="fade">
      <el-form-item label="操作时间" prop="createStartTimes" >
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
          value-format="yyyy-MM-dd"
          @change="getTime1"
        />
      </el-form-item>
    </transition>
    <el-form-item label="">
      <el-button type="primary" size="mini" @click="searchFun" round><i class="icon iconfont">&#xe694;</i>查询</el-button>
      <el-button round size="mini" class="cl-reset" @click="resetFun('formName')"><i class="icon iconfont">&#xe64e;</i>重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { ComboBoxListZhuanYong } from "@/api/operationFlow"

  export default {
    name: "SelectHead",
    data() {
      return {
        ifMore:false,
        sbap:{
          page: 1,
          limit: 20,
          filed:'',
          sort:"",
          BlockAreaName: '',//片区名称
          editUserId: '-1',//操作者
          editStartTime: '',//操作开始结束时间
          editEndTime: '',
          tableId: '0000007'
        },
        createStartTimes:[],
        operatorArray:[],
        screenWdth:''
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
        this.getText(this.createStartTimes,'createStartTimes','','操作时间')
        if(data !=null){
          this.sbap.editStartTime = data[0]+ " 00:00:00"
          this.sbap.editEndTime = data[1]+ " 23:59:59"
        }else{
          this.sbap.editStartTime = ''
          this.sbap.editEndTime = ''
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
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      getText(val, model, arr, name) {
        this.$parent.getText(val, model, arr, name)
      },
      resetFun(formName){
        this.$refs[formName].resetFields();
        this.sbap.editStartTime = ''
        this.sbap.editEndTime = ''
        this.createStartTimes = []
        this.$parent.tipsDataCopy = []
        this.searchFun()
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.GetLoginNameList()
    }
  }
</script>
