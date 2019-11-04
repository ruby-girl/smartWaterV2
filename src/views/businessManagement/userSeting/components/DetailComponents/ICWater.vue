<template>
  <div class="water_meter clearfix">
    <!--左侧IC水表-->
    <WlwWater :ReadNum = ReadNum ref="wlwChildMoudler"></WlwWater>
    <div class="user_info user_water_info">
      <h2>IC卡水表</h2>
      <ul>
        <li class="user_line clearfix">
          <p class="half">水表编号 <span>{{ data.WaterMeterNo}}</span></p>
          <p class="half">电子读数 <span>{{ data.ReadNum}}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">水表样式 <span>{{ data.WaterMeterStyleStr}}</span></p>
          <p class="half">口径 <span>{{ data.MeterDiameter}}</span></p>
        </li>
        <li class="user_line">
          <p class="all">报警金额(元) <span>{{ data.AlarmMoney}}</span></p>
        </li>
        <li class="user_remak clearfix">
          <p class="all">安装位置 <span>{{ data.InstallAddress}}</span></p>
        </li>
        <li class="user_remak clearfix">
          <p class="all">备注 <span>{{ data.Remark}}</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import WlwWater from '@/components/WaterMeter/WlwWater'
  import {promptInfoFun} from "@/utils/index"
  import {GetICInfoByCustomerId} from "@/api/userSetting"//区域接口

  export default {
    name: "ICWater",
    components: {WlwWater},
    data(){
      return{
        data:{},
        ReadNum:[],//水表读书
      }
    },
    methods: {
      getDetialInfo(Id) {
        GetICInfoByCustomerId({'CustomerId': Id}).then(res => {//获取用户信息
          if (res.code == 0) {
            this.data = res.data
            let str = JSON.stringify(res.data.ReadNum)
            this.$refs.wlwChildMoudler.nums = res.data.ReadNum
            let n = 3;
            for (var i = 0; i < str.length; i++) {
              var a = str.slice(n*i, n*(i+1));
              this.ReadNum.push(a);
            }
            if(this.ReadNum.length>=6)
              return false
            let curLenth =  this.ReadNum.length
            for(let i  = 1;i <= 6 - curLenth;i++){
              this.ReadNum.unshift ('0')
            }
          } else {
            promptInfoFun(this, 1, res.message)
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .water_meter {
    padding: 50px 0 56px 0;
    background: #fff;
    position: relative;

    .user_info {
      h2 {
        font: bold 16px 'Microsoft YaHei';
        color: #46494C;
      }

      float: left;
      padding: 0;
      width: calc(100% - 600px);
      margin-top: 50px;
    }
  }
</style>
