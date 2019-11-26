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
      <el-form-item label="将此流程复制至：" prop="copyId">
        <el-select v-model="copyId" placeholder="请选择" @change="setCopyInfo">
          <el-option-group
            class="copyProcess"
            v-for="group in options"
            :key="group.ProcessMenuCode"
            :label="group.MenuCNName">
            <el-option
              v-for="item in group.Children"
              :key="item.ProcessMenuCode"
              :disabled="item.chose"
              :label="item.MenuCNName"
              :value="item.ProcessMenuCode">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="copyFun">确认</el-button>
      <el-button size="mini" @click="copyVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { GetProcessMenu, ProcessCopy} from "@/api/operationFlow"
  import { promptInfoFun } from "@/utils/index"

  export default {
    data() {
      return {
        copyVisible: false,//复制弹窗
        copyId: '',//复制至栏目ID
        options: [],
        data:[],//下拉总数据
        curId:'',//当前栏目id
        columnCode:'',
        columnId:''
      };
    },
    watch:{
      curId:{
        handler(newVal,oldVal){//监听左侧栏目切换，过滤当前需要禁用不能复制的栏目
          this.options.forEach(item=>{
            let child = item.Children
            child.forEach(k=>{
              k.Id == this.curId ? k.chose = true : k.chose = false
            })
            item.chose = false
          })
        }
      }
    },
    methods: {
      getData(){//获取树形结构数据
        this.options = []
        this.curId = localStorage.getItem('menuCode')
        GetProcessMenu().then(res => {//删除节点
          if (res.code ==0 ) {
            res.data.forEach(item=>{
              let child = item.Children
              child.forEach(k=>{
                k.Id == this.curId ? k.chose = true : k.chose = false
              })
              item.chose = false
              this.options.push(item)
            })
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      copyFun(){//复制节点
        if(this.copyId.toString().trim().length==0){
          promptInfoFun(this,1,'请选择所需移动至栏目！')
          return
        }
        ProcessCopy({configType:this.columnCode,id:this.columnId,sourceProcessId:this.data.Id}).then(res => {//复制节点
          if (res.code ==0 ) {
            promptInfoFun(this,2,res.message)
            this.copyVisible = false
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setCopyInfo(val){//选择需要复制到的栏目，获取栏目ID及Code
        let Childrens = []
        this.options.forEach(item=>{
          Childrens = item.Children.concat(Childrens)
        })
        this.columnCode = val
        Childrens.forEach(i=>{
          if(i.ProcessMenuCode == val)
          this.columnId = i.Id
        })
      }
    },
    created() {
      this.getData()
    }
  };
</script>
<style lang="scss">
  .copyProcess .el-select-group__title{color: #006663 !important;}
</style>
