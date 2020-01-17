<template>
  <div class="right_line">
    <h3>选择制卡类型</h3>
    <p>R208(二代水表)</p>
    <ul class="clearfix">
      <li :class="clickNum2==1?'on':''" @click="getClick2(1)"><i class="iconfont iconshijian1"></i>时间卡</li>
      <li :class="clickNum2==2?'on':''" @click="getClick2(2)"><i class="iconfont iconshezhika"></i>设置卡</li>
      <li :class="clickNum2==3?'on':''" @click="getClick2(3)"><i class="iconfont iconhuifubeifen"></i>恢复卡</li>
      <li :class="clickNum2==4?'on':''" @click="getClick2(4)"><i class="iconfont iconjiancha"></i>检查卡</li>
      <li :class="clickNum2==5?'on':''" @click="getClick2(5)"><i class="iconfont iconguanlika"></i>管理卡</li>
      <li :class="clickNum2==6?'on':''" @click="getClick2(6)"><i class="iconfont iconhuanbiaoka"></i>换表卡</li>
    </ul>
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-form-item label="日期时间" v-show="clickNum2==1">
        <el-date-picker
          v-model="form.name"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="透支量" v-show="clickNum2==2">
        <el-input v-model="form.name"></el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="报警量" v-show="clickNum2==2">
        <el-input v-model="form.name"></el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="预存量" v-show="clickNum2==2">
        <el-input v-model="form.name"></el-input>
        <span class="company">元</span>
      </el-form-item>
      <el-form-item label="用水性质" v-show="clickNum2==2">
        <el-select v-model="form.name" placeholder="">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="btn_sure">
        <el-button type="primary" @click="onSubmit">制卡</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "rightCont",
    data() {
      return {
        clickNum2: 1,
        form: {
          name: ""
        }
      }
    },
    methods:{
      getClick2(num){//二代卡片切换
        this.clickNum2 = num
      },
      onSubmit(){}
    }
  }
</script>
