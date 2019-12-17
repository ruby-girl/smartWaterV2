<template>
  <ul class="history_box">
    <p class="search_btn">按日期： <span :class="asce=='asc'? 'on':''" @click="sortFun(1)">降序</span> <span :class="asce=='desc'? 'on':''" @click="sortFun(2)">升序</span></p>
     <!--类型判断  开户：2101，充值：2102，换表：2103，水表升级：2104，编辑：2015-->
    <li v-for="(item,index) in data" :key="index">

      <!--开户-->
      <p v-if="item.BussinessType===2101">
        <span class="title open_account">{{ item.BussinessTypeName }}</span>
        <i class="icon iconfont iconkaihuzhongxin open_account"></i>
      </p>
      <!--充值-->
      <p v-else-if="item.BussinessType===2102">
        <span class="title recharge">{{ item.BussinessTypeName }}</span>
        <i class="icon iconfont iconzu3 recharge"></i>
      </p>

      <!--换表-->
      <p v-else-if="item.BussinessType===2103">
        <span class="title change_table">{{ item.BussinessTypeName }}</span>
        <i class="icon iconfont iconhuanbiao change_table"></i>
      </p>
      <!--水表升级-->
      <p v-else-if="item.BussinessType===2104">
        <span class="title upgrade">{{ item.BussinessTypeName }}</span>
        <i class="icon iconfont iconjianqu2 upgrade"></i>
      </p>
      <!--编辑-->
      <p v-else-if="item.BussinessType===2105">
        <span class="title edit_record">{{ item.BussinessTypeName }}</span>
        <i class="icon iconfont iconbianji2 edit_record"></i>
      </p>
      <!--制卡-->
      <p v-else-if="item.BussinessType===2106">
        <span class="title made_card">{{ item.BussinessTypeName }}</span>
        <i class="icon iconfont iconjianqu1 made_card"></i>
      </p>
      <!--补卡-->
      <p v-else>
        <span class="title patch_card">{{ item.BussinessTypeName }}</span>
        <i class="icon iconfont iconzu7 patch_card"></i>
      </p>
      <div class="content">
        <span>{{item.EditTime}}</span>
        <label>{{item.BussinessContent}}</label>
      </div>
    </li>
  </ul>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"
  import { GetBusinessLogByCustomerId } from "@/api/userSetting"//区域接口

  export default {
    name: "HistoryBusiness",
    data() {
      return {
        asce: 'asc',
        Id:'',
        data:[]
      }
    },
    methods:{
      sortFun(type){//排序，1降序，2升序
        this.asce = !this.asce
        type != 1? this.asce = 'asc' : this.asce = 'desc'
        this.getHistoryInfo(this.Id)
      },
      getHistoryInfo(Id){//详情历史业务数据
        this.Id = Id
        GetBusinessLogByCustomerId({'CustomerId':this.Id,'sort': this.asce}).then(res => {//获取用户信息
          if(res.code==0){
            this.data = res.data
          }else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .history_box {
    background: #fff;
    margin: 0;
    padding: 1px 130px 70px 110px;
    position: relative;
    width: 100%;
    height: 580px;
    overflow: auto;

    li {
      list-style-type: none;
      height: 70px;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      position: relative;
      display: flex;
      -webkit-flex: 1;
      margin-top: 60px;
      p{margin: 0;}
    }

    li:before {
      content: "";
      height: calc(100% + 60px);
      border-left: dashed 1px #AAB5C5;
      position: absolute;
      left: 105px;
      top: 20px;
      margin-left: -1px;
    }

    li:last-child:before {
      height: calc(100% - 50px);
    }

    .open_account{
      color: #02B19F;
    }
    .open_account.icon{ background: #02B19F;}

    .recharge {
      color: #FA9806;
    }
    .recharge.icon{  background: #FA9806;}

    .change_table {
      color: #01B09E;
    }
    .change_table.icon{  background: #01B09E;}

    .upgrade {
      color: #46BE56;
    }
    .upgrade.icon{background: #46BE56;}

    .edit_record {
      color: #B9B300;
    }
    .edit_record.icon{background: #B9B300;}

    .made_card {
      color: #8AD120;
    }
    .made_card.icon{background: #8AD120;}

    .patch_card {
      color: #46BE56;
    }
    .patch_card.icon{background: #46BE56;}

    .icon {
      position: absolute;
      left: 105px;
      top: 50%;
      width: 34px;
      height: 34px;
      margin-left: -17px;
      margin-top: -17px;
      border-radius: 50%;
      text-align: center;
      line-height: 34px;
      color: #fff;
    }

    .title {
      text-align: right;
      margin-right: 85px;
      width: 70px;
      font: bold 14px/70px 'Microsoft YaHei';
      line-height: 70px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .content {
      flex: 1;
      -webkit-flex: 1;
      box-shadow: 1px 2px 3px #cecece;
      -webkit-box-shadow: 1px 2px 5px #cecece;
      padding: 0 15px;

      span {
        color: #777C82;
        font: normal 14px 'Microsoft YaHei';
        display: block;
        margin: 10px 0;
      }

      label {
        font: bold 14px 'Microsoft YaHei';
        color: #46494C;
      }
    }

    .search_btn {
      position: absolute;
      right: 24px;

      span {
        cursor: pointer;
        font: normal 14px 'Microsoft YaHei';
        color: #a2a4a5;
        margin-left: 10px;
      }

      span.on {
        color: #46494C;
      }
    }
  }

</style>
