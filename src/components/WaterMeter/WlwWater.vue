<template>
  <div class="wlw_Water">
    <p class="top_num">
      <span ref="dzNum">1</span><span style="font-size: 36px">{{"."+decimalNum}}</span>
      <label>m³</label>
    </p>
    <p class="number">No.1010701140027</p>
    <div class="water_num">
      <div :id="Ids" class="team_data inrow" >
        <div class="dataOne">
          <div class="tt" t="0">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </div>
        </div>
        <!--第1个数字结束;-->
        <div class="dataOne">
          <div class="tt" t="0">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </div>
        </div>
        <!--第2个数字结束-->
        <div class="dataOne">
          <div class="tt" t="0">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </div>
        </div>
        <!--第3个数字结束-->
        <div class="dataOne">
          <div class="tt" t="0">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </div>
        </div>
        <!--第4个数字结束-->
        <div class="dataOne">
          <div class="tt" t="0">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </div>
        </div>
        <!--第5个数字结束-->
        <div class="dataOne">
          <div class="tt" t="0">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </div>
        </div>
        <!--第6个数字结束-->
      </div>
      <label>m³</label>
    </div>
    <h3>四川府星仪表有限公司</h3>
  </div>
</template>

<script>
  import { scroNum, numRunFun } from '@/utils/index'

  export default {
    name: "WlwWater",
    data(){
      return {
        Ids:'',
        decimalNum:''
      }
    },
    methods:{
      setNumber(num){
         let obj = this.$refs.dzNum
         let scrollNum = parseInt(num.toString().replace(/\./g,''))//过滤小数点 按整数显示滚动字幕
         scroNum(this.Ids,scrollNum)

          let s = this.toDecimal(num)
          let b = s.split(".");
          let integerNum = b[0];
          let decimalNum = b[1];
         this.decimalNum = decimalNum
         numRunFun(obj,integerNum)
      },
      randomNum(m,n){
        return 'team_data'+Math.floor(Math.random()*(m - n) + n);
      },
      toDecimal(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
          return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
     }
    },
    mounted() {
      this.Ids = this.randomNum(0,10000)
    }
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

      label {
        position: absolute;
        font: normal 18px 'Microsoft YaHei';
        right: 10px;
        bottom: 10px;
      }
    }
    .water_num {
      position: relative;
      .team_data{
        display: inline-block;
        background: #fff;
        border: solid 1px #00B3A1;
        padding: 10px 12px;
        border-radius: 5px;
        margin: 0 5px;
      }
      .dataOne:last-child{border-right: solid 1px #ccc;}
      label {
        font: normal 17px 'Arial';
        color: #666666;
        position: absolute;
        bottom: 5px;
      }

    }
    .number {
      margin: 40px 0 4px 0px;
      color: #30777B;
      font: normal 12px 'Microsoft YaHei';
    }

    h3 {
      font: bold 12px "Microsoft YaHei";
      margin: 0px;
      color: #666666;
    }
    .inrow{font-size:0;;*font-size:0;font-family:arial;*letter-spacing:normal;*word-spacing:-1px;}
    .inrow>div,.inrow>a{display:inline-block;letter-spacing:normal;word-spacing:normal; }
    .dataOne{position:relative;  width:28px; height:32px; overflow:hidden;border: solid 1px #CCCCCC;border-right: 0;}
    .dataOne .tt{position:absolute;width:100%;height:100%;top:0;left:0;}
    .tt span{display:block; height:32px; font:normal 24px 'Calibri'; text-align:center;  color: #666666; }
  }
</style>
