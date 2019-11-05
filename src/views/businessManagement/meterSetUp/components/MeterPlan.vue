<template>
  <div>
    <!--1920 分辨率-->
    <div class="meter_modular" :gutter="20" v-if="screeWidth>1400">
      <div class="plan_box">
        <p class="plan_box1 clearfix">
          <a style="text-align: left"><span>抄表计划：</span>{{ meterPlan.Name }}</a>
          <a><span>用户编码：</span>{{ currentContract.CustomerNo }}</a>
          <a style="text-align: right"><span>姓名：</span>{{ currentContract.CustomerName }}</a>
        </p>
        <div class="meter_nums clearfix">
          <div>
            <div class="meter_box meter_box1">
              <p>抄表日期</p>
              <el-date-picker
                v-model="param.ReadDate"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="meter_box meter_box2">
              <p>上次读书</p>
              <el-input v-model="currentContract.LastReadNum" :disabled="true"></el-input>
            </div>
          </div>
          <div class="meter_box meter_box3">
            <p>本次读书</p>
            <el-input v-model="param.ReadNum" placeholder="按[enter]键确定" ref="ReadNumInput"
                      @keyup.enter.native="getWaterPredict(1)" onkeyup="value=value.replace(/\D/g,'')"></el-input>
          </div>
          <el-input class="meter_remark" placeholder="请输入内容" v-model="param.Remark">
            <template slot="prepend">备注：</template>
          </el-input>
          <el-row style="width: 100%">
            <el-col :span="20">
              <el-checkbox-group v-model="checks">
                <el-checkbox label="字轮是否翻页" name="type"></el-checkbox>
                8
                <el-checkbox label="自动载入下一户" name="type"></el-checkbox>
                <el-checkbox label="异常倍率" name="type">
                  异常倍率&nbsp;&nbsp;&nbsp;<el-select v-model="magnification" placeholder="请选择" size="mini"
                                                   :disabled="checks.indexOf('异常倍率')!='-1'? false:true">
                  <el-option label="1.5" value="1.5"/>
                  <el-option label="2" value="2"/>
                  <el-option label="2.5" value="2.5"/>
                </el-select>
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="4">
              <el-button style="float: right" type="primary" size="small" @click="getWaterPredict(2)">确定</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="meter_forms">
        <p class="plan_box1 plan_box2 clearfix">
          <a>表册：<label style="color: #777C82;font-size: 14px;cursor:pointer;" :title="meterData.BookName">{{ meterData.BookName }}</label></a>
          <a>合计：<label style="color: #46494C">{{ meterData.TotalNum }}</label></a>
          <a>已抄：<label style="color: #00B3A1">{{ meterData.CompletedNum }}</label></a>
          <a>未抄：<label style="color: #FF3D3D">{{ meterData.UnCompletedNum }}</label></a>
        </p>
        <div class="plan_box3">
          <h2>水量水费预估</h2>
          <el-row v-for="(item,index) in temp.ladder.slice(0,temp.LadderNumber)" :key="index" v-if="ifLadder">
            <el-col :span="8" class="unit">
              {{index + 1}}阶单价：<span>{{ item.LadderPrice || 0}}</span> <label>元/吨</label>
            </el-col>
            <el-col :span="8" class="unit">
              {{index + 1}}阶水量：<label>{{ item.LadderWaterNum || 0}} 吨</label>
            </el-col>
            <el-col :span="8" class="unit">
              {{index + 1}}阶水费：<i>{{ item.TotalPrice || 0}}</i> <label>元</label>
            </el-col>
          </el-row>

          <el-row v-else>
            <el-col :span="8" class="unit">
              单价：<span>{{ oneLadder.TotalPrice || 0}}</span> <label>元/吨</label>
            </el-col>
            <el-col :span="8" class="unit">
              水量：<label>{{ oneLadder.TotalWaterYield || 0}} 吨</label>
            </el-col>
            <el-col :span="8" class="unit">
              水费：<i>{{ oneLadder.TotalWaterPrice || 0}}</i> <label>元</label>
            </el-col>
          </el-row>

        </div>
      </div>
    </div>
    <!--低分辨率-->
    <div class="meter_Small" v-else>
      <div class="meter_left">
        <ul>
          <li><label>抄表计划</label><span>{{ meterPlan.Name }}</span></li>
          <li><label>用户编号</label><span>232323</span></li>
          <li><label>姓名</label><span>232323</span></li>
          <li><label>表册</label><span>{{ meterData.BookName || '-'}}</span></li>
          <li><label>合计</label><span>{{ meterData.TotalNum || '-'}}</span></li>
          <li><label>已抄</label><span style="color: #00B3A1">{{ meterData.CompletedNum || '-'}}</span></li>
          <li><label>未抄</label><span style="color: #FF3D3D">{{ meterData.UnCompletedNum || '-'}}</span></li>
        </ul>
        <div class="water_box">
          <h3 @click="getShrink(0)">水量水费预估</h3>
          <div id="water_hide">
            <el-row v-for="(item,index) in temp.ladder.slice(0,temp.LadderNumber)" :key="index" v-if="ifLadder">
              <el-col :span="8" class="unit">
                {{index + 1}}阶单价：<span>{{ item.LadderPrice || 0}}</span> <label>元/吨</label>
              </el-col>
              <el-col :span="8" class="unit">
                {{index + 1}}阶水量：<label>{{ item.LadderWaterNum || 0}} 吨</label>
              </el-col>
              <el-col :span="8" class="unit">
                {{index + 1}}阶水费：<i>{{ item.TotalPrice || 0}}</i> <label>元</label>
              </el-col>
            </el-row>

            <el-row v-else>
              <el-col :span="8" class="unit">
                单价：<span>{{ oneLadder.TotalPrice || 0}}</span> <label>元/吨</label>
              </el-col>
              <el-col :span="8" class="unit">
                水量：<label>{{ oneLadder.TotalWaterYield || 0}} 吨</label>
              </el-col>
              <el-col :span="8" class="unit">
                水费：<i>{{ oneLadder.TotalWaterPrice || 0}}</i> <label>元</label>
              </el-col>
            </el-row>
            <a @click="getShrink(1)">收起</a>
          </div>
        </div>
      </div>
      <div class="meter_nums clearfix">
        <div>
          <div class="meter_box meter_box1">
            <p>抄表日期</p>
            <el-date-picker
              v-model="param.ReadDate"
              type="datetime"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="meter_box meter_box2">
            <p>上次读书</p>
            <el-input v-model="currentContract.LastReadNum" :disabled="true"></el-input>
          </div>
        </div>
        <div class="meter_box meter_box3">
          <p>本次读书</p>
          <el-input v-model="param.ReadNum" ref="ReadNumInput" placeholder="按[enter]键确定"
                    @keyup.enter.native="getWaterPredict(1)"></el-input>
        </div>
        <el-input class="meter_remark" placeholder="请输入内容" v-model="param.Remark">
          <template slot="prepend">备注：</template>
        </el-input>
        <el-row style="width: 100%">
          <el-col :span="20">
            <el-checkbox-group v-model="checks">
              <el-checkbox label="字轮是否翻页" name="type"></el-checkbox>
              8
              <el-checkbox label="自动载入下一户" name="type"></el-checkbox>
              <el-checkbox label="异常倍率" name="type">
                异常倍率&nbsp;&nbsp;&nbsp;<el-select v-model="magnification" placeholder="请选择" size="mini"
                                                 :disabled="checks.indexOf('异常倍率')!='-1'? false:true">
                <el-option label="1.5" value="1.5"/>
                <el-option label="2" value="2"/>
                <el-option label="2.5" value="2.5"/>
              </el-select>
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col :span="4">
            <el-button style="float: right" type="primary" size="small" @click="getWaterPredict(2)">确定</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {getReading, WaterYieldPricePredict} from "@/api/meterReading"
  import Bus from '@/utils/bus'
  import {ladderChangeArr, promptInfoFun} from '@/utils/index'

  export default {
    name: "MeterPlan",
    data() {
      return {
        checks: ['自动载入下一户'],
        meterData: {},
        meterPlan: '',//抄表计划
        currentContract: {},//当前选中信息
        param: {//抄表及水量水费参数
          SA_MeterRecord_Id: '',//抄表记录ID
          ReadDate: new Date(),//抄表时间
          ReadNum: '',//本次读书
          Remark: '',
          IsPage: false
        },
        magnification: '1.5',//倍率,
        temp: {
          LadderNumber: 3,
          ladder: [
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0},
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0},
            {'LadderPrice': 0, 'LadderWaterNum': 0, 'TotalPrice': 0}
          ]
        },//启用阶梯时水量水费值
        oneLadder: {//没有启用阶梯水量水费值
          TotalPrice: 0,
          TotalWaterYield: 0,
          TotalWaterPrice: 0,
        },
        ifLadder: true,
        screeWidth: ''
      }
    },
    methods: {
      getShrink(type) {
        type == 0 ? document.getElementById('water_hide').style.width = 575 + 'px' : document.getElementById('water_hide').style.width = 0 + 'px';
      },
      getCheck(param) {//抄表
        getReading(param).then(res => {
          if (res.code == 0) {
            promptInfoFun(this, 2, res.message)
            this.param.ReadNum = ''
            this.checks.indexOf('自动载入下一户') == '-1' ? this.$refs.ReadNumInput.$el.querySelector('input').focus() : this.$parent.nextPageFun(true);
          } else {
            promptInfoFun(this, 1, res.message)
          }
        })
      },
      getWaterPredict(type) {//获取水量水费数据,type为1时候请求水费水量预估接口，为2时候请求抄表接口
        this.param.SA_MeterRecord_Id = this.currentContract.Id
        let lastWater = this.currentContract.LastYield, curWater = 0 //上次水量
        if (typeof (this.currentContract.CustomerNo) != "undefined" && this.currentContract.CustomerNo != '') {
          let curNum = this.param.ReadNum//本次读书
          if (curNum != '') {
            let params = Object.assign({}, this.param);//赋值对象转换参数类型
            params.ReadNum != '' ? params.ReadNum = parseInt(params.ReadNum) : ''
            if (this.checks.indexOf('字轮是否翻页') == '-1') {//当未勾选字轮翻页,判断本次读书必须大于上次读书
              this.param.IsPage = false
              if (this.currentContract.LastReadNum >= curNum) {
                promptInfoFun(this, 1, '本次读数必须大于上次读数！')
              } else {
                curWater = this.param.ReadNum - this.currentContract.LastReadNum//本次水量= 本次读书-上次读书
                let magnificate = curWater / lastWater //公式（本次水量/上次水量）
                if (type === 2) {
                  this.getMagnificate(magnificate,curWater,lastWater,params)//抄表
                } else {
                  this.getPrice(params)//水量水费预估
                }
              }
            } else {//当选择字轮翻页时，上次读数一定比本次读数大，若上次读数为0，第一次就不予处理
              this.param.IsPage = true
              let totalNum = '';//根据上次读数位数计算totalNum，本次水量
              let lastRead = this.currentContract.LastReadNum//上次读书
              for (let i = 0; i < JSON.stringify(lastRead).length; i++) {
                totalNum += "9"
              }
              if (lastRead > 0 && lastRead > curNum) {

                curWater = parseInt(totalNum) - lastRead + parseInt(curNum) + 1 //本次水量 = 总数 - 上次读书 + 本次读书 + 1;例：上次读数12345，本次读数为10，则本次水量为99999 – 12345 + 10 + 1
                let magnificate = curWater / lastWater //公式（本次水量/上次水量）
                if (type === 2) {
                  this.getMagnificate(magnificate,curWater,lastWater,params)//抄表
                } else {
                  this.getPrice(params)//水量水费预估
                }
              } else {
                promptInfoFun(this, 1, '本次读数需小于上次读数！')
              }
            }
          } else {
            promptInfoFun(this, 1, '本次读数不能为空！')
          }
        } else {
          promptInfoFun(this, 1, '请选择用户！')
        }
      },
      getPrice(param) {//水费水量
        WaterYieldPricePredict(param).then(res => {
          if (res.code == 0) {
            let oneData = {}
            this.ifLadder = res.data.IsLadder  //true 时为阶梯计价，需根据LadderNumber 字段计算到第几个阶梯
            if (this.ifLadder) {//启用阶梯
              this.temp = ladderChangeArr(res.data)//阶梯转换数组
            } else {//未启用阶梯
              oneData = {
                TotalPrice: res.data.TotalPrice,//合计单价
                TotalWaterYield: res.data.TotalWaterYield,//本次用水量
                TotalWaterPrice: res.data.TotalWaterPrice,//总水费
              }
              this.oneLadder = oneData
            }
          } else {
            promptInfoFun(this, 1, res.message)
          }
        })
      },
      getMagnificate(...param) {//预估水量异常倍率进行对比
        if (this.checks.indexOf('异常倍率') != '-1') {
          if (param[0] > this.magnification) {//若预估结果大于等于用户所选倍率
            this.$confirm("本次水量" + param[1] + "方，为上次水量" + param[2] + "方的" + param[0] + "倍，确认继续录入？", "提示", {
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              iconClass: "el-icon-question questionIcon",
              customClass: "warningBox",
              showClose: false
            }).then(() => {
              this.getCheck(param[3])
            })
          } else {
            this.getCheck(param[3])
          }
        } else {
          this.getCheck(param[3])
        }
      }
    },
    mounted() {
      this.screeWidth = window.screen.width
      var _this = this;
      Bus.$off('planName')
      Bus.$on('planName', (e) => {//从兄弟组件接收抄表计划名称
        _this.meterPlan = e
      })
    },
    beforeDestroy() {
      Bus.$off("planName");
    }
  }
