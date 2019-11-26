<template>
  <div class="node_box">
    <div class="ifExamine">
      <el-button icon="el-icon-plus" type="primary" size="small" @click="addProcess">新增流程</el-button>
      <span class="tips">提示：审核人组可拖动至流程进行操作。</span>
      <p>是否开启审核 &nbsp;<el-switch v-model="ifExamine" :disabled="prohibit"></el-switch>
      </p>
    </div>
    <div class="team_item">
      <!--流程 s-->
      <div v-for="(item,index) in data" :key="index">
        <div>
          <ul :id="'teams_node'+ (index+1)" class="teams_node clearfix" :data-id="index">
            <li class="item_cont">
              <div>
                <p><i class="iconfont iconliuchengkaishi"></i>操作员</p>
                <span class="btnSpan btnSpanLeft" @click="peopleFun()">配置</span>
              </div>
              <i class="iconfont iconchangjiantou"></i>
            </li>
            <!--审核人-->
            <li class="item_cont" v-for="(items,indexs) in item.ProcessConfigNode" :key="indexs">
              <div class="item_cont_box">
                <p>{{ items.Name }}</p>
                <span class="btnSpan btnSpanLeft" @click="setFun(items,indexs)">
                  {{items.Members.length >0 ?'配置':'未配置'}}
                </span>
                <span class="btnSpan btnSpanRight" v-show=" indexs > 0">删除</span>
              </div>
              <i
                :class="indexs == item.ProcessConfigNode.length - 2? 'iconfont iconchangjiantou iconfontColor':'iconfont iconchangjiantou'"
                v-show="indexs!= item.ProcessConfigNode.length - 1"></i>
              <label class="el-icon-circle-plus-outline" v-show="indexs == item.ProcessConfigNode.length - 1" @click="addNode(item.ProcessConfigNode,1,index+1)"></label>
            </li>
            <!--审核人组-->
          </ul>

          <!--结束线-->
          <p class="line" v-for="(i,j) in item.ProcessConfigLine" :key="j"
             :style="'width:'+ (i.FromId-i.ToId) * 195 + 'px;height:' + (j+1)*28 + 'px;margin-top:' + -j*28 + 'px;margin-left:' + ((i.ToId -1 ) * 195 + 70) + 'px'">
            <i class="triangle_Up"></i>
            <i class="triangle_Left"></i>
          </p>

        </div>
        <p class="team_btn">
          <i :class="'iconfont iconbaocun disablepointer contralSee' + (index+1)" title="保存" @click="saveNode(item.Id)"></i>
          <i :class="'iconfont iconchexiao disablepointer contralSee' + (index+1)" title="撤销" @click="resetNode(item.Id)"></i>
          <i class="iconfont iconfuzhi onPointer" title="复制" @click="copyFun(item)"></i>
          <i class="iconfont iconlajitong onPointer" title="删除" @click="deleteProcess(item.Id)"></i>
        </p>
      </div>
      <!--流程 e-->
    </div>

    <!--复制弹窗-->
    <copy-dialog ref="copyChild"></copy-dialog>
    <!--配置弹窗-->
    <configure-dialog></configure-dialog>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import Bus from '@/utils/bus'
  import { promptInfoFun } from "@/utils/index"
  import copyDialog from './CopyDialog'
  import configureDialog from './ConfigureDialog'
  import { GetProcessConfigId, SetProcessMenuState, GetProcessConfig, DeleteProcessConfig } from "@/api/operationFlow"

  export default {
    name: "Nodes",
    components: {copyDialog: copyDialog, configureDialog: configureDialog},
    data() {
      return {
        moveTarget:{},//移入节点
        moveObj:[],//正再移入NODE集合
        moveId:'',//移入流程dom ID
        ifExamine: true,//权限开关冷却标识
        data: [],
        prohibit:false,//是否禁用审核权限开关
        ProcessConfigNode:[],
        ProcessConfigLine:[],
      }
    },
    watch: {
      ifExamine() {
        let _this = this
        _this.prohibit = true
        setTimeout(function () {
          _this.prohibit = false
        }, 10000)
        SetProcessMenuState({id: localStorage.getItem('menuId'),state: this.ifExamine}).then(res => {//审核权限开关
          if (res.code ==0 ) {
            promptInfoFun(this,2,res.message)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    },
    methods: {
      getInfo() {//获取数据，动态计算每个流程宽度
        GetProcessConfig({code:localStorage.getItem('menuId')}).then(res => {
          if(res.code==0){
            let obj = {//默认流程审核人组空对象
              Member: [
                {
                  ConfigType: 0,
                  ObjectId: "",
                  ObjectName: ""
                }
              ],
              Id: "",
              Name: "审核人组1",
              Index: 0
            }
            let obj2 = {//默认流程操作员空对象
              ConfigType: 0,
              ObjectId: "",
              ObjectName: ""
            }
            if(res.data.length==0)//该栏目下无流程时清空
              this.data = res.data
            res.data.forEach((item, index) => {//该栏目下有流程时，判断流程是否为空，为空需添加默认数据
              item.ProcessConfigNode = []
              item.ProcessConfigStart = []
              item.ProcessConfigLine = []
              item.ProcessConfigStart.length == 0 ? item.ProcessConfigStart.push(obj2) : item.ProcessConfigStart = item.ProcessConfigStart
              item.ProcessConfigNode.length == 0 ? item.ProcessConfigNode.push(obj) : item.ProcessConfigNode = item.ProcessConfigNode
              item.ProcessConfigNode.forEach(is=>{//获取对应节点成员数量
                is.Members = is.Member
                is.ModuleName = is.Name
              })
              this.data = res.data
              let className = 'teams_node' + (index + 1)
              let curData = item.ProcessConfigNode//当前node节点数据
              this.getWidth(className, 195, curData)//动态计算流程模块实际宽度
              this.getSort(className)
              let curLine = item.ProcessConfigLine//获取该流程下所有，回归线并绘制
              curLine.forEach((i, j) => {//回归线对象
                let curLineItem = i
                for (let k in curLineItem) {//节点对象遍历
                  curData.forEach((s, m) => {//node节点
                    if (s.Id === curLineItem[k]) {//配备ID替换节点位置
                      curLineItem[k] = m + 2 //跳过操作员模块，所有在下标的基础上+1再+1
                    }
                  })
                }
              })
            })
          }else{
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getWidth(id, width, curData) {//计算宽度
        this.$nextTick(()=>{
          document.getElementById(id).style.width = (curData.length + 1) * width + 30 + 'px'
        })
      },
      getSort(id){//初始化拖拽对象
        let _this = this
        this.$nextTick(()=>{
          let obj = document.getElementById(id)
          new Sortable(obj, {//初始化拖拽对象
            group: {
              name: 'shared',
              pull: 'clone',
              put:function(evt){//移入时候阻止默认移入添加事件
                event.stopPropagation();
                _this.moveTarget = JSON.parse(localStorage.getItem('curObj').replace(/Id/g,'id'))//移入前原对象
                _this.moveTarget.Name = _this.moveTarget.ModuleName
                _this.moveTarget.Id = ''//转换原有审核组Id,添加新的审核组人Id
                _this.moveObj = _this.data[evt.el.id.replace('teams_node','') - 1].ProcessConfigNode || []//获取正移入对象集合
                _this.moveId = evt.el.id//移入流程ID
                return false
              }
            },
            filter:'.teams_node',
            animation: 150,
            sort: false,
            scroll: true,
          });
        })
      },
      addNode(obj,type,num){//新增节点,obj node数组；type,1为手动添加，2为拖动添加；num 手动添加容器标识
        let repeat = true
        if (type === 1) {//手动
          GetProcessConfigId().then(res => {
            obj.push({Id: res.data, Name: '审核人组' + parseInt(obj.length + 1),Index:''})
            this.getWidth('teams_node' + num, 195, obj)//动态计算流程模块实际宽度
          })
          this.$nextTick(() => {
            document.getElementById('teams_node' + num).parentNode.scrollLeft = (obj.length+1)*195 + 30//添加节点时，控制滚动条滚动到最后位置方便查看
          })
          document.getElementsByClassName('contralSee'+ num)[0].classList.add('onPointer')//修改保存撤销按钮状态
          document.getElementsByClassName('contralSee'+ num)[1].classList.add('onPointer')
        } else {//拖动
          if (this.moveObj.length <= 0)//大于0时 证明有拖动对象容器
            return false
          obj = this.moveObj
          obj.forEach(item=>{//根据唯一Id判断是否重复添加
              if(this.moveTarget.id === item.id){
                repeat = false
              }
          })
          repeat ? obj.push(this.moveTarget): this.$message({
            message: '不能重复添加',
            type: 'warning'
          });

            this.getWidth(this.moveId, 195, obj)//动态计算流程模块实际宽度
          document.getElementsByClassName('contralSee'+ this.moveId.replace('teams_node', ''))[0].classList.add('onPointer')//修改保存撤销按钮状态
          document.getElementsByClassName('contralSee'+ this.moveId.replace('teams_node', ''))[1].classList.add('onPointer')
          this.$nextTick(() => {
            document.getElementById(this.moveId).parentNode.scrollLeft = (obj.length+1)*195 + 30//添加节点时，控制滚动条滚动到最后位置方便查看
          })
        }
      },
      addProcess(){//新增流程
        GetProcessConfigId({code:localStorage.getItem('menuId'),menuId:localStorage.getItem('menuCode')}).then(res => {
          if(res.code==0){
            this.getInfo()
          }else{
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setFun(item,index){//流程审核配置
        item.Name.trim() == '' ?  item.Name = '审核人组'+ (index + 1) : item.Name = item.Name
        let obj = {item: item, type: 1}
        Bus.$emit('NodesSetFun',obj)
      },
      peopleFun(){//操作员配置
        let obj = {id: 1, type: 3}
        Bus.$emit('NodesSetFun',obj)
      },
      copyFun(item){//复制流程
        this.$refs.copyChild.copyVisible = true
        this.$refs.copyChild.data = item
        this.$refs.copyChild.copyId = ''
        this.$refs.copyChild.curId = localStorage.getItem('menuCode')
      },
      deleteProcess(id){//删除流程，本地删除
        this.$confirm("是否确认删除该流程？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass: "el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          DeleteProcessConfig({proId:id}).then(res => {
            if(res.code == 0){
              promptInfoFun(this,2,res.message)
              this.getInfo()
            }else{
              promptInfoFun(this,1,res.message)
            }
          })
        })
      },
      saveNode(id){//流程保存
        alert(1)
      },
      resetNode(id){//撤销操作
        alert(2)
      },
    },
    mounted() {
      Bus.$off('moveNode')
      Bus.$off('moveNodeEmpty')
      Bus.$off('getNewNodes')
      Bus.$on('moveNode', () => {//触发手动添加节点事件
        this.addNode('',2)
      })
      Bus.$on('moveNodeEmpty', () => {//手动清空拖动记录数据
        this.moveTarget = {}
        this.moveObj = []
        this.moveId = ''
      })
      Bus.$on('getNewNodes', () => {//切换左侧栏目更新右侧节点数据
        this.getInfo()
      })
    }
  }
</script>
