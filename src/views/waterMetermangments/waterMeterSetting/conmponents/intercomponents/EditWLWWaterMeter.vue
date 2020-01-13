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
      <el-form-item label="报警量">
        <el-input v-model="editData.AmountAlarm" @keydown.native="checkNum" maxlength="20" />
      </el-form-item>
      <el-form-item label="透支量">
        <el-input v-model="editData.AmountOverdraft" @keydown.native="checkNum" maxlength="20" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="save">确认</el-button>
      <el-button size="mini" @click="EditIC = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
import { EditWlWInfo } from "@/api/waterMeterMang";
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
      editData: {
        SA_WaterMeter_Id: "",
        AmountAlarm: "",
        AmountOverdraft: ""
      },
      copeObj: {},
      waterMeterList: [],
      MeterDiameterList: []
    };
  },
  watch: {
    editShow() {
      this.EditIC = this.editShow;
      this.copeObj = Object.assign({}, this.editData);
    },
    EditIC(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:editShow", val);
    }
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    checkNum(e) {
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0] || null;
    },
    save() {
      if(this.copeObj.AmountAlarm==this.editData.AmountAlarm&&this.copeObj.AmountOverdraft==this.editData.AmountOverdraft){
          this.$message({
            type: "warning",
            message: "未改变数据不用提交"
          });
          return false
      }
      EditWlWInfo(this.editData).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: res.message ? res.message : "操作成功"
          });
          this.EditIC = false;
          this.$parent.searchWLWMeterInfo();
        } else {
          this.$message({
            type: "warning",
            message: res.message ? res.message : "操作失败"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form {
  text-align: center;
  margin-top: 30px;
}
.el-form-item {
  margin-bottom: 20px;
}
/deep/.el-input__inner {
  width: 200px !important;
}
</style>
