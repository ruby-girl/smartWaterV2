<template>
  <div class="IC_container">
    <div class="left_content">
      <div class="card_Info card_Info1">
        <h3>
          读卡信息
          <el-button @click="getReadCard" class="fr" size="small" type="success" style="background: #75C200;border: solid 1px #75C200"><i
            class="iconfont iconduka-" style="font-size: 12px;margin-right: 5px;"></i>读卡
          </el-button>
        </h3>
        <el-form ref="form" :model="form" label-width="65px">
          <el-form-item label="产品类型">
            <el-select v-model="form.type" placeholder="" :disabled="true">
              <el-option label="一代水表" value="1"></el-option>
              <el-option label="二代水表" value="2"></el-option>
              <el-option label="未知卡" value="254"></el-option>
              <el-option label="新卡（空卡）" value="155"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡片类型">
            <el-select v-model="form.cardType" placeholder="" :disabled="true">
              <el-option label="未知类型" value="99"></el-option>
              <el-option label="时间卡" value="5"></el-option>
              <el-option label="设置卡" value="6"></el-option>
              <el-option label="恢复卡" value="2"></el-option>
              <el-option label="检查卡" value="3"></el-option>
              <el-option v-show="form.type==2" label="管理卡" value="4"></el-option>
              <el-option v-show="form.type==2" label="换表卡" value="7"></el-option>
              <el-option label="未刷卡用户卡" value="0"></el-option>
              <el-option label="已刷卡用户卡" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="card_Info card_Info2">
        <h3>卡片内容</h3>
        <!--时间卡-->
        <div v-show="cardContType==5" class="cardContBox">
          <p>
            <span>年：{{cardCont.Year}}</span>
          </p>
          <p>
            <span>月：{{cardCont.Month}}</span>
          </p>
          <p>
            <span>日：{{cardCont.Day }}</span>
          </p>
          <p>
            <span>时：{{cardCont.Hour }}</span>
          </p>
          <p>
            <span>分：{{cardCont.Minute }}</span>
          </p>
          <p>
            <span>秒：{{cardCont.Second }}</span>
          </p>
        </div>
        <!--设置卡-->
        <div v-show="cardContType==6" class="cardContBox">
          <p>
            <span>透支量：</span>{{ cardCont.OverdraftAmount }}（元）
          </p>
          <p>
            <span>预存量：</span>{{ cardCont.RechargeMoney }}（元）
          </p>
          <p>
            <span>报警量：</span>{{ cardCont.InsufficientAmountTips }}（元）
          </p>
          <p>
            <span>第二阶梯起始量：</span>{{ cardCont.SecondAmount }}（吨）
          </p>
          <p>
            <span>第三阶梯起始量：</span>{{ cardCont.ThirdAmount }}（吨）
          </p>
          <p>
            <span>第一阶梯价格：</span>{{ cardCont.FirstPrice }}（元）
          </p>
          <p>
            <span>第二阶梯价格：</span>{{ cardCont.SecondPrice }}（元）
          </p>
          <p>
            <span>第三阶梯价格：</span>{{ cardCont.ThreePrice }}（元）
          </p>
        </div>
        <!--用户未刷卡-->
        <div v-show="cardContType==0" class="cardContBox">
          <p>
            <span>卡号：</span>{{ cardCont.CardNo }}
          </p>
          <p>
            <span>充值次数：</span>{{ cardCont.RechargeCount }}（次）
          </p>
          <p>
            <span>充值金额：</span>{{ cardCont.RechargeMoney }}（元）
          </p>
          <p>
            <span>水表口径：</span>{{ cardCont.MeterDiameter }}
          </p>
          <p>
            <span>第二阶梯量：</span>{{ cardCont.SecondAmount }}（吨）
          </p>
          <p>
            <span>第三阶梯量：</span>{{ cardCont.ThirdAmount }}（吨）
          </p>
          <p>
            <span>第一阶梯价格：</span>{{ cardCont.FirstPrice }}（元）
          </p>
          <p>
            <span>第二阶梯价格：</span>{{ cardCont.SecondPrice }}（元）
          </p>
          <p>
            <span>第三阶梯价格：</span>{{ cardCont.ThirdPrice }}（元）
          </p>
          <p>
            <span>量不足提示：</span>{{ cardCont.InsufficientAmountTips }}（元）
          </p>
        </div>
        <!--用户已刷卡-->
        <div v-show="cardContType==1" class="cardContBox">
          <p>
            <span>卡号：</span>{{ cardCont.CardNo }}
          </p>
          <p>
            <span>当月用水量：</span>{{ cardCont.ThisMonthUse }}
          </p>
          <p>
            <span>前一月用水量：</span>{{ cardCont.BeforeOneUse }}
          </p>
          <p>
            <span>前2月用水量：</span>{{ cardCont.BeforeTwoUse }}
          </p>
          <p>
            <span>前3月用水量：</span>{{ cardCont.BeforeThreeUse }}
          </p>
          <p>
            <span>前4月用水量：</span>{{ cardCont.BeforeFourUse }}
          </p>
          <p>
            <span>前5月用水量：</span>{{ cardCont.BeforeFiveUse }}
          </p>
          <p>
            <span>是否欠压：</span>{{ cardCont.IsBrown?'是':'否' }}
          </p>
          <p>
            <span>是否强磁：</span>{{ cardCont.IsMagnetic?'是':'否' }}
          </p>
        </div>
      </div>
    </div>
    <div class="right_content">
      <leftCont ref="leftChild"></leftCont>
      <rightCont ref="rightChild"></rightCont>
    </div>
  </div>
