<template>
  <div class="right_line">
    <h3>选择制卡类型</h3>
    <p>W001(一代水表)</p>
    <ul class="clearfix">
      <li :class="clickNum==5?'on':''" @click="getClick(5)"><i class="iconfont iconshijian1"></i>时间卡</li>
      <li :class="clickNum==6?'on':''" @click="getClick(6)"><i class="iconfont iconshezhika"></i>设置卡</li>
      <li :class="clickNum==2?'on':''" @click="getClick(2)"><i class="iconfont iconhuifubeifen"></i>恢复卡</li>
      <li :class="clickNum==3?'on':''" @click="getClick(3)"><i class="iconfont iconjiancha"></i>检查卡</li>
    </ul>
    <el-form ref="param" :model="param" label-width="80px" :inline="true" :rules="rules">
      <el-form-item label="日期时间" v-if="clickNum==5" prop="dt">
        <el-date-picker
          v-model="param.dt"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="透支量" v-if="clickNum==6" prop="overdraftAmount">
        <el-input v-model="param.overdraftAmount"></el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="报警量" v-if="clickNum==6" prop="alarmVolume">
        <el-input v-model="param.alarmVolume"></el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="预存量" v-if="clickNum==6" prop="prestoreAmount">
        <el-input v-model="param.prestoreAmount"></el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="用水性质" v-if="clickNum==6" prop="usetWaterTypeId">
        <el-select v-model="param.usetWaterTypeId" placeholder="">
          <el-option
            v-for="item in waterProperty"
            :key="item.Id"
            :label="item.UseWaterTypeName"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="btn_sure">
        <el-button type="primary" @click="makeCardFun('param')">制卡</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { GetSetWriteCardInfo } from "@/api/userSetting";
  import { promptInfoFun } from "@/utils/index"
  import { GetWaterPropertyList } from "@/api/userSetting"; //用水性质

  export default {
    name: "leftContent",
    data() {
      return {
        clickNum: 5,
        param: {
          productType: 1,
          cardType: 0,
          dt: "",
          alarmVolume: 0,
          prestoreAmount: 0,
          overdraftAmount: 0,
          guaranteedAmount: 0,
          usetWaterTypeId: ""
        },
        waterProperty:[],
        rules:{
          dt: [
            {required: true, message: '请选择日期时间', trigger: 'blur'},
          ],
          usetWaterTypeId:[
            {required: true, message: '请选择用水性质', trigger: 'blur'},
          ],
          overdraftAmount:[
            {required: true, message: '透支量不能为空', trigger: 'blur'},
          ]
          ,
          alarmVolume:[
            {required: true, message: '报警量不能为空', trigger: 'blur'},
          ],
          prestoreAmount:[
            {required: true, message: '预存量不能为空', trigger: 'blur'},
          ]
        }
      }
    },
    methods:{
      getClick(num){//一代卡片切换
        this.clickNum = num
        this.$refs['param'].resetFields();
      },
      makeCardFun(formName){ //时间卡 5,设置卡 6,恢复卡 2,检查卡 3
        this.param.cardType = this.clickNum
        this.$refs[formName].validate((valid) => {
          if (valid) {
            try {
              if (FXYB_WEB_CS_ICCard) {
                GetSetWriteCardInfo(this.param).then(res => {//补卡
                  if (res.code == 0) {
                    let ress = FXYB_WEB_CS_ICCard.WriteCardInfo(JSON.stringify(res.data));
                    if (ress != undefined && ress != "") {
                      let dataJosn = JSON.parse(ress)//cs 制卡返回数据
                      if (dataJosn.Result) {
                        promptInfoFun(this, 2, '制卡成功');
                        this.$refs[formName].resetFields();
                      }
                    } else {
                      promptInfoFun(this, 1, "读取错误!");
                    }
                  } else {
                    promptInfoFun(this, 1, res.message);
                  }
                });
              }
            } catch (e) {
              promptInfoFun(this, 1, '请在CS端操作');
            }
          }
        })
      }
    }
  }
</script>
