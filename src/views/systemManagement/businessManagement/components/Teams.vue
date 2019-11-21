<template>
  <div class="auditTeam">
    <ul class="clearfix" id="teamWidth">
      <li v-for="(item,index) in teams" :key="index" :data-id="index">
        <h3 class="team_name">
          {{ item.ModuleName.trim() == '' ? '审核组'+ (index+1) : item.ModuleName }}
          <i></i>
        </h3>
        <p>
          <span class="btnSpan btnSpanLeft" @click="setFun(item,index)">
            {{ item.Members.length >0 ?'配置':'未配置'}}
          </span>&nbsp;
          <span class="btnSpan btnSpanRight" @click="deletePerson(item.Id)">删除</span>
        </p>
      </li>
      <li class="addTeam" @click="addPerson">
        <p><i class="iconfont icontianjia"></i>新增审核人组</p>
      </li>
    </ul>
    <!--配置弹窗-->
    <configure-dialog></configure-dialog>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import Bus from '@/utils/bus'
  import { promptInfoFun } from "@/utils/index"
  import configureDialog from './ConfigureDialog'
  import { GetProcessModuleInfo, DeleteProcessModuleInfo, AddProcessModuleInfo } from "@/api/operationFlow"

  export default {
    name: "Teams",
    components:{configureDialog:configureDialog},
    data() {
      return {
        teams: []
      }
    },
    methods:{
      getWidth(id,width){//动态设置用户组容易宽度
        document.getElementById(id).style.width = (this.teams.length + 1) * width + 30 + 'px'
        this.$nextTick(() => {
          document.getElementById(id).parentNode.scrollLeft = (this.teams.length+1) * 160 + 30
        })
      },
      addPerson(){//新增节点用户组
        AddProcessModuleInfo().then(res => {//增加模组
          if (res.code ==0 ) {
            this.getMenuData()
            this.getWidth('teamWidth',160)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      deletePerson(id){
        this.$confirm("是否确认删除该流程？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass: "el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          DeleteProcessModuleInfo({'id':id}).then(res => {//删除节点
            if (res.code ==0 ) {
              promptInfoFun(this,2,res.message)
              this.getMenuData()
            } else {
              promptInfoFun(this,1,res.message)
            }
          })
        })
      },
      setFun(item,index){//审核人详情配置
        item.Members.length > 0 ? item.ModuleName = item.ModuleName : item.ModuleName = '审核组'+ (index + 1)
        let obj = {item: item, type: 2}
        Bus.$emit('NodesSetFun',obj)
      },
      getMenuData(){//获取审核组信息
        GetProcessModuleInfo().then(res => {//删除节点
          if (res.code ==0 ) {
            this.teams = res.data
            this.getWidth('teamWidth',160)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
    },
    mounted() {
      let _this = this
      this.getMenuData()
      new Sortable(teamWidth, {
        group: {
          name: 'shared',
          pull: 'clone',
          put: false, // 不允许拖拽进这个列表
        },
        animation: 150,
        sort: false,
        filter:'.addTeam',
        onStart: function (/**Event*/evt) {//开始拖拽时，记录被拖拽元素
          localStorage.setItem('curObj',JSON.stringify(_this.teams[evt.oldIndex]))
          Bus.$emit('moveNodeEmpty')
        },
        onEnd: function (evt) {//移入结束时触发手动添加节点事件
          Bus.$emit('moveNode')
        },

    });
    }
  }
</script>
