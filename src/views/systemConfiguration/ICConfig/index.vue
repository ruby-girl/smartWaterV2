<template>
  <div class="IC_container">
    <div class="left_content">
      <div class="card_Info card_Info1">
        <h3>
          读卡信息
          <el-button class="fr" size="small" type="success" style="background: #75C200;border: solid 1px #75C200"><i
            class="iconfont iconduka-" style="font-size: 12px;margin-right: 5px;"></i>读卡
          </el-button>
        </h3>
        <el-form ref="form" :model="form" label-width="65px">
          <el-form-item label="产品类型">
            <el-select v-model="form.name" placeholder="">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡片类型">
            <el-select v-model="form.name" placeholder="">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="card_Info card_Info2">
        <h3>卡片内容</h3>
      </div>
    </div>
    <div class="right_content">
      <leftCont :class="screenWidth < 1600? 'widthScreen':''"></leftCont>
      <rightCont :class="screenWidth < 1600? 'widthScreen':''"></rightCont>
    </div>
  </div>
</template>

<script>
  import leftCont from './components/leftContent'
  import rightCont from './components/rightCont'

  export default {
    components:{leftCont, rightCont },
    name: "ICConfig",
    data(){
      return {
        screenWidth:0,
        form: {
          name: ""
        }
      }
    },
    mounted() {
      this.screenWidth = window.screen.width
    }
  }
</script>

<style lang="scss">
  .IC_container {
    li.on {color: #fff;background: #00B2A1;border: solid 1px #00B2A1;}
    li {list-style-type: none;float: left;font: normal 16px/46px 'Microsoft-YaHei';color: #777C82;margin-right: 16px;width: 130px;height: 46px;text-align: center;border: solid 1px #BBC2CC;
      i{margin-right: 10px;font-size: 18px;}border-radius: 5px;cursor: pointer;margin-bottom: 10px;
    }
    display: flex;
    position: relative;
    width: calc(100% - 20px);
    height: calc(100% - 10px);
    margin: 10px 10px 0 10px;

    .left_content {
      padding: 10px;
      background: #fff;
      width: 280px;
      height: 100%;
      margin-right: 10px;
      .el-form-item__content .el-input__inner {width: 165px !important;}
      .el-form-item {margin-bottom: 10px;}
      .card_Info1{height: 150px;}
      .card_Info2{height: calc(100% - 160px);}
      .card_Info {
        padding: 8px 15px;
        background: #f5f5f5;
        margin-bottom: 10px;

        h3 {
          margin: 8px 0 15px 0;
          font: bold 16px/34px 'Microsoft-YaHei';
          color: #535353;
        }
      }
    }
    .widthScreen {width: 100% !important;}
    .right_content {
      overflow: auto;
      .company{ position: absolute;right: -18px;color: #535353;top: 0}
      position: relative;
      >div{width: calc(100% - 20%);background: #fff;margin-bottom: 10px;min-height: 280px;}
      flex: 1;
      -webkit-flex: 1;
      .right_line {
        overflow: hidden;
        padding: 18px 16px;
        position: relative;
        h3 {font: bold 16px 'Microsoft-YaHei';color: #535353;margin: 0;}
        p{ width: 128px;height: 40px;background: #6DA783;font: normal 14px/40px 'Microsoft-YaHei';color: #fff;
          position: absolute;right: 0;top: 10px;margin: 0;text-align: center;border-bottom-left-radius: 30px;border-top-left-radius: 30px;
        }
      }
      ul{ border-bottom: solid 1px #D9D9D9;padding-bottom: 15px;padding-left: 0;}
      .btn_sure{display: block;text-align: center;margin-bottom: 0;margin-top: 20px;}
    }
  }
</style>
