<template>
  <div class="node_box">
    <div class="ifExamine">
      <el-button icon="el-icon-plus" type="primary" size="small" @click="addProcess" :disabled="isHasNode">创建流程</el-button>
      <span class="tips">提示：审核环节可拖动至流程进行操作。</span>
      <p>是否开启审核 &nbsp;<el-switch v-model="ifExamine" :disabled="prohibit"></el-switch>
      </p>
    </div>
    <div class="team_item">
      <!--流程 s-->
      <div v-for="(item,index) in data" :key="index" v-show="index<1">
        <div>
          <ul :id="'teams_node'+ (index+1)" class="teams_node clearfix" :data-id="index" :data-num="item.Id">
            <li class="item_cont">
              <div>
                <p><i class="iconfont iconliuchengkaishi"></i>{{item.BusinessStartName}}</p>
                <span class="btnSpan btnSpanLeft" @click="peopleFun(item)">配置</span>
              </div>
              <i class="iconfont iconchangjiantou"></i>
            </li>
            <!--审核人-->
            <li class="item_cont" v-for="(items,indexs) in item.ProcessConfigNode" :key="indexs">
              <div class="item_cont_box">
                <p>{{ items.Name }}</p>
                <span class="btnSpan btnSpanLeft" @click="setFun(items,indexs,item)">
                  {{items.Members.length >0 ?'配置':'未配置'}}
                </span>
                <span class="btnSpan btnSpanRight" v-show=" indexs > 0" @click="deleteProcessId(item,items,index+1)">删除</span>
              </div>
              <i
                :class="indexs == item.ProcessConfigNode.length - 2? 'iconfont iconchangjiantou iconfontColor':'iconfont iconchangjiantou'"
                v-show="indexs!= item.ProcessConfigNode.length - 1"></i>
              <label class="el-icon-circle-plus-outline" v-show="indexs == item.ProcessConfigNode.length - 1" @click="addNode(item.ProcessConfigNode,1,index+1)"></label>
            </li>
            <!--审核人组-->
          </ul>
          <!--结束回归线 没超过10条线，j值归0从头计算，以免线条位置超出节点区域-->
          <p class="line" v-for="(i,j) in item.lines" :key="j" v-if="i.FromId!=i.ToId"
             :style="'width:'+ (i.FromId-i.ToId) * 195 + 'px;height:' + (j+1)*28 + 'px;margin-top:' + -j*28 + 'px;margin-left:' + ((i.ToId -1 ) * 195 + 70 + (j >9 ? j = j%10 : j = j)*8) + 'px'">
            <i class="triangle_Up"></i>
            <i class="triangle_Left"></i>
          </p>

        </div>
        <p class="team_btn">
          <i :class="'iconfont iconbaocun disablepointer contralSee' + (index+1)" title="保存" @click="saveNode(item.Id)"></i>
          <i :class="'iconfont iconchexiao disablepointer contralSee' + (index+1)" title="撤销" @click="resetNode(item,(index+1))"></i>
          <i class="iconfont iconfuzhi onPointer" title="复制" @click="copyFun(item)"></i>
          <i class="iconfont iconlajitong onPointer" title="删除" @click="deleteProcess(item.Id)"></i>
        </p>
      </div>
      <!--流程 e-->
    </div>

    <!--复制弹窗-->
    <copy-dialog ref="copyChild"></copy-dialog>
    <!--配置弹窗-->
    <configure-dialog ref="configureChild"></configure-dialog>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import Bus from '@/utils/bus'
  import { promptInfoFun } from "@/utils/index"
  import copyDialog from './CopyDialog'
  import configureDialog from './ConfigureDialog'
  import { GetProcessConfigId, SetProcessMenuState, GetProcessConfig, DeleteProcessConfig , GetMD5Id, UpdateProcessConfig} from "@/api/operationFlow"

  export default {
    name: "Nodes",
    components: {copyDialog: copyDialog, configureDialog: configureDialog},
    data() {
      return {
        isHasNode:false,
        moveTarget:{},//移入节点
        moveObj:[],//正再移入NODE集合
        moveId:'',//移入流程dom ID
        ifExamine: false,//权限开关冷却标识
        data: [],
        prohibit:false,//是否禁用审核权限开关
        ProcessConfigNode:[],
        ProcessConfigLine:[],
        ifScoll:false,
        oldData:[],//用于新增流程时候 筛选重复创建人
      }
    },
    watch: {
      ifExamine() {
        let _this = this
        _this.prohibit = true
        setTimeout(function () {
          _this.prohibit = false
        }, 10000)
        SetProcessMenuState({id: localStorage.getItem('menuCode'),state: this.ifExamine}).then(res => {//审核权限开关
          if (res.code ==0 ) {
           // promptInfoFun(this,2,res.message)
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
            res.data.ProcessConfigs.length > 0 ? this.isHasNode = true :  this.isHasNode = false //数流程数据则不能创建流程
            this.oldData = res.data.ProcessConfigs
            this.ifExamine = res.data.ProcessState
            this.ifScoll = false
            let obj2 = {//默认流程操作员空对象
              ConfigType: 0,
              ObjectId: "",
              ObjectName: ""
            }
            if(res.data.ProcessConfigs.length==0)//该栏目下无流程时清空
              this.data = res.data.ProcessConfigs
            res.data.ProcessConfigs.forEach((item, index) => {//该栏目下有流程时，判断流程是否为空，为空需添加默认数据
              let curLine = item.ProcessConfigLine//获取该流程下所有，回归线并绘制
              let exp = null, curData = item.ProcessConfigNode ;
              (item.BusinessStartName == exp || item.BusinessStartName.trim().length==0) ? item.BusinessStartName = '创建人' : item.BusinessStartName = item.BusinessStartName//操作员名称
              let localData = []
              let className = 'teams_node' + (index + 1)
              item.ProcessConfigStart.length === 0 ? item.ProcessConfigStart.push(obj2) : item.ProcessConfigStart = item.ProcessConfigStart

              if(item.ProcessConfigNode.length === 0){//流程为空流程时候
                GetMD5Id().then(ress => {//当流程节点返回为null 时，初始化默认第一个审核人组ID
                  let obj = {//默认流程审核人组空对象
                    Member: [
                      {
                        ConfigType: 0,
                        ObjectId: "",
                        ObjectName: ""
                      }
                    ],
                    Id: ress.data,
                    Name: "审核环节1",
                    Index: 0
                  }
                  item.ProcessConfigNode.push(obj)
                  item.ProcessConfigNode.forEach(is=>{//获取对应节点成员数量
                    is.Members = is.Member
                    is.ModuleName = is.Name
                  })
                  localData.push({id:item.ProcessConfigNode[0].Id,name:'审核环节1'})
                  localStorage.setItem(className,JSON.stringify(localData))
                  this.data = res.data.ProcessConfigs
                  this.getWidth(className, 195, curData)//动态计算流程模块实际宽度
                  this.getSort(className)
                  return
                })
              }else {//流程不为空
                item.ProcessConfigNode.forEach(is=>{//获取对应节点成员数量
                  is.Members = is.Member
                  is.ModuleName = is.Name
                  localData.push({id:is.Id,name:is.Name})//若该流程已经有数据，则遍历存储节点id,以供回归线使用
                  localStorage.setItem(className,JSON.stringify(localData))
                  curLine.forEach((k,j)=>{//所此节点有回归线，则手动添加到节点中，用于配置页面中，结束点回填
                    if(k.FromId==is.Id)
                      is.ProcessConfigLine = k
                  })
                })
                item.ProcessConfigNode[0].ProcessConfigLine={FromId:'',ToId:''}//清空首个节点回归线
                this.data = res.data.ProcessConfigs
                this.getWidth(className, 195, curData)//动态计算流程模块实际宽度
                this.getSort(className)
              }
              item.lines = JSON.parse(JSON.stringify(curLine))//复制数组避免影响原有数据
              item.lines.forEach((i, j) => {//回归线对象
                i.Id =  JSON.stringify(i.FromId)
                let curLineItem = i
                for (let k in curLineItem) {//节点对象遍历
                  curData.forEach((s, m) => {//node节点
                    if (s.Id === curLineItem[k]) {//配备ID替换节点位置
                      curLineItem[k] = m + 2 //跳过操作员模块，所有在下标的基础上+1再+1
                    }
                  })
                }
              })
              this.$nextTick(()=>{
                document.getElementsByClassName('contralSee' + (index+1))[0].classList.remove('onPointer')//修改保存撤销按钮状态
                document.getElementsByClassName('contralSee' + (index+1))[1].classList.remove('onPointer')
              })
            })
            localStorage.setItem('oldProcessInfo',JSON.stringify(res.data))
          }else{
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getWidth(id, width, curData) {//计算宽度
        this.$nextTick(()=>{
          document.getElementById(id).style.width = (curData.length + 1) * width + 30 + 'px'
          this.ifScoll? document.getElementById(id).parentNode.scrollLeft = (curData.length+1) * width + 30 : document.getElementById(id).parentNode.scrollLeft = 0
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
                _this.moveTarget = JSON.parse(localStorage.getItem('curObj').replace(/"Id"/g,'"id"'))//移入前原对象
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
      addNode(obj, type, num) {//新增节点,obj node数组；type,1为手动添加，2为拖动添加；num 手动添加容器标识
        this.ifScoll = true
        let repeat = true//记录重复拖动标识
        if (type === 1) {//手动
          GetMD5Id().then(res => {
            let names = '审核环节' + parseInt(obj.length + 1)
            this.setProcessNodeIds(res.data,names,'teams_node' + num)
            obj.push({Id: res.data, Name: names, Index: '',Members:[],ModuleName:names,ProcessConfigLine:{FromId:'',ToId:''}})//添加默认值
            this.getWidth('teams_node' + num, 195, obj)//动态计算流程模块实际宽度
          })
          document.getElementsByClassName('contralSee' + num)[0].classList.add('onPointer')//修改保存撤销按钮状态
          document.getElementsByClassName('contralSee' + num)[1].classList.add('onPointer')
        } else {//拖动
          if (this.moveObj.length <= 0)//大于0时 证明有拖动对象容器
            return false
          obj = this.moveObj
          obj.forEach(item => {//根据移动元素唯一Id判断是否重复添加
            if (this.moveTarget.id === item.id) {
              repeat = false
            }
          })
          if(repeat){//生成新的流程节点Id
            GetMD5Id().then(res => {
              this.setProcessNodeIds(res.data,this.moveTarget.Name,this.moveId)
              this.moveTarget.Id = res.data
              this.moveTarget.Member = this.moveTarget.Members
              this.moveTarget.Index = 0
              this.moveTarget.ProcessConfigLine = {FromId:'',ToId:''}
              obj.push(this.moveTarget)
              this.getWidth(this.moveId, 195, obj)//动态计算流程模块实际宽度
              document.getElementsByClassName('contralSee' + this.moveId.replace('teams_node', ''))[0].classList.add('onPointer')//修改保存撤销按钮状态
              document.getElementsByClassName('contralSee' + this.moveId.replace('teams_node', ''))[1].classList.add('onPointer')
              this.$nextTick(() => {
                document.getElementById(this.moveId).parentNode.scrollLeft = (obj.length + 1) * 195 + 30//添加节点时，控制滚动条滚动到最后位置方便查看
              })
            })
          }else {
            promptInfoFun(this,1,'不能重复添加')
          }
        }
      },
      setProcessNodeIds(id,name,htmlName){//新增流程节点时，暂存流程节点ID，用于回归线选择使用,id 流程新增节点id,name 流程名称，htmlName流程html唯一Id
        let exp = null,ids=[]
        if(localStorage.getItem(htmlName)===exp){//流程新增节点时候 如无已存储节点ID直接添加
          ids.push({id:id,name:name})
          localStorage.setItem(htmlName,JSON.stringify(ids))
        }else {
          let objId = JSON.parse(localStorage.getItem(htmlName))//流程新增节点时候 获取已存储节点Id,再添加进新增ID
          objId.push({id:id,name:name})
          localStorage.setItem(htmlName,JSON.stringify(objId))
        }
      },
      deleteProcessId(data,process,num){//删除流程节点ID,obj 整个流程实体，item 流程中删除节点 ,num 手动添加容器标识
        let obj = data.ProcessConfigNode//接口存储节点数据
        let itemName = 'teams_node' + num //该条信息本地存储名称
        data.ProcessConfigLine = data.ProcessConfigLine.filter(function(v){
          return JSON.stringify(v).indexOf(process.Id) == -1
        });
        for (let i = 0; i < obj.length; i++) {//先删除点击节点，避免使用forEach 循环数组本身，删除后下标变化循环失败
          if (obj[i].Id == process.Id) {//删除对应节点NODE数据
            obj.splice(i, 1)//流程实体中删除该条记录
            let localData = JSON.parse(localStorage.getItem(itemName))//删除本地节点ID集合中对应数据
            localData.forEach((i, j) => {
              if (i.id == process.Id) {
                localData.splice(j, 1)
                localStorage.setItem(itemName, JSON.stringify(localData))
              }
            })
          }
        }
        obj.forEach(i => {//再过滤该流程下其他节点中是否有关联删除节点数据
          if (JSON.stringify(i.ProcessConfigLine.ToId).indexOf(process.Id) != -1) {//清空剩余节点中 结束回归线对象里包含当前删除节点ID的数据
            i.ProcessConfigLine.ToId = ''
            i.ProcessConfigLine.FromId = ''
          }
        })

        /*根据删除节点后的数据重新绘制结束回归线*/
        data.lines = JSON.parse(JSON.stringify(data.ProcessConfigLine))//复制数组避免影响原有数据
        data.lines.forEach((i, j) => {//回归线对象
          i.Id = JSON.stringify(i.FromId)
          let curLineItem = i
          for (let k in curLineItem) {//节点对象遍历
            obj.forEach((s, m) => {//node节点
              if (s.Id === curLineItem[k]) {//配备ID替换节点位置
                curLineItem[k] = m + 2 //跳过操作员模块，所有在下标的基础上+1再+1
              }
            })
          }
        })
        document.getElementsByClassName('contralSee' + num)[0].classList.add('onPointer')//修改保存撤销按钮状态
        document.getElementsByClassName('contralSee' + num)[1].classList.add('onPointer')

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
      setFun(item,index,data){//流程审核配置,item 节点对象 index 节点下标 num 流程下标 data 当前流程
        item.Name.trim() == '' ?  item.Name = '审核环节'+ (index + 1) : item.Name = item.Name
        let obj = {item: item, type: 1}
        Bus.$emit('NodesSetFun',obj)
        this.$refs.configureChild.getLocalstorageData(data.ProcessConfigNode)
        this.$refs.configureChild.processID = data.Id//存储当前流程id
      },
      peopleFun(data){//操作员配置 data 流程对象
        let item = {
          ModuleName:data.BusinessStartName,
          Members:data.ProcessConfigStart
        }
        let obj = {item: item, type: 3}
        Bus.$emit('NodesSetFun',obj)
        this.$refs.configureChild.processID = data.Id//存储当前流程id
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
        let lines = [],nodes = [],stop = false
        let updataProcess = [],processConfig ={}
        this.data.forEach(item=>{
          if(item.Id === id){
            updataProcess = item
            updataProcess.ProcessConfigNode.forEach(item => {
              if (item.ProcessConfigLine) {//当存在暂时存储回归线数据的属性时
                item.ProcessConfigLine.ToId != '' ? lines.push(item.ProcessConfigLine) : ''
              } else {//以下是直接从数据库取出来的数据
                lines = updataProcess.ProcessConfigLine
              }
              let obj = {
                Member: [],
                Id: item.Id,
                Name: item.Name,
                Index: item.Index
              }
              let members = item.Members
              members.forEach(is => {
                let memberObj = {
                  ConfigType: is.ConfigType,
                  ObjectId: is.ObjectId,
                  ObjectName: is.ObjectName
                }
                obj.Member.push(memberObj)
              })
              if(obj.Member.length==0){
                stop = true
              }
              nodes.push(obj)
            })
            processConfig = {
              ProcessConfigStart: updataProcess.ProcessConfigStart,
              ProcessConfigNode:nodes,
              ProcessConfigLine: lines,
              Id: updataProcess.Id,
              SYS_ProMenu_Id: updataProcess.SYS_ProMenu_Id,
              ProcessMenuCode: updataProcess.ProcessMenuCode,
              SYS_Pro_HashCode: updataProcess.SYS_Pro_HashCode,
              BusinessProcessName: updataProcess.BusinessProcessName,
              BusinessStartName: updataProcess.BusinessStartName
            }
            if (!stop){//为true 时证明流程中有配置的节点，并组织保存操作
              UpdateProcessConfig(processConfig).then(res => {
              if(res.code==0){
                promptInfoFun(this,2,res.message)
                this.getInfo()
              }else{
                promptInfoFun(this,1,res.message)
                this.getInfo()
              }
            })
            } else {
              promptInfoFun(this,1,'未配置节点不能进行操作！')
            }
          }
      })
      },
      resetNode(item,num){//撤销操作
        let oldData = JSON.parse(localStorage.getItem('oldProcessInfo'))//从本地获取原始数据
        oldData.forEach((items,index)=>{
          if(items.Id == item.Id){
            this.data[index].BusinessStartName = items.BusinessStartName
            this.data[index].ProcessConfigLine = items.ProcessConfigLine
            this.data[index].ProcessConfigNode = items.ProcessConfigNode
            this.data[index].ProcessConfigStart = items.ProcessConfigStart
            this.data[index].lines = items.lines
            this.ifScoll = false//撤销时候 重新计算容器宽度及初始化滚动条位置
            this.getWidth('teams_node' + num, 195, this.data[index].ProcessConfigNode)//动态计算流程模块实际宽度
          }
        })
        document.getElementsByClassName('contralSee' + num)[0].classList.remove('onPointer')//控制保存及撤销按钮权限
        document.getElementsByClassName('contralSee' + num)[1].classList.remove('onPointer')
      },
    },
    mounted() {
      Bus.$off('moveNode')
      Bus.$off('moveNodeEmpty')
      Bus.$off('getNewNodes')
      Bus.$off('saveProcessNodeInfo')
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
      Bus.$on('saveProcessNodeInfo', (msg) => {//从子元素获取节点配置内容并替换当前所在对象数据
        let updataProcess = [],num = 0
        this.data.forEach((item,index)=>{
          if(item.Id === msg.id){
            updataProcess = item
            num = index + 1
            if(msg.type==1){//流程节点暂存
              updataProcess.ProcessConfigNode.forEach(i=>{
                if(i.Id == msg.data.Id){//Name 用于节点名称渲染，ModuleName用于子组件模板名称匹配
                  i = msg.data//获取当前节点修改信息替换修改前信息
                  i.Name = msg.data.ModuleName
                }
              })
            }else {//操作员暂存
              updataProcess.BusinessStartName = msg.data.ModuleName
              msg.data.Members.forEach(k=>{
                delete k.Id
              })
              updataProcess.ProcessConfigStart = msg.data.Members
            }
          }
        })

        document.getElementsByClassName('contralSee' + num)[0].classList.add('onPointer')//修改保存撤销按钮状态
        document.getElementsByClassName('contralSee' + num)[1].classList.add('onPointer')
      })
    }
  }
</script>
