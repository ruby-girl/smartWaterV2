<template>
  <div class="water_meter clearfix">
    <!--左侧机械水表-->
    <JxWater :ReadNum = ReadNum></JxWater>
    <div class="user_info user_water_info">
      <h2>机械水表</h2>
      <ul>
        <li class="user_line clearfix">
          <p class="half">水表编号 <span>{{ data.WaterMeterNo }}</span></p>
          <p class="half">机械读数 <span>{{ data.ReadNum }}</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">水表样式 <span>{{ data.WaterMeterStyleStr }}</span></p>
          <p class="half">口径 <span>{{ data.MeterDiameter }}</span></p>
        </li>
        <li class="user_remak clearfix">
          <p class="all">安装位置 <span>{{ data.InstallAddress }}</span></p>
        </li>
        <li class="user_remak clearfix">
          <p class="all">备注 <span>{{ data.Remark }}</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import JxWater from '@/components/WaterMeter/JxWater'
  import {promptInfoFun} from "@/utils/index"
  import {GetJXInfoByCustomerId} from "@/api/userSetting"//区域接口

  export default {
    name: "WaterMeter",
    components: {JxWater},
    data(){
      return {
        data:{},
        ReadNum:[]
      }
    },
    methods: {
      getDetialInfo(Id) {//获取机械水表详情信息
        GetJXInfoByCustomerId({'CustomerId': Id}).then(res => {//获取用户信息
          if (res.code == 0) {
            this.data = res.data
            let str = JSON.stringify(res.data.ReadNum)
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
      width: calc(100% - 590px);
      margin-top: 50px;
    }
  }
</style>