</template>

<script>
  import leftCont from './components/leftContent'
  import rightCont from './components/rightCont'
  import { GetSetReadCardInfo, GetWaterPropertyList } from "@/api/userSetting";
  import { promptInfoFun } from "@/utils/index"

  export default {
    components:{leftCont, rightCont },
    name: "ICConfig",
    data(){
      return {
        screenWidth:0,
        form: {
          type: '1',
          cardType:'5'
        },
        cardCont:'',
        cardContType:-1
      }
    },
    methods:{
      getReadCard() {//IC卡设置读卡
        try {
          if (FXYB_WEB_CS_ICCard) {
            let res = window.FXYB_WEB_CS_ICCard.ReadCardInfo();
            if (res != undefined && res != "") {
              let rJSON = JSON.parse(res)
              if (rJSON.Result) {
                GetSetReadCardInfo({jsonData: rJSON.Data}).then(res => {
                  let data,cardsType;
                  let types = res.data.ProductType
                  this.form.type = types.toString()
                  switch (types) {
                    case 1:
                      data = res.data.ProductOneModel
                      cardsType = data.CardType
                      break
                    case 2:
                      data = res.data.ProductTwoModel
                      cardsType = data.CardType
                      break
                    case 254:
                      cardsType = 99
                      break
                    case 255:
                      cardsType = 99
                      break
                  }
                  this.cardContType = cardsType
                  this.form.cardType = cardsType.toString()
                  if (cardsType == 5) {//时间卡
                    this.cardCont = data.TimeCard
                  } else if (cardsType == 6) {//设置卡
                    this.cardCont = data.SettingCard
                  }else if(cardsType==0){//用户未刷卡
                    this.cardCont = data.UserCard
                  }else if(cardsType==1){//用户已刷卡
                    this.cardCont = data.UserCardCredited
                  }else {
                    this.cardCont = ''
                  }
                })
              }
            }
          }
        } catch (e) {
          promptInfoFun(this, 1, '请在CS端操作');
          return
        }
      },
      getWaterInfo() {
        GetWaterPropertyList().then(res => {
          this.$refs.leftChild.waterProperty = res.data;
          this.$refs.rightChild.waterProperty = res.data;

          this.$refs.leftChild.param.usetWaterTypeId = res.data[0].Id;
          this.$refs.rightChild.param.usetWaterTypeId = res.data[0].Id;

        });
      }
    },
    mounted() {
      this.screenWidth = window.screen.width
      this.getWaterInfo()
    }
  }
</script>

<style lang="scss">
  .IC_container {
    .cardContBox{
      span{color: #606266}
      color: #333;
      font-size: 14px;
    }
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
    .right_content {
      overflow: auto;
      .company{ position: absolute;right: -18px;color: #535353;top: 0}
      position: relative;
      >div{width: 100%;background: #fff;margin-bottom: 10px;min-height: 280px;}
      flex: 1;
      -webkit-flex: 1;
      .right_line {
        overflow: hidden;
        padding: 18px 16px;
        position: relative;
        h3 {font: bold 16px 'Microsoft-YaHei';color: #535353;margin: 0;}
        p{ width: 160px;height: 40px;background: #6DA783;font: normal 16px/40px 'Microsoft-YaHei';color: #fff;
          position: absolute;right: 0;top: 10px;margin: 0;text-align: center;border-bottom-left-radius: 30px;border-top-left-radius: 30px;
        }
      }
      ul{ border-bottom: solid 1px #D9D9D9;padding: 20px 0 15px 0;margin-bottom: 24px;}
      .btn_sure{display: block;text-align: center;margin-bottom: 0;margin-top: 20px;}
    }
  }
</style>
