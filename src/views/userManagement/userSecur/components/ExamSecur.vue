<template>
  <el-dialog
    title="提交复审"
    :visible.sync="viewExam"
    top="30vh"
    width="930px"
    center
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="次年生效日期" label-width="90px">
        <el-date-picker
          v-model="nextTimeArr"
          type="daterange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          disabled
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="user_information">
      <h3 class="add_title">
        <i></i>上传低保户资质
      </h3>
      <el-form :inline="true" ref="Enclosure" :model="Enclosure" label-width="100px">
        <uploadBox @getFileFun="getFileFun" ref="getFiles" class="secur-file"></uploadBox>
      </el-form>
    </div>
    <p style="text-align: center">
      <el-button type="primary" size="mini" @click="saveAduite">{{isOpen?"提交审核":"确定"}}</el-button>
      <el-button size="mini" @click="cancalSecur">取 消</el-button>
    </p>
  </el-dialog>
</template>
<script>
import uploadBox from "@/components/Upload";
import { reviewInssure } from "@/api/inSecur";
import { getOpenFlag } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  name: "ExamSecur",
  components: { uploadBox },
  data() {
    return {
      viewExam: false,
      nextTimeArr: [],
      Enclosure: {},
      InsuredRecheckParam: {
        InsuredMessageId: "", //低保户Id
        Idarr: [], //文件Id
        FS_StartDate: "", //次年生效开始时间
        FS_EndDate: "" //次年生效开始时间
      }, //提交数据
      fileArr: [],
      isOpen: true
    };
  },
  watch: {
    viewExam() {
      this.$nextTick(() => {
        this.$refs.getFiles.ifShow = false;
      });
    }
  },
  mounted() {
    //是否开启审核
    getOpenFlag(2902).then(val => {
      console.log(val);
      this.isOpen = val;
    });
  },
  methods: {
    /********************获取上传文件信息**********************/
    getFileFun(data) {
      this.fileArr = data;
    },
    //提交
    saveAduite() {
      let _this = this;
      _this.InsuredRecheckParam.Idarr = []; //初始化，避免重复添加
      for (let j = 0; j < _this.fileArr.length; j++) {
        //过滤获取上传文件信息ID
        _this.InsuredRecheckParam.Idarr.push(_this.fileArr[j].id);
      }
      if (!_this.InsuredRecheckParam.Idarr.length) {
        _this.$message({
          type: "warning",
          message: "请上传低保户附件"
        });
        return false;
      }
      reviewInssure(_this.InsuredRecheckParam).then(res => {
        if (res.code == 0) {
          _this.viewExam = false;
          _this.$message({
            type: "success",
            message: res.message ? res.message : "复审成功"
          });
          _this.nextTimeArr = [];
          _this.InsuredRecheckParam = this.$options.InsuredRecheckParam;
          this.$parent.seachAccountOrder();
        } else {
          _this.$message({
            type: "success",
            message: res.message ? res.message : "复审失败"
          });
        }
      });
    },
    //取消
    cancalSecur() {
      this.viewExam = false;
      this.nextTimeArr = [];
      this.InsuredRecheckParam = {};
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog__body {
  padding-left: 0;
  padding-right: 0;
  .el-form {
    padding: 0 25px;
  }
  .el-form-item__label {
    color: #777c82;
  }
  .secur-file {
    /deep/ .uploadPart {
      margin: 0 !important;
      margin-bottom: 40px !important;
    }
  }
  .user_information {
    margin-top: 24px;
    padding: 18px 25px 0 25px;
    border-top: 10px solid rgba(245, 245, 245, 1);
    .el-form {
      padding: 0;
    }
  }
}
</style>