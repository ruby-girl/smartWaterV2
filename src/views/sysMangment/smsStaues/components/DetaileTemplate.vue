<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="详情"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="800px"
    center
    :close-on-click-modal="false"
  >
    <ul class="detaile_box">
      <li>
        <p>
          模板名称
          <span>{{ShortMsgTempParam.ShortMsgTemplateName }}</span>
        </p>
        <p>
          短信状态
          <span>{{ShortMsgTempParam.SendState}}</span>
        </p>
      </li>
      <li>
        <p class="content">
          <span>模板内容</span>
          <span>{{ShortMsgTempParam.ShortMsgContent}}</span>
        </p>
      </li>
      <li>
        <p>
          姓名
          <span>{{ShortMsgTempParam.CustomerName }}</span>
        </p>
        <p>
          水表类型
          <span>{{ ShortMsgTempParam.WaterMeterTypeName}}</span>
        </p>
      </li>
      <li>
        <p>
          定时发送时间
          <span>{{ShortMsgTempParam.SendShortMsgTime}}</span>
        </p>
      </li>
    </ul>
  </el-dialog>
</template>
<script>
export default {
  props: {
    detaileShow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      AdialogFormVisible: false,
      ShortMsgTempParam:{}
    };
  },
  mounted(){
    console.log(this.ShortMsgTempParam)
  },
  watch: {
    detaileShow() {
      this.AdialogFormVisible = this.detaileShow;
      this.ShortMsgTempParam=this.$parent.detaileModel
      console.log(this.ShortMsgTempParam)
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:detaileShow", val);
    }
  },
  
 
};
</script>
<style lang="scss" scoped>
.detaile_box {
  border: 1px solid rgba(219, 227, 232, 1);
  border-bottom: 0;
  margin: 0;
  padding: 0;
  li {
    list-style: none;
    overflow: hidden;
    p {
      margin: 0;
      padding: 0;
      padding-left: 8px;
      float: left;
      line-height: 35px;
      width: 50%;
      border-bottom: 1px solid rgba(219, 227, 232, 1);
      span {
        margin-left: 48px;
      }
    }
  }
  li:nth-child(2n) {
    p {
      width: 100%;
      span {
        padding-top: 9px;
        margin: 0;
        line-height: 20px;
      }
      span:nth-child(2) {
        width: 470px;
        // margin-left: 112px;
        padding-left: 48px;
      }
    }
    .content {
      height: 225px;
    }
  }
  li:nth-child(2n + 1) {
    background: rgba(240, 242, 245, 1);
    p:first-child {
      border-right: 1px solid rgba(219, 227, 232, 1);
    }
  }
}
</style>