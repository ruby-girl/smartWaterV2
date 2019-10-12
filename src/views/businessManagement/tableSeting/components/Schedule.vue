<template>
  <el-dialog
    class="forms"
    :close-on-click-modal="false"
    top="5vh"
    :visible.sync="dialogVisible"
    width="95%">
    <el-row :getter="18">
      <el-col :span="12">
        sd
      </el-col>
      <el-col :span="12">
        fg
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>

  export default {
    name: "Schedule",
    data() {
      return {
        dialogVisible: false,
      }
    },
    methods: {

    },
    mounted() {

    }
  }
</script>
<style lang="scss">
  .forms{
    .el-dialog__header {background-color: #EBEBEB !important;padding: 0 !important;}
    .el-dialog__headerbtn{display: none}
    .el-dialog__body{background: #EBEBEB;padding: 18px;}
  }
</style>
