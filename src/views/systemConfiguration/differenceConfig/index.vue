<template>
  <div class="section-container">
    <div class="waterFactory-box">
      <span>水厂：</span>
      <el-select
        size="small"
        v-model="waterFactory"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </div>
    <!-- 配置 -->
    <div class="bottom-box">
      <!-- 循环年 s-->
      <div class="year-box">
        <div class="year-box-border display-flex align-items-center justify-content-flex-justify">
          <div>1990年</div>
          <div class="year-button display-flex align-items-center">
            <i class="iconfont iconsuoyoubiaogelidebianji"></i>
            <span style="margin:0 10px 0 5px;">编辑</span>
            <i class="iconfont iconjianqu3" style="font-size:22px;"></i>
          </div>
        </div>
        <!-- 循环月 -->
        <div>
          <!-- 1月 -->
          <div class="month-line display-flex align-items-center">
            <div class="month-box-bg">1月</div>
            <div class="display-flex align-items-center">
              <div>供水</div>
              <!-- <el-input /> -->
              <el-input size="small" placeholder="请输入内容"></el-input>
              <span>吨</span>
            </div>
          </div>
          <!-- 1月 -->
        </div>
      </div>
      <!-- 循环年e -->
    </div>
  </div>
</template>
<script>
export default {
  name: "differenceConfig",
  data() {
    return {
      waterFactory: "",
      arr: [
        {
          year: "1990年",
          months: [
            { month: 1, value: 10 },
            { month: 2, value: 10 },
            { month: 3, value: 10 },
            { month: 4, value: 10 }
          ]
        }
      ],
      waterWorks: []
    };
  },
  mounted() {
    this.waterWorks = this.$store.state.user.waterWorks;
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.waterFactory-box {
  background: #fff;
  padding: 15px;
  color: #777c82;
}
.bottom-box {
  height: calc(100vh - 130px);
  .year-box {
    margin-top: 10px;
    background: #fff;
    padding: 10px;
  }
  .year-box-border {
    border-left: 4px solid #29beb0;
  }
  .year-button {
    color: #29beb0;
    font-size: 14px;
    cursor: pointer;
  }
  .month-box-bg {
    background: #9cb85c;
    height: 100%;
  }
  .month-line {
    height: 40px;
  }
}
</style>