</script>
<style lang="scss">
  .meter_modular {
    margin-top: 12px;
    height: 216px;

    > div {
      float: left
    }

    .plan_box {
      width: 60%;
      padding-right: 12px;;
    }

    .meter_forms {
      width: 40%;
    }

    .plan_box1 {
      background: #fff;
      margin: 0;
      padding: 12px 22px;
    }

    .plan_box1 a {
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      span {
        color: #777C82;
        font-size: 13px;
      }

      width: 33%;
      display: block;
      text-align: center;
      font: normal 13px 'Microsoft YaHei';
      color: #46494C;
      text-decoration: none;
      float: left;
    }

    .meter_nums {
      position: relative;
      padding: 0 22px 15px 22px;
      background: #fff;

      > div {
        width: 50%;
        float: left
      }

      .meter_remark {
        width: 100%;
        margin: 10px 0 16px 0;

        .el-input-group__prepend {
          padding: 0 5px 0 0;
          color: #777C82;
          font: normal 14px 'Microsoft YaHei';
          border: none;
        }
      }
    }

    .meter_box {
      display: flex;

      p {
        width: 90px;
        background: #F0F2F5;
        text-align: center;
        font: normal 13px 'Microsoft YaHei';
        color: #777C82;
        margin: 0;
        border: solid 1px #D8E2E7
      }

      .el-input {
        flex: 1;
      }

      .el-input--medium .el-input__inner {
        border-radius: 0;
      }
    }

    .meter_box1 {
      .el-input--medium .el-input__inner {
        height: 30px;
        border-bottom: none;
      }

      .el-input--medium .el-input__icon {
        line-height: 30px;
      }

      p {
        height: 30px;
        line-height: 30px;
        border-bottom: none;
        border-right: none;
      }
    }

    .meter_box2 {
      .el-input--medium .el-input__inner {
        height: 53px;
        font-size: 24px;
      }

      .el-input--medium .el-input__icon {
        line-height: 53px;
      }

      p {
        height: 53px;
        line-height: 53px;
        border-right: none;
      }
    }

    .meter_box3 {
      .el-input--medium .el-input__inner {
        height: 84px;
        color: #00B3A1;
        font-size: 34px;
        font-weight: bold;
      }

      .el-input--medium .el-input__icon {
        line-height: 84px;
      }

      p {
        height: 84px;
        line-height: 84px;
        border-right: none;
        border-left: none;
      }
    }

    .plan_box2 {
      padding: 14px 0;

      a {
        width: 25%;
        font-size: 14px;

        label {
          font-size: 16px;
          color: #777C82
        }
      }
    }

    .plan_box3 {
      background: #fff;
      padding: 0 18px 20px 18px;
      margin-top: 13px;
      height: 172px;
      overflow: auto;
      position: relative;

      h2 {
        color: #777C82;
        font-size: 20px;
        padding: 16px 0 10px 0;
        margin: 0;
      }

      /*>a{font-size: 14px;color: #00B3A1;position: absolute;top: 10px;right: 25px;}*/
    }

    .unit {
      color: #777C82;
      font: normal 14px/38px 'Microsoft YaHei';

      span {
        color: #33B300
      }

      label {
        color: #46494C
      }

      i {
        color: #FF3D3D;
        font: normal 20px 'Microsoft YaHei'
      }
    }

    .unit:nth-child(2) {
      text-align: center
    }

    .unit:nth-child(3) {
      text-align: right
    }
  }

  .meter_Small {
    display: flex;
    margin-top: 16px;
    padding: 16px;
    background: #fff;

    .meter_left {
      position: relative;
      width: 190px;

      ul {
        padding: 0 0 0 20px;
        margin: 0;
      }

      li {
        font-size: 14px;
        color: #777C82;
        list-style-type: none;
        margin-bottom: 10px;

        span {
          color: #46494C;
        }

        label {
          width: 85px;
          text-align: left;
          display: inline-block;
        }
      }
    }

    .meter_nums {
      flex: 1;
      position: relative;
      padding: 0 0px 15px 22px;

      > div {
        width: 50%;
        float: left
      }

      .meter_remark {
        width: 100%;
        margin: 30px 0 20px 0;

        .el-input-group__prepend {
          padding: 0 5px 0 0;
          color: #777C82;
          font: normal 14px 'Microsoft YaHei';
          border: none;
        }
      }
    }

    .meter_box {
      display: flex;

      p {
        width: 90px;
        background: #F0F2F5;
        text-align: center;
        font: normal 13px 'Microsoft YaHei';
        color: #777C82;
        margin: 0;
        border: solid 1px #D8E2E7
      }

      .el-input {
        flex: 1;
      }

      .el-input--medium .el-input__inner {
        border-radius: 0;
      }
    }

    .meter_box1 {
      .el-input--medium .el-input__inner {
        height: 30px;
        border-bottom: none;
      }

      .el-input--medium .el-input__icon {
        line-height: 30px;
      }

      p {
        height: 30px;
        line-height: 30px;
        border-bottom: none;
        border-right: none;
      }
    }

    .meter_box2 {
      .el-input--medium .el-input__inner {
        height: 53px;
      }

      .el-input--medium .el-input__icon {
        line-height: 53px;
      }

      p {
        height: 53px;
        line-height: 53px;
        border-right: none;
      }
    }

    .meter_box3 {
      .el-input--medium .el-input__inner {
        height: 84px;
        color: #00B3A1;
        font-size: 34px;
      }

      .el-input--medium .el-input__icon {
        line-height: 84px;
      }

      p {
        height: 84px;
        line-height: 84px;
        border-right: none;
        border-left: none;
      }
    }

    .plan_box2 {
      padding: 14px 0;

      a {
        font-size: 14px;

        label {
          font-size: 16px;
          color: #777C82
        }
      }
    }

    .plan_box3 {
      background: #fff;
      padding: 0 18px 20px 18px;
      margin-top: 13px;
      height: 172px;
      overflow: auto;

      h2 {
        color: #777C82;
        font-size: 20px;
        padding: 16px 0 10px 0;
        margin: 0;
      }
    }

    .unit {
      color: #777C82;
      font: normal 14px/30px 'Microsoft YaHei';
      padding-left: 20px;

      span {
        color: #33B300
      }

      label {
        color: #46494C
      }

      i {
        color: #FF3D3D;
        font: normal 20px/0px 'Microsoft YaHei'
      }
    }

    .water_box {
      position: absolute;
      bottom: 15px;
      left: -32px;
      background: #fff;
      box-shadow: 1px 1px 5px #c3c1c1;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      z-index: 99;
      display: flex;

      h3 {
        font: normal 16px/16px 'Microsoft YaHei';
        color: #777C82;
        cursor: pointer;
        width: 25px;
        text-align: center
      }

      #water_hide {
        padding: 20px 0;
        height: 128px;
        overflow: auto;
        width: 0;

        > a {
          font-size: 14px;
          color: #00B3A1;
          position: absolute;
          top: 5px;
          right: 25px;
        }
      }
    }
  }
</style>

