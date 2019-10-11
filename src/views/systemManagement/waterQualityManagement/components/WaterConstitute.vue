<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="1020px"
    center
    custom-class="nopadding"
    :close-on-click-modal="false"
  >
  
  </el-dialog>
</template>
<script>
import { numGetAccount } from "@/api/account";
export default {
  props: { 
    id: {
      type: String
    },
    constituteShow: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    constituteShow() {
      this.AdialogFormVisible = this.constituteShow;
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:constituteShow", val);
    },
  },
  mounted() {
    numGetAccount("-1").then(res => {
      if (res.data) {
        this.userOptions = res.data;
        this.userOptionsSave = res.data;
      }
    });
  },
  data() {
    return {
      AdialogFormVisible: false, 
    };
  },
  methods: {
  
  }
};
</script>
<style lang="scss" scoped>
</style>

