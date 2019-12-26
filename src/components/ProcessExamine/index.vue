<template>
  <ul class="process-examine-container">
    <li v-for="(item,index) in auditLink" :key="index"
        :class="`${item.RecordState==1 ? '':''}${item.RecordState==2&&item.VerifyState==true ? 'on':''}${item.RecordState==2&&item.VerifyState==false ? 'fail':''}` ">
      <i class="icon iconfont iconshenhebutongguo point" v-if="item.RecordState==2&&item.VerifyState==false"></i>
      <i class="icon iconfont iconyishenhe point" v-else></i>
      <h3 v-if="item.RecordState==1">待审核</h3>
      <h3 v-else-if="item.RecordState==2&&item.VerifyState==true">已审核</h3>
      <h3 v-else-if="item.RecordState==2&&item.VerifyState==false">审核失败</h3>
      <p>{{ item.WaitExceInfo }}</p>
      <span>{{ item.EditTime }}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "ProcessExamine",
    props:['auditLink','curObj'],
    data(){
      return {}
    }
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
      .icon{background: #fff;}
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
