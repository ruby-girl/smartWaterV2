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
          type="datetimerange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
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
      <el-button type="primary" size="mini" @click>提交审核/确定</el-button>
      <el-button size="mini" @click>取 消</el-button>
    </p>
  </el-dialog>
</template>
<script>
import uploadBox from "@/components/Upload";
export default {
  name: "ExamSecur",
  components: { uploadBox },
  data() {
    return {
      viewExam: false,
      nextTimeArr: [],
      Enclosure: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
    //   this.$refs.getFiles.ifShow = false;
    });
  },
  methods: {
    /********************获取上传文件信息**********************/
    getFileFun(data) {
      this.upload.file = data;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog__body{
    padding-left: 0;
    padding-right:0;
    .el-form{
        padding: 0 25px;
    }
    .el-form-item__label{
        color: #777C82;
    }
    .secur-file{
       /deep/ .uploadPart{
            margin: 0!important;
            margin-bottom: 40px!important;
        }
    }
    .user_information{
        margin-top: 24px;
        padding: 18px 25px 0 25px;
        border-top: 10px solid rgba(245,245,245,1);
        .el-form{
            padding: 0;
        }
    }
}
</style>