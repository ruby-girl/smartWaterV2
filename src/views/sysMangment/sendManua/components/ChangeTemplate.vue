<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="模板选择"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="400px"
    center
    :close-on-click-modal="false"
  >
    <el-form
      :inline="true"
      :model="ShortMsgTempParam"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent
    >
      <el-form-item label="模板名称">
        <el-select v-model="ShortMsgTempParam.templateId" filterable placeholder="请选择">
          <el-option
            v-for="item in templateNmaeList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="allSend" size="mini" type="primary" @click="send">确认</el-button>
      <el-button v-if="!allSend" size="mini" type="primary" @click="sendAll">确认</el-button>
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getTemplateName } from "@/api/shotMsg"; //获取模板列表
export default {
  data() {
    return {
      AdialogFormVisible: false,
      ShortMsgTempParam: {},
      templateNmaeList: [],
      allSend: true
    };
  },
  created() {
    this.getNameList();
  },
  methods: {
    getNameList() {
      getTemplateName({ isSysTemplate: "false" }).then(res => {
        this.templateNmaeList = [];
        res.data.forEach(element => {
          let obj = {
            Id: element.Id,
            Name: element.TemplateName
          };
          this.templateNmaeList.push(obj);
        });
      });
    },
    send() {
      this.$parent.sendList(this.ShortMsgTempParam.templateId);
    },
    sendAllList() {
      this.$parent.sendAllList(this.ShortMsgTempParam.templateId);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item__content {
  width: 200px;
}
/deep/.el-input__inner {
  width: 200px !important;
}
.el-form {
  margin-top: 50px;
}
.dialog-footer {
  margin-top: 160px;
}
</style>
