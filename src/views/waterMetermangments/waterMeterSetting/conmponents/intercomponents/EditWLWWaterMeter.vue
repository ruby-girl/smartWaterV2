<template>
  <el-dialog
    title="编辑"
    :visible.sync="EditIC"
    top="20vh"
    width="400px"
    center
    :close-on-click-modal="false"
  >
    <el-form :inline="true" :model="editData" size="small" label-width="70px">
      <el-form-item label="水表编号">
        <el-input v-model="editData.WaterMeterNo" maxlength="20" />
      </el-form-item>
      <el-form-item label="水表样式">
        <el-select v-model="editData.wms" placeholder="请选择">
          <el-option
            v-for="item in waterMeterList"
            :label="item.Name"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="水表口径">
        <el-select v-model="editData.wms" placeholder="请选择">
          <el-option
            v-for="item in waterMeterList"
            :label="item.Name"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报警金额">
        <el-input v-model="editData.money" maxlength="20" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click>确认</el-button>
      <el-button size="mini" @click="EditIC = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
export default {
  name: "EditICWaterMeter",
  props: {
    editShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EditIC: false,
      editData: {},
      waterMeterList: [],
      MeterDiameterList: []
    };
  },
  watch: {
    editShow() {
      this.EditIC = this.editShow;
    },
    EditIC(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:editShow", val);
    }
  },
  created() {
    this.waterMeterList = getDictionaryOption("水表样式");
    this.MeterDiameterList = getDictionaryOption("口径类型");
  }
};
</script>
<style lang="scss" scoped>
.el-form{
  text-align: center;
  margin-top: 30px;
}
.el-form-item {
  margin-bottom: 20px;
}
/deep/.el-input__inner{
  width: 200px!important;
}
</style>
