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
            :key="group.ProcessMenuCode"
            :label="group.MenuCNName">
            <el-option
              v-for="item in group.Children"
              :key="item.ProcessMenuCode"
              :label="item.MenuCNName"
              :value="item.ProcessMenuCode">
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
  import { GetProcessMenu } from "@/api/operationFlow"
  import { promptInfoFun } from "@/utils/index"

  export default {
    data() {
      return {
        copyVisible: false,//复制弹窗
        copyId: '',//复制至栏目ID
        options: [],
      };
    },
    methods: {
      getData(){//获取树形结构数据
        GetProcessMenu().then(res => {//删除节点
          if (res.code ==0 ) {
            res.data.forEach(item=>{
              this.options.push(item)
            })
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    },
    mounted() {
      this.getData()
    }
  };
</script>
