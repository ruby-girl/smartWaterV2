<template>
  <ul class="process-examine-container">
    <li>
      <i class="icon iconfont iconyishenhe point"></i>
      <h3>待审核</h3>
      <p>待财务部、人事部审核</p>
      <span>2019-11-05 10:17:08</span>
    </li>
    <li class="fail">
      <i class="icon iconfont iconyishenhe point"></i>
      <h3>审核不通过</h3>
      <p>待财务部、人事部审核</p>
      <span>2019-11-05 10:17:08</span>
    </li>
    <li class="on">
      <i class="icon iconfont iconyishenhe point"></i>
      <h3>已审核</h3>
      <p>待财务部、人事部审核</p>
      <span>2019-11-05 10:17:08</span>
    </li>
    <li class="on">
      <i class="icon iconfont iconyishenhe point"></i>
      <h3>已提交</h3>
      <p>待财务部、人事部审核待财务部、人事部审核待财务部、人事部审核待财务部、人事部审核待财务部、人事部审核待财务部、人事部审核待财务部、人事部审核待财务部、人事部审核
      </p>
      <span>2019-11-05 10:17:08</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "ProcessExamine"
  }
</script>

<style lang="scss">
  .process-examine-container{
    width: 100%;
    padding: 18px;
    background: #fff;
    height: 100%;
    overflow: auto;
    margin: 0;
    li{list-style-type: none;width: 100%;position: relative;padding-left: 19px;padding-bottom: 50px;
      .point{
        position: absolute;top: 0px;left: -7px;color: #A6AAAE;
      }
      h3{ font: bold 16px 'Microsoft YaHei';color: #777777;margin: 0;}
      >p{ font: normal 14px 'Microsoft YaHei';color: #777C82;margin: 8px 0;}
      >span{ font: normal 13px 'Microsoft YaHei';color: #B0BAC4;}
    }
    li.on{
      h3{color: #75C200;}
      .point{color: #75C200;}
    }
    li.fail:before, li.on:before{
      border-left: solid 1px #75C200;
    }
    li.fail{
      h3{color: #FF3D3D;}
      .point{color: #FF3D3D;}
    }
    li:before{
      content: "";
      height: 100%;
      border-left: dashed 1px #AAB5C5;
      position: absolute;
      left: 0px;
      top: 0px;
    }
    li:last-child:before{
      height: 0;
    }
  }
</style>
