<template>
  <ul class="statistics">
    <li><span>100</span>全部</li>
    <li><span>100</span>机械水表</li>
    <li><span>100</span>IC卡水表</li>
    <li><span>100</span>远传水表</li>
    <li><span>100</span>物联网水表</li>
  </ul>
</template>

<script>
    export default {
        name: "Statistics"
    }
</script>
<style lang="scss">
  .statistics {
    width: 100%;
  li {
    list-style-type: none;float: left;width: 20%;text-align: center;font-size: 14px;color: #46494C;line-height: 35px;margin-bottom: 7px;
  span{font: bold 16px 'Microsoft YaHei';color: #FF2907;display: block}
  }
  }
</style>
