<template>
  <!-- 编辑弹窗 -->
  <el-dialog
    title="附件"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    top="30vh"
    width="850px"
    center
  >
    <el-form :inline="true" ref="Enclosure" :model="Enclosure" label-width="100px">
      <uploadBox @getFileFun="getFileFun" ref="getFiles"></uploadBox>
    </el-form>
  </el-dialog>
</template>
<script>
import uploadBox from "@/components/Upload";
export default {
  components: { uploadBox },
  props: {
    temp: {
      type: Object,
      default: function() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    file: {}
  },
  data() {
    return {
      dialogFormVisible: false,
      Enclosure: {}
    };
  },
  watch: {
    show() {
      this.dialogFormVisible = this.show;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:show", val);
    }
  },
  methods: {
    getFileFun(val) {
      //获取上传文件信息
      let arr = [];
      for (let j = 0; j < val.length; j++) {
        //获取上传文件ID集合
        arr.push(val[j].id);
      }
      this.$emit("update:file", arr);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

