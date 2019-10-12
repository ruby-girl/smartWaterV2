<template>
  <div class="meter_modular" :gutter="20">
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
            <el-input v-model="param.ReadNum" placeholder="按[enter]键确定" @keyup.enter.native="getWaterPredict()" onkeyup="value=value.replace(/\D/g,'')"></el-input>
          </div>
          <el-input class="meter_remark" placeholder="请输入内容" v-model="param.Remark">
              <template slot="prepend">备注：</template>
          </el-input>
          <el-row style="width: 100%">
            <el-col :span="20">
              <el-checkbox-group v-model="checks">
                <el-checkbox label="字轮是否翻页" name="type"></el-checkbox>8
                <el-checkbox label="自动载入下一户" name="type"></el-checkbox>
                <el-checkbox label="异常倍率" name="type">
                  异常倍率&nbsp;&nbsp;&nbsp;<el-select v-model="magnification" placeholder="请选择" size="mini" :disabled="checks.indexOf('异常倍率')!='-1'? false:true">
                    <el-option label="1.5" value="1.5"/>
                    <el-option label="2" value="2"/>
                    <el-option label="2.5" value="2.5"/>
                  </el-select>
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="4">
              <el-button style="float: right" type="primary" size="small" @click="getCheck()">确定</el-button>
            </el-col>
          </el-row>
      </div>
    </div>
    <div class="meter_forms">
      <p class="plan_box1 plan_box2 clearfix">
        <a>表册：<label style="color: #777C82;font-size: 14px">{{ meterData.BookName }}</label></a>
        <a>合计：<label style="color: #46494C">{{ meterData.TotalNum }}</label></a>
        <a>已抄：<label style="color: #00B3A1">{{ meterData.CompletedNum }}</label></a>
        <a>未抄：<label style="color: #FF3D3D">{{ meterData.UnCompletedNum }}</label></a>
      </p>
      <div class="plan_box3">
        <h2>水量水费预估</h2>
        <el-row>
          <el-col :span="8" class="unit">
            1阶单价：<span>20</span> <label>元/吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水量：<label>20 吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水费：<i>20</i> <label>元</label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="unit">
            1阶单价：<span>20</span> <label>元/吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水量：<label>20 吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水费：<i>20</i> <label>元</label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="unit">
            1阶单价：<span>20</span> <label>元/吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水量：<label>20 吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水费：<i>20</i> <label>元</label>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="unit">
            1阶单价：<span>20</span> <label>元/吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水量：<label>20 吨</label>
          </el-col>
          <el-col :span="8" class="unit">
            1阶水费：<i>20</i> <label>元</label>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import { getReading, WaterYieldPricePredict } from "@/api/meterReading"
  import Bus from '@/utils/bus'

  export default {
    name: "MeterPlan",
    data() {
      return {
        checks:[],
        meterData: {},
        meterPlan:'',//抄表计划
        currentContract:{},//当前选中信息
        param:{//抄表及水量水费参数
          SA_MeterRecord_Id : '' ,//抄表记录ID
          ReadDate : new Date() ,//抄表时间
          ReadNum : '' ,//本次读书
          Remark : '' ,
          IsPage : false
        },
        magnification:''//倍率
      }
    },
    methods:{
      getCheck(){//抄表
        getReading(this.param).then(res => {
          if (res.code ==0 ) {
            console.log(res)
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      getWaterPredict(){//获取水量水费数据
        if(typeof(this.currentContract.CustomerNo)!="undefined"&&this.currentContract.CustomerNo !=''){
          let curNum = this.param.ReadNum//本次读书
          if(curNum !=''){
            if(this.checks.indexOf('字轮是否翻页')=='-1'){//当未勾选字轮翻页,判断本次读书必须大于上次读书
              this.param.IsPage = false
              if(this.currentContract.LastReadNum >= curNum){
                this.$message({
                  message: '本次读书必须大于上次读书',
                  type: 'warning',
                  duration: 4000
                });
              }else{
                this.getPrice()//调用获取水量水费方法，以下同上
              }
            }else{//当选择字轮翻页时，上次读数一定比本次读数大，若上次读数为0，第一次就不予处理
              this.param.IsPage = true
              let lastWater = this.currentContract.LastYield //上次水量
              let totalNum ='',curWater = 0;//根据上次读数位数计算totalNum，本次水量
              for(let i=0;i<lastRead.length;i++){
                totalNum += "9"
              }
              let lastRead = this.currentContract.LastReadNum//上次读书
              if(lastRead>0&&lastRead>curNum){
                curWater = totalNum - lastRead + curNum

                if(checks.indexOf('异常倍率')!='-1'){//上次读数大于0，且勾选了异常倍率时候，进行本次预估倍率计算
                  let magnificate = curWater/lastWater //公式（本次水量/上次水量）
                  if(magnificate > this.magnification){//若预估结果大于等于用户所选倍率
                    this.$confirm("本次水量"+ curWater +"方，为上次水量"+ lastWater +"方的"+ magnificate +"倍，确认继续录入？", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      iconClass:"el-icon-question questionIcon",
                      customClass: "warningBox",
                      showClose: false
                    }).then(() => {
                      this.getPrice()
                    })
                  }
                }
              }else {
                this.$message({
                  message: '本次读书不能大于上次读书',
                  type: 'warning',
                  duration: 4000
                });
              }
            }
          }else{
            this.$message({
              message: '本次读书不能为空！',
              type: 'warning',
              duration: 4000
            });
          }
        }else {
          this.$message({
            message: '请选择用户！',
            type: 'warning',
            duration: 4000
          });
        }
      },
      getPrice(){
        WaterYieldPricePredict(this.param).then(res => {
          if (res.code ==0 ) {

          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      }
    },
    mounted() {
      var _this = this;
      Bus.$on('msg',(e) =>{//从兄弟组件接收抄表计划名称
        _this.meterPlan = e
        _this.param.SA_MeterRecord_Id = e.Id
      })
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
      span {
        color: #777C82;font-size: 13px;
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
      >div {width: 50%;float: left}
      .meter_remark {
        width: 100%;margin: 10px 0 16px 0;
        .el-input-group__prepend{padding: 0 5px 0 0;color: #777C82;font: normal 14px 'Microsoft YaHei';border: none;}
      }
    }
    .meter_box {
      display: flex;
      p{width: 90px;background: #F0F2F5;text-align: center;font: normal 13px 'Microsoft YaHei';color: #777C82;margin: 0;border: solid 1px #D8E2E7}
      .el-input{flex: 1;}
      .el-input--medium .el-input__inner{border-radius: 0;}
    }
    .meter_box1{
      .el-input--medium .el-input__inner{height: 30px;border-bottom: none;}
      .el-input--medium .el-input__icon{line-height: 30px;}
      p{height: 30px;line-height: 30px;border-bottom: none;border-right: none;}
    }
    .meter_box2{
      .el-input--medium .el-input__inner{height: 53px;}
      .el-input--medium .el-input__icon{line-height: 53px;}
      p{height: 53px;line-height: 53px;border-right: none;}
    }
    .meter_box3{
      .el-input--medium .el-input__inner{height: 84px;color: #00B3A1;font-size: 34px;}
      .el-input--medium .el-input__icon{line-height: 84px;}
      p{height: 84px;line-height: 84px;border-right: none;border-left: none;}
    }
    .plan_box2{
      padding: 14px 0;
      a{
        width: 25%;
        font-size: 14px;
        label{font-size: 16px;color: #777C82}
      }
    }
    .plan_box3{
      background: #fff;padding: 0 18px 20px 18px;margin-top: 13px;height: 172px;overflow: auto;position: relative;
      h2{color: #777C82;font-size: 20px;padding: 16px 0 10px 0;margin: 0;}
      /*>a{font-size: 14px;color: #00B3A1;position: absolute;top: 10px;right: 25px;}*/
    }
    .unit{color: #777C82;font: normal 14px/38px 'Microsoft YaHei' ;
      span{color: #33B300}
      label{color: #46494C}
      i{color: #FF3D3D;font: normal 20px 'Microsoft YaHei'}
    }
    .unit:nth-child(2){text-align: center}
    .unit:nth-child(3){text-align: right}
  }
</style>

