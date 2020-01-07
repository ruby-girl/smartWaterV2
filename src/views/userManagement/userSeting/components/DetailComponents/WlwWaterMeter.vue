<template>
  <div class="water_meter clearfix">
    <!--左侧物联网水表-->
    <WlwWater ref="wlwChildMoudler"></WlwWater>
    <div class="user_info user_water_info">
      <h2>物联网水表</h2>
      <ul>
        <li class="user_line clearfix">
          <p class="half">水表编号 <span>{{ data.WaterMeterNo }}</span></p>
          <p class="half">电子读数 <span>{{ data.DZReadNum }}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">水表样式 <span>{{ data.WaterMeterStyleName}}</span></p>
          <p class="half">口径 <span>{{ data.MeterDiameter }}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">报警量(吨) <span>{{ data.AlarmYield }}</span></p>
          <p class="half">透支量（吨） <span>{{ data.OverdraftYield }}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">信号强度 <span>{{ data.SignalStrength }}</span></p>
          <p class="half">阀门状态 <span>{{ data.ValveStateName }}</span></p>
        </li>
        <li class="user_remak clearfix">
          <p class="all">安装位置 <span>{{ data.InstallAddress }}</span></p>
        </li>
        <li class="user_remak clearfix">
          <p class="all">备注 <span>{{ data.WaterRemark }}</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import WlwWater from '@/components/WaterMeter/WlwWater'
  import { promptInfoFun } from "@/utils/index"
  import { GetWLWInfoByCustomerId } from "@/api/userSetting"//区域接口

  export default {
    name: "WlwWaterMeter",
    components: { WlwWater },
    data(){
      return{
        data:{},
        ReadNum:''
      }
    },
    methods:{
      getDetialInfo(Id) {
        GetWLWInfoByCustomerId({'CustomerId':Id}).then(res => {//获取用户信息
          if(res.code==0){
            this.data = res.data
            this.ReadNum = res.data.DZReadNum
          }else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setMeterNum(){
        this.$refs.wlwChildMoudler.setNumber(this.ReadNum)
      }
    }
  }
</script>

<style scoped lang="scss">
  .water_meter {
    padding: 50px 0 6px 0;
    background: #fff;
    position: relative;
    .user_info {
      h2{font: bold 16px 'Microsoft YaHei';color: #46494C;}
      float: left;
      padding: 0;
      width: calc(100% - 600px);
      margin-top: 50px;
    }
  }
</style>
