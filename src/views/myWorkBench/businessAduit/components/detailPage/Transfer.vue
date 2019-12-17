<template>
  <el-dialog
    class="work-bench-detail"
    :close-on-click-modal="false"
    top="10vh"
    title="审核详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :width="screenWidth<1600? '95%':'80%'">
    <div>
      <!--左侧表格信息-->
      <div class="detail-left">
        <div class="detail-moduler">
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>申请类型</label>
                <span>编辑开户申请</span>
              </p>
              <p>
                <label>申请时间</label>
                <span>1988-12-01 12:00:00</span>
              </p>
              <p>
                <label>创建人</label>
                <span>编辑开户申请</span>
              </p>
              <p>
                <label>申请状态</label>
                <span>编辑开户申请</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>原用户信息</h2>
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>姓名</label>
                <span>编辑开户申请</span>
              </p>
              <p>
                <label>电话</label>
                <span>1988-12-01 12:00:00</span>
              </p>
              <p>
                <label>用户编号</label>
                <span>张三 李四</span>
              </p>
              <p>
                <label>证件号</label>
                <span>编辑开户申请</span>
              </p>
            </li>
            <li class="clearfix">
              <p class="whole">
                <label>地址</label>
                <span>2</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>新用户信息</h2>
          <ul class="detail-table-info">
            <li class="clearfix">
              <p>
                <label>姓名</label>
                <span>编辑开户申请</span>
              </p>
              <p>
                <label>人口</label>
                <span>1988-12-01 12:00:00</span>
              </p>
              <p>
                <label>电话</label>
                <span>张三 李四</span>
              </p>
              <p>
                <label>证件号</label>
                <span>编辑开户申请</span>
              </p>
            </li>
            <li class="clearfix one-third">
              <p>
                <label>经办人</label>
                <span>2</span>
              </p>
              <p>
                <label>备注</label>
                <span>2</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="detail-moduler">
          <h2><i></i>附件信息</h2>
          <file-list :files="files"></file-list>
        </div>
      </div>
      <!--右侧流程信息-->
      <div class="detail-right">
        <process-examine></process-examine>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import "@/styles/workBench.scss"
  import MechanicsMater from "./waterTypes/MechanicsMater"
  import YcMeter from "./waterTypes/YcMeter"
  import fileList from '@/components/FileList'
  import ProcessExamine from '@/components/ProcessExamine'

  export default {
    name: "Transfer",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter },
    data() {
      return {
        dialogVisible: true,
        files:[{type:1,name:'swewe'},{type:2,name:'rrrr'},],
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
      }
    },
    computed:{
      currentView(){
        return this.componentsArr[this.index];
      }
    },
    methods:{
      handleClose(){
        this.dialogVisible = false
      }
    },
    mounted() {
      this.screenWidth = window.screen.width
      this.$nextTick(()=>{
        document.getElementsByClassName('detail-right')[0].style.height = document.getElementsByClassName('detail-left')[0].clientHeight + 'px'
      })
    }
  }
</script>

