<template>
  <el-dialog
    title="编辑"
    :visible.sync="EditWaterJX"
    top="20vh"
    width="60%"
    center
    :close-on-click-modal="false"
  >
    <el-form
      :inline="true"
      :model="EditJxData"
      class="head-search-form form-inline-small-input demo-ruleForm"
      size="small"
      label-width="150px"
      :rules="rules"
    >
      <el-form-item label="姓名：" prop="CustomerName">
        <el-input v-model="EditJxData.CustomerName" disabled maxlength="10" placeholder="(长度1-10)" />
      </el-form-item>
      <el-form-item label="用户编号：" prop="CustomerNo">
        <el-input v-model="EditJxData.CustomerNo" maxlength="20" />
      </el-form-item>
      <el-form-item label="开户状态：" prop="CustomerState">
        <el-select v-model="EditJxData.CustomerState" disabled>
          <el-option
            v-for="item in editopenStatus"
            :label="item.Name"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="水表样式：" prop="WaterMeterStyle">
        <el-select v-model="EditJxData.WaterMeterStyle" placeholder="请选择">
          <el-option
            v-for="item in editwaterMeterList"
            :label="item.Name"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="水表编号：" prop="WaterMeterNo">
        <el-input v-model="EditJxData.WaterMeterNo " maxlength="20" />
      </el-form-item>
      <el-form-item label="口径：" prop="MeterDiameter">
        <el-select v-model="EditJxData.MeterDiameter" placeholder="请选择">
          <el-option
            v-for="item in MeterDiameterList"
            :label="item.Id"
            :value="item.Id"
            :key="item.Name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起始读数：" prop="StarReadNum">
        <el-input v-model="EditJxData.StarReadNum " maxlength="20" />
      </el-form-item>
      <el-form-item label="当前读数：" prop="ReadNum">
        <el-input v-model="EditJxData.ReadNum" disabled maxlength="20" />
      </el-form-item>
      <el-form-item label="最后一次抄表日期：" prop="ReadDate">
        <el-input v-model="EditJxData.ReadDate" disabled maxlength="20" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="saveWaterInfo">确认</el-button>
      <el-button size="mini" @click="EditWaterJX = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission";
import { saveJXHisWater } from "@/api/waterMeterMang";
export default {
  name: "EditJXWaterMeter",
  props: {
    editShow: {
      type: Boolean,
      default: false
    },
    editwaterMeterList: {
      type: Array,
      default: []
    },
    editopenStatus: {
      type: Array,
      default: ""
    },
    editInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      EditWaterJX: false, //编辑弹框
      EditJxData: {
        customerName: "",
        CustomerNo: "",
        CustomerState: "",
        WaterMeterStyle: "",
        WaterMeterNo: "",
        MeterDiameter: "",
        StarReadNum: "",
        ReadNum: "",
        ReadDate: ""
      }, //表单数据
      MeterDiameterList: [], //口径
      editId: "",
      rules: {
        //表单 验证
        CustomerName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30个字符", trigger: "blur" }
        ],
        CustomerNo: [
          { required: true, message: "请输入用户编号", trigger: "blur" }
        ],
        editopenStatus: [
          { required: true, message: "请选择开户状态", trigger: "blur" }
        ],
        WaterMeterStyle: [
          { required: true, message: "请选择开水表样式", trigger: "blur" }
        ],
        WaterMeterNo: [
          { required: true, message: "请输入水表编号", trigger: "blur" }
        ],
        MeterDiameter: [
          { required: true, message: "请选择水表口径", trigger: "blur" }
        ],
        StarReadNum: [
          { required: true, message: "请输入 水表读数", trigger: "blur" }
        ],
        ReadNum: [
          { required: true, message: "请输入当前读数", trigger: "blur" }
        ],
        ReadDate: [
          { required: true, message: "请输入最后一次抄表时间", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    editShow() {
      this.EditWaterJX = this.editShow;
    },
    EditWaterJX(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:editShow", val);
    },
    editInfo() {
      this.editInfo.CustomerState = String(this.editInfo.CustomerState);
      this.editInfo.WaterMeterStyle = String(this.editInfo.WaterMeterStyle);
      this.editInfo.MeterDiameter = String(this.editInfo.MeterDiameter);
      this.EditJxData = this.editInfo;
    }
  },
  created() {
    this.MeterDiameterList = getDictionaryOption("口径类型");
  },
  methods: {
    saveWaterInfo() {
      let that = this;
      this.EditJxData.CustomerState = Number(this.EditJxData.CustomerState);
      this.EditJxData.WaterMeterStyle = Number(this.EditJxData.WaterMeterStyle);
      this.EditJxData.MeterDiameter = Number(this.EditJxData.MeterDiameter);
      this.EditJxData.ReadNum = Number(this.EditJxData.ReadNum);
      saveJXHisWater(that.EditJxData).then(res => {
        if (res.code == 0) {
            that.$parent.searchWatetJX()
          that.EditWaterJX = false;
          that.$message({
            message: res.msg ? res.msg : "保存成功",
            type: "success"
          });
        } else {
          that.$message({
            message: res.msg ? res.msg : "保存失败",
            type: "danger"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item{
  margin-bottom: 20px;
}
</style>
