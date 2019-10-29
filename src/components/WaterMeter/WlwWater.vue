<template>
    <div class="wlw_Water">
         <p class="top_num">
              123567
           <label>m³</label>
         </p>
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
        name: "WlwWater"
    }
</script>

<style scoped lang="scss">
    .wlw_Water {
      text-align: center;
      float: left;
      width: 348px;
      height: 462px;
      background: url("../../assets/imgs/water1.jpg") no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
      margin: 0 108px 0 48px;
      position: relative;
      .top_num {
        background: #fdf7d5;
        width: 200px;
        display: inline-block;
        font-size: 44px;
        color: #4C4C4C;
        font-family: 'numFont';
        padding: 5px 10px;
        margin-top: 33px;
        border-radius: 5px;
        text-align: left;
        position: relative;
        label {position: absolute;font: normal 18px 'Microsoft YaHei';right: 10px;bottom: 10px;}
      }
      .water_num {
        position: relative;
        p {
          display: inline-block;
          background: #fff;
          border: solid 1px #4da6b6;
          padding: 8px 10px;
          border-radius: 4px;
          margin: 0 5px;
        }

        label {
          font: normal 17px 'Arial';
          color: #666666;
          position: absolute;
          bottom: 5px;
        }

        span {
          font: normal 18px 'Calibri';
          color: #666666;
          display: inline-block;
          border: solid 1px #CCCCCC;
          padding: 0 3px;
        }
      }

      .number {
        margin: 40px 0 4px 0px;
        color: #30777B;
        font: normal 12px 'Microsoft YaHei';
      }
      h3{font: bold 12px "Microsoft YaHei";margin: 0px;color: #666666;}

    }
</style>
