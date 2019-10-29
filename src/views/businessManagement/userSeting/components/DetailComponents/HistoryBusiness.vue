<template>
  <ul class="history_box">
    <p class="search_btn">按日期： <span :class="!asce? 'on':''" @click="sortFun(1)">降序</span> <span :class="asce? 'on':''" @click="sortFun(2)">升序</span></p>
    <li class="open_account">
      <span class="title">开户</span>
      <i class="icon iconfont">&#xe628;</i>
      <div class="content">
        <span>2017-08-12 09:05:14</span>
        <label>由XX开户。</label>
      </div>
    </li>
    <li class="recharge">
      <span class="title">充值</span>
      <i class="icon iconfont">&#xe629;</i>
      <div class="content">
        <span>2017-08-12 09:05:14</span>
        <label>由XX开户。</label>
      </div>
    </li>
    <li class="change_table">
      <span class="title">换表</span>
      <i class="icon iconfont">&#xe639;</i>
      <div class="content">
        <span>2017-08-12 09:05:14</span>
        <label>由XX开户。</label>
      </div>
    </li>
    <li class="upgrade">
      <span class="title">水表升级</span>
      <i class="icon iconfont">&#xe62e;</i>
      <div class="content">
        <span>2017-08-12 09:05:14</span>
        <label>由XX开户。</label>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "HistoryBusiness",
    data() {
      return {
        asce: true
      }
    },
    methods:{
      sortFun(type){//排序，1降序，2升序
        this.asce = !this.asce
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

    li {
      list-style-type: none;
      height: 70px;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      position: relative;
      display: flex;
      -webkit-flex: 1;
      margin-top: 60px;
    }

    li:before {
      content: "";
      height: calc(100% + 60px);
      border-left: dashed 1px #AAB5C5;
      position: absolute;
      left: 95px;
      top: 20px;
      margin-left: -1px;
    }

    li:last-child:before {
      height: calc(100% - 50px);
    }

    .open_account {
      color: #02B19F;

      .icon {
        background: #02B19F;
      }
    }

    .recharge {
      color: #FA9806;

      .icon {
        background: #FA9806;
      }
    }

    .change_table {
      color: #01B09E;

      .icon {
        background: #01B09E;
      }
    }

    .upgrade {
      color: #46BE56;

      .icon {
        background: #46BE56;
      }
    }

    .icon {
      position: absolute;
      left: 95px;
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
      margin-right: 95px;
      width: 60px;
      font: bold 14px/70px 'Microsoft YaHei';
      line-height: 70px;
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
