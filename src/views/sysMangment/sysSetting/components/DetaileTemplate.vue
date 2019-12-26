<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="600px"
    center
    :close-on-click-modal="false"
  >
    <ul class="detaile_box">
      <li>
        <p>
          模板名称
          <span>{{ShortMsgTempParam.TemplateName }}</span>
        </p>
        <p>
          模板类型
          <span>{{ShortMsgTempParam.IsSysTemplate?"系统":"自定义" }}</span>
        </p>
      </li>
      <li>
        <p class="content">
          <span>模板内容</span>
          <span>{{ShortMsgTempParam.TemplateContent}}</span>
        </p>
      </li>
      <li>
        <p>
          发送方式
          <span>{{ShortMsgTempParam.SendMethod?"自动发送":"手动发送" }}</span>
        </p>
        <p>
          发送时间
          <span>{{ ShortMsgTempParam.SendModality?"定时发送":"及时发送" }}</span>
        </p>
      </li>
      <li>
        <p>
          定时发送时间
          <span>{{ShortMsgTempParam.ResetShortMsgTemplateSendTime }}</span>
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
    ShortMsgTempParam: {}
  },
  data() {
    return {
      AdialogFormVisible: false
    };
  },
  watch: {
    detaileShow() {
      this.AdialogFormVisible = this.detaileShow;
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:detaileShow", val);
    }
  }
  //   mounted() {
  //     console.log(this.ShortMsgTempParam);
  //   },
  //   created() {
  //     console.log(this.ShortMsgTempParam);
  //   }
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
        float: left;
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