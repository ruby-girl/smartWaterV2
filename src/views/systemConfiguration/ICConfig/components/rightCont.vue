<template>
  <div class="right_line">
    <h3>选择制卡类型</h3>
    <p>R208(二代水表)</p>
    <ul class="clearfix">
      <li :class="clickNum2==5?'on':''" @click="getClick2(5)"><i class="iconfont iconshijian1"></i>时间卡</li>
      <li :class="clickNum2==6?'on':''" @click="getClick2(6)"><i class="iconfont iconshezhika"></i>设置卡</li>
      <li :class="clickNum2==2?'on':''" @click="getClick2(2)"><i class="iconfont iconhuifubeifen"></i>恢复卡</li>
      <li :class="clickNum2==3?'on':''" @click="getClick2(3)"><i class="iconfont iconjiancha"></i>检查卡</li>
      <li :class="clickNum2==4?'on':''" @click="getClick2(4)"><i class="iconfont iconguanlika"></i>管理卡</li>
      <li :class="clickNum2==7?'on':''" @click="getClick2(7)"><i class="iconfont iconhuanbiaoka"></i>换表卡</li>
    </ul>
    <el-form ref="param" :model="param" label-width="80px" :inline="true" :rules="rules">
      <el-form-item label="日期时间" v-if="clickNum2==5" prop="dt">
        <el-date-picker
          v-model="param.dt"
          type="datetime"
          value-format= "yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="保底量" v-if="clickNum2==6" prop="overdraftAmount">
        <el-input v-model="param.guaranteedAmount"
                  onkeyup="value=value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d{1}).*$/, '$1$2.$3')" maxlength="6">
        </el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="报警量" v-if="clickNum2==6" prop="alarmVolume">
        <el-input v-model="param.alarmVolume" onkeyup="value=value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d{1}).*$/, '$1$2.$3')" maxlength="6"></el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="预存量" v-if="clickNum2==6" prop="prestoreAmount">
        <el-input v-model="param.prestoreAmount" onkeyup="value=value.replace(/[^\d.]/g, '').replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d{1}).*$/, '$1$2.$3')" maxlength="6"></el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="用水性质" v-if="clickNum2==6" prop="usetWaterTypeId">
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
  import {  updateMoney,changeTwoDecimal  } from "@/utils/index";

  export default {
    name: "rightCont",
    data() {
      return {
        clickNum2: 5,
        param: {
          productType: 2,
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
      getClick2(num){//二代卡片切换
        this.clickNum2 = num
        this.$refs['param'].resetFields();
      },
      makeCardFun(formName){
        this.param.cardType = this.clickNum2
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
              return
            }
          }
        })
      },
      setNumsType(e){
        return e.replace(/[^\.\d]/g,'')
      }
    }
  }
</script>
