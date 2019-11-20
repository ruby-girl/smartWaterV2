<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="复制流程" :visible.sync="copyVisible" :close-on-click-modal="false" top="30vh" width="400px" center>
    <el-form
      ref="dataForm"
      :inline="true"
      class="form-inline-small-input"
      size="small"
      label-width="120px">
      <el-form-item label="将此流程复制至：" prop="WaterWorksName">
        <el-select v-model="copyId" placeholder="请选择">
          <el-option-group
            v-for="group in options"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="copyVisible = false">确认</el-button>
      <el-button size="mini" @click="copyVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import {promptInfoFun} from "@/utils/index"

  export default {
    data() {
      return {
        copyVisible: false,//复制弹窗
        copyId: '',//复制至栏目ID
        options: [{
          label: '热门城市',
          options: [{
            value: 'Shanghai',
            label: '上海'
          }, {
            value: 'Beijing',
            label: '北京'
          }]
        }, {
          label: '城市名',
          options: [{
            value: 'Chengdu',
            label: '成都'
          }, {
            value: 'Shenzhen',
            label: '深圳'
          }, {
            value: 'Guangzhou',
            label: '广州'
          }, {
            value: 'Dalian',
            label: '大连'
          }]
        }],
      };
    },
    methods: {}
  };
</script>
