<template>
  <div class="water_instrument">
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
  import { scroNum } from '@/utils/index'

  export default {
    name: "JxWater",
    data(){
      return {
        Ids:''//随机生成ID 用于寻找dom节点
      }
    },
    methods:{
      setNumber(num){//滚动数字
        scroNum(this.Ids,num)
      },
      randomNum(m,n){
        return 'team_data'+Math.floor(Math.random()*(m - n) + n);
      }
    },
    mounted() {
      this.Ids = this.randomNum(0,10000)
    }
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
      .team_data{
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

    }
    .number {
      margin: 65px 0 0 0;
      color: #30777B;
      font: normal 14px 'Microsoft YaHei';
    }
    h3{font: bold 14px "Microsoft YaHei";margin: 0px;color: #666666;}
    .inrow{font-size:0;;*font-size:0;font-family:arial;*letter-spacing:normal;*word-spacing:-1px;}
    .inrow>div,.inrow>a{display:inline-block;letter-spacing:normal;word-spacing:normal; }
    .dataOne{position:relative;  width:28px; height:32px; overflow:hidden;border: solid 1px #CCCCCC;border-right: 0;}
    .dataOne:last-child{border-right: solid 1px #ccc}
    .dataOne .tt{position:absolute;width:100%;height:100%;top:0;left:0;}
    .tt span{display:block; height:32px; font:normal 24px 'Calibri'; text-align:center;  color: #666666; }
  }
</style>
