<template>
  <div class="water_meter clearfix">
    <!--左侧远传水表-->
    <JxWater ref="meterChild"></JxWater>
    <div class="user_info user_water_info">
      <h2>远传水表</h2>
      <ul>
        <li class="user_line clearfix">
          <p class="half">水表编号 <span>{{ data.WaterMeterNo }}</span></p>
          <p class="half">机械读数 <span>{{ data.JXReadNum }}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">水表样式 <span>{{ data.WaterMeterStyleName}}</span></p>
          <p class="half">口径 <span>{{ data.MeterDiameter}}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">报警金额(元) <span>{{ data.AlarmMoney }}</span></p>
          <p class="half">透支金额(元) <span>{{ data.OverdraftMoney }}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">集中器号 <span>{{ data.ConcentratorNo }}</span></p>
          <p class="half">采集器号 <span>{{ data.CollectorNo }}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="all">阀门状态 <span>{{ data.ValveStateName }}</span></p>
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
  import JxWater from '@/components/WaterMeter/JxWater'
  import {promptInfoFun} from "@/utils/index"
  import {GetYCInfoByCustomerId} from "@/api/userSetting"//区域接口

  export default {
    name: "YcWaterMeter",
    components: {JxWater},
    data(){
      return {
        data:{},
        ReadNum:''
      }
    },
    methods:{
      getDetialInfo(Id) {
        GetYCInfoByCustomerId({'CustomerId': Id}).then(res => {//获取用户信息
          if (res.code == 0) {
              this.data = res.data
              this.ReadNum = res.data.JXReadNum
          } else {
            promptInfoFun(this, 1, res.message)
          }
        })
      },
      setMeterNum(){
        this.$refs.meterChild.setNumber(this.ReadNum)
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
      h2 {
        font: bold 16px 'Microsoft YaHei';
        color: #46494C;
      }

      float: left;
      padding: 0;
      width: calc(100% - 590px);
    }
  }
</style>
