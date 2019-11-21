<template>
  <div class="int_static">
    <el-row :gutter="40">
      <el-col :span="2" style="padding-right:0">
        <div class="fl" style="padding-left:10px;">
          <div class="num">6081</div>
          <div>共计</div>
          <div>（只）</div>
        </div>
        <div class="fr" style="padding-right:10px;">
          <img :src="imgIcon" alt />
        </div>
      </el-col>
      <el-col :span="2">
        <div class="num">6081</div>
        <div>正常水表</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num">6081</div>
        <div>阀门异常</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="3">
        <div class="num">6081</div>
        <div>单干簧管异常第一次</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="3">
        <div class="num">6081</div>
        <div>单干簧管异常第二次</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num">6081</div>
        <div>强磁异常</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num">6081</div>
        <div>电池一级低压</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num">6081</div>
        <div>电池二级低压</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num">6081</div>
        <div>存储器异常</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="3">
        <div class="num">6081</div>
        <div>表端电池供电异常</div>
        <div>（只）</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import imgIcon from "@/assets/imgs/ab_static.png";

export default {
  name: "internetWater",
  data() {
    return {
      imgIcon: imgIcon
    };
  }
};
</script>