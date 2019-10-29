<template>
  <div class="water_meter clearfix">
    <!--左侧物联网水表-->
    <WlwWater></WlwWater>
    <div class="user_info">
      <h2>物联网水表</h2>
      <ul>
        <li class="user_line clearfix">
          <p class="half">水表编号 <span>121212121</span></p>
          <p class="half">电子读数 <span>213423232323</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">水表样式 <span>立式</span></p>
          <p class="half">口径 <span>11</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">报警量 <span>立式</span></p>
          <p class="half">透支量 <span>11</span></p>
        </li>
        <li class="user_line clearfix">
          <p class="half">信号强度 <span>立式</span></p>
          <p class="half">阀门状态 <span>11</span></p>
        </li>
        <li class="user_remak clearfix">
          <p class="all">安装位置 <span>四川省成都市高新区四川省</span></p>
        </li>
        <li class="user_remak clearfix">
          <p class="all">备注 <span>四川省成都市高新区四川省成都市高新区四川省成都市高新区四川省成都市高新区四川省成都市高新区四川省成都市高新区四川省成都市高新区四川省成都市高新区四川省成都市高新区四川省成都市高新区四川省成都市高新</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import WlwWater from '@/components/WaterMeter/WlwWater'

  export default {
    name: "WlwWaterMeter",
    components: { WlwWater }
  }
</script>

<style scoped lang="scss">
  .water_meter {
    padding: 50px 0 56px 0;
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
