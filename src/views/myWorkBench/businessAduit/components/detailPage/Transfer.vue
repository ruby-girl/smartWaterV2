<template>
  <el-dialog
    class="work-bench-detail"
    :close-on-click-modal="false"
    top="5vh"
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
        <p class="to-examine" v-show="!ifDetail">
          <el-button class="pass-btn" type="primary" icon="el-icon-check" size="mini" @click="successPassFun(1)">审核通过</el-button>
          <el-button class="refuse-btn" type="primary" icon="el-icon-close" size="mini" @click="failPassFun()">审核不通过</el-button>
        </p>
      </div>
      <!--右侧流程信息-->
      <div class="detail-right">
        <process-examine :auditLink="auditLink" :curObj="curObj"></process-examine>
      </div>
    </div>
    <fail-reason ref="remarkChild"></fail-reason>
  </el-dialog>
</template>

<script>
  import "@/styles/workBench.scss"
  import MechanicsMater from "./waterTypes/MechanicsMater"
  import YcMeter from "./waterTypes/YcMeter"
  import fileList from '@/components/FileList'
  import ProcessExamine from '@/components/ProcessExamine'
  import FailReason from "./FailReason"
  import { ProcessOperation } from '@/api/workBenck'
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "Transfer",
    components:{ fileList, ProcessExamine, MechanicsMater, YcMeter, FailReason },
    data() {
      return {
        auditLink:[],
        dialogVisible: false,
        files:[{type:1,name:'swewe'},{type:2,name:'rrrr'},],
        index:1,
        componentsArr:['MechanicsMater','YcMeter'],
        screenWidth:'',
        ifDetail:true,
        curObj:{}//当前点击列对象
      }
    },
    computed:{
      currentView(){
        return this.componentsArr[this.index];
      }
    },
    watch:{
      dialogVisible(val){
        if(val){
          this.$nextTick(()=>{
            let num = 10
            this.ifDetail ? num = 10: num = 66
            document.getElementsByClassName('detail-right')[0].style.height = document.getElementsByClassName('detail-left')[0].clientHeight - num + 'px'
          })
        }
      }
    },
    methods:{
      handleClose(){
        this.dialogVisible = false
      },
      failPassFun(){
        this.$refs.remarkChild.dialogVisible = true
      },
      successPassFun(type){//审核
        let query = {
          flow:this.curObj,
          OperationState:type==1 ? true : false,
          OperationRemark:this.$refs.remarkChild.form.remark
        }
        ProcessOperation(query).then(res => {
          if (res.code ==0 ) {
            promptInfoFun(this, 2, res.message);
            this.dialogVisible = true
          } else {
            promptInfoFun(this, 1, res.message);
          }
        })
      }
    },
    mounted() {
      this.screenWidth = window.screen.width
    }
  }
</script>

