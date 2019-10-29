<template>
  <div class="water_instrument">
    <p class="number">No.1010701140027</p>
    <div class="water_num">
      <p>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </p>
      <label>m³</label>
    </div>
    <h3>四川府星仪表有限公司</h3>
  </div>
</template>

<script>
  export default {
    name: "JxWater"
  }
</script>

<style scoped lang="scss">
  .water_instrument {
    text-align: center;
    float: left;
    width: 410px;
    height: 410px;
    background: url("../../assets/imgs/water.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    margin: 0 77px 0 44px;
    position: relative;
    .water_num {
      position: relative;
      p {
        display: inline-block;
        background: #fff;
        border: solid 1px #00B3A1;
        padding: 10px 12px;
        border-radius: 5px;
        margin: 0 5px;
      }

      label {
        font: normal 24px 'Calibri';
        color: #666;
        position: absolute;
        bottom: 5px;
      }

      span {
        font: normal 24px 'Calibri';
        color: #666666;
        display: inline-block;
        border: solid 1px #CCCCCC;
        padding: 0 3px;
      }
    }
    .number {
      margin: 65px 0 0 0;
      color: #30777B;
      font: normal 14px 'Microsoft YaHei';
    }
    h3{font: bold 14px "Microsoft YaHei";margin: 0px;color: #666666;}
  }
</style>
