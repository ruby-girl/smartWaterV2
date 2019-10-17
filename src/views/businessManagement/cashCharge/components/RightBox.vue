<template>
  <!-- 新增弹窗 -->
  <div>
    <div class="right-detail-box">
      <div>应收金额：80元</div>
      <div class="display-flex align-items-center">
        <div class="main-color-pink">实收金额：</div>
        <div class="right-detail-input">
          <input type="text" />
        </div>
        <span class="main-color-pink">元</span>
      </div>
      <div>&#12288;&#12288;找零：80元</div>
    </div>
    <div class="display-flex justify-content-flex-end">
      <div class="save-account">存入账户</div>
    </div>
    <div class="right-detail-box account-height">
      <div>
        账户金额：
        <span class="main-color-pink">20</span>元
      </div>
    </div>
    <div class="display-flex align-items-center main-more-black-color pint-type">
      <span>选择打印方式：</span>
      <el-radio v-model="radio" :label="1">打印小票</el-radio>
      <el-radio v-model="radio" :label="2">打印发票</el-radio>
    </div>
    <button class="pay-btn">结算</button>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      radio: 1
    };
  },
  methods: {
    getList() {}
  }
};
</script>
<style lang="scss" scoped>
.right-detail-box {
  background: #f5f5f5;
  padding: 0 10px;
  > div {
    line-height: 40px;
    color: #46494c;
  }
}
.right-detail-input {
  > input {
    height: 50px;
    width: 170px;
    border: 1px solid #ff5656;
    margin-right: 5px;
    color: #ff5656;
    font-size: 22px;
    font-weight: bold;
    &:focus {
      outline: none;
      border: 2px solid #ff5656;
    }
  }
}
.save-account {
  color: #00b3a1;
  border: 1px solid #00b3a1;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 13px;
  margin: 12px 0;
  cursor: pointer;
}
.account-height {
  height: 54px;
  > div {
    line-height: 50px !important;
    > span {
      font-weight: bold;
    }
  }
}
.pint-type {
  padding: 20px 0 80px 0;
}
.pay-btn {
  background: #ef8205;
  text-align: center;
  color: #fff;
  width: 100%;
  padding: 10px 0;
  outline: none;
  border: none;
  cursor: pointer;
  &:hover {
    background: #ff8c00;
  }
  &:focus {
    background-color: #ff8c00;
  }
}
</style>

