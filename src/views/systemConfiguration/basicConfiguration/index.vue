<template>
  <div class="section-container">
    <div class="box-item">
      <div class="border-bottom">
        <config-title title="系统配置" />
        <switch-item label="开启多人口家庭用水量" :swithValue="postData.BasicParam.IsMorePeople" />
        <div class="font-small">
          人口基数为
          <input type="text" class="config-input" />人时，每个阶梯结算周期内，增加各阶梯水量
          <input type="text" class="config-input" />吨；每增加
          <input type="text" class="config-input" />人，
          <div>
            增加各阶梯水量
            <input type="text" class="config-input" />吨。（此配置只针对居民用水）
          </div>
        </div>
      </div>
      <div class="pt-15">
        <switch-item label="开启固定减免" :swithValue="postData.BasicParam.IsMorePeople" />
        <div class="pr-15 font-small">
          低保户
          <input type="text" class="config-input" />吨/户表.月
        </div>
      </div>
    </div>
    <!-- 费用设置 -->
    <div class="box-item">
      <div class="border-bottom">
        <config-title title="费用设置" />
        <switch-item label="是否开启违约金" :swithValue="postData.BasicParam.IsMorePeople" />
        <div class="font-small">
            人口基数为 <input type="text" class="config-input">人时，每个阶梯结算周期内，增加各阶梯水量<input type="text" class="config-input">吨；每增加<input type="text" class="config-input">人，
              <div>
                增加各阶梯水量<input type="text" class="config-input">吨。（此配置只针对居民用水）
              </div>
        </div>
      </div>
      <div class="pt-15">
        <switch-item label="开启垃圾费" :swithValue="postData.BasicParam.IsMorePeople" />
        <div class="pr-15 font-small">
          每月收费
          <input type="text" class="config-input" />元。
        </div>
      </div>
    </div>
    <!-- 提醒设置 -->
    <div class="box-item">
      <div class="border-bottom">
        <config-title title="提醒设置" />
        <switch-item label="低保户生效日期到期消息提醒" :swithValue="postData.BasicParam.IsMorePeople" />
        <div class="font-small">
          低保户到期前
          <el-select size="small" class="small-select">
            <option value="1">1</option>
            <option value="2">2</option>
          </el-select>月进行对用户发送短信提醒,短信模板
          <el-select size="small" class="medium-select">
            <option value="1">1</option>
            <option value="2">2</option>
          </el-select>
        </div>
      </div>
      <div class="pt-15">
        <switch-item
          label="当带阀水表用户当日用水量高于预警量是,发送预警消息"
          :swithValue="postData.BasicParam.IsMorePeople"
        />
        <div class="font-small">
          是否发送短信至用户
          <el-select size="small" class="small-select">
            <option value="1">是</option>
            <option value="2">否</option>
          </el-select>请选择收短信的工作人员,短信模板
          <el-select size="small" class="medium-select">
            <option value="1">1</option>
            <option value="2">2</option>
          </el-select>
          <div>
            当水表口径为
            <el-select size="small" class="medium-select">
              <option value="1">1</option>
              <option value="2">2</option>
            </el-select>时,预警量为 <input type="text" class="config-input"><i class="iconfont icontianjia"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ConfigTitle from "./components/ConfigTitle";
import SwitchItem from "./components/SwitchItem";
export default {
  name: "basicConfig",
  components: { SwitchItem, ConfigTitle },
  data() {
    return {
      postData: {
        BasicParam: {
          IsMorePeople: true
        }
      }
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.section-container {
  color: #5b5b5b;
  .config-input {
    border: none;
    border-bottom: 1px solid #8c9299;
    width: 60px;
    text-align: center;
    &:focus {
      outline: none;
    }
  }
  .font-small {
      margin-bottom: 10px;
    font-size: 14px;
  }
  .border-bottom {
    border-bottom: 1px solid #d3d6e0;
  }
  .pt-15 {
    padding-top: 10px;
  }
  .small-select {
    /deep/ .el-input--small .el-input__inner {
      width: 90px;
      height: 26px;
    }
  }
  .medium-select {
    /deep/ .el-input--small .el-input__inner {
      width: 136px;
      height: 26px;
    }
  }
}
.box-item {
  line-height: 33px;
  padding: 15px;
  background: #fff;
  border-bottom: 5px solid #eee;
  margin-bottom: 10px;
}
</style>

