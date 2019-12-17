<template>
  <el-form
    :inline="true"
    ref="rbpForm"
    :model="rbp"
    :class="ifMore?'head-search-form form-inline-small-input search-head-otherbox on':'head-search-form form-inline-small-input search-head-otherbox'"
    size="small"
    label-width="80px"
    @submit.native.prevent>
    <div style="display: flex">
      <div style="flex:1;float: left">
          <el-form-item label="水厂" prop="SA_WaterFactory_Id" :class="!ifMore||screenWidth>1440?'firstItems':''">
            <el-select v-model="rbp.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getMeterRead">
              <el-option label="全部" value="-1" v-if="waterFactory.length>1"></el-option>
              <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="抄表员" prop="MeterReaderId">
            <el-select v-model="rbp.MeterReaderId" placeholder="请选择" size="small" @change="getText(rbp.MeterReaderId,'MeterReaderId',meterArry,'抄表员')">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
        <transition name="fade">
          <el-form-item label="表册类型" v-show="screenWidth<1280?ifMore:true" prop="BookTypeKey">
            <el-select v-model="rbp.BookTypeKey" placeholder="请选择" size="small" @change="getText(rbp.BookTypeKey,'BookTypeKey',formArry,'表册类型')">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in formArry" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
        </transition>
        <transition name="fade">
          <el-form-item label="表册编号" v-show="screenWidth<1600?ifMore:true" prop="BookNo">
            <el-input v-model="rbp.BookNo" maxlength="20" placeholder="片区名称(长度20)"
                      @keyup.enter.native="handleFilter" @change="getText(rbp.BookNo,'BookNo','','表册编号')"/>
          </el-form-item>
        </transition>
        <transition name="fade">
          <el-form-item label="表册名称" v-show="screenWidth<=1680?ifMore:true" prop="BookName">
            <el-input v-model="rbp.BookName" maxlength="20" placeholder="片区名称(长度20)" @change="getText(rbp.BookName,'BookName','','表册名称')"/>
          </el-form-item>
        </transition>
        <el-form-item label="">
          <i v-show="screenWidth<=1680&&ifMore" class="icon iconfont iconshouqi3" @click="ifMore=!ifMore"></i>
          <i v-show="screenWidth<=1680&&!ifMore" class="icon iconfont iconjianqu3" @click="ifMore=!ifMore"></i>
          <el-button type="primary" size="mini" @click="searchFun" round><i class="icon iconfont">&#xe694;</i>查询
          </el-button>
          <el-button round size="mini" class="cl-reset" @click="resetFun()"><i class="icon iconfont">&#xe64e;</i>重置
          </el-button>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
  import { getDictionaryOption } from "@/utils/permission"

  export default {
    name: "SelectHead",
    data() {
      return {
        rbp:{
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          SA_WaterFactory_Id: "",
          MeterReaderId: "-1",
          BookTypeKey: "-1",
          BookNo: "",
          BookName: "",
          tableId: "0000009"
        },
        formArry:[],//表册类型
        waterFactory:[],//具有权限水厂数据
        meterArry:[],//抄表员
        ifMore:false,
        screenWidth:''
      }
    },
    methods: {
      /**
       * 触发父组建搜索方法
       * */
      searchFun(){
        this.$parent.rbp =  Object.assign({},this.rbp)
        this.$parent.searchFun();
      },
      resetFun(){//重置
        this.$refs['rbpForm'].resetFields();
        this.$parent.tipsDataCopy = []
        this.searchFun()
      },
      getMeterRead(id){
        this.getText(this.rbp.SA_WaterFactory_Id,'SA_WaterFactory_Id',this.waterFactory,'水厂')
        this.$parent.getMeterReaderList(1,id)
      },
      getText(val, model, arr, name) {
        this.$parent.getText(val, model, arr, name)
      },
    },
    mounted() {
      this.screenWidth = window.screen.width
      this.formArry = getDictionaryOption('表册类型')
    }
  }
</script>
