<template>
  <div class="node_box">
    <div class="ifExamine">
      <el-button icon="el-icon-plus" type="primary" size="small" @click="addProcess">新增流程</el-button>
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
            <li class="item_cont" v-for="(items,indexs) in item.node" :key="indexs">
              <div class="item_cont_box">
                <p>{{ items.name }}</p>
                <span class="btnSpan btnSpanLeft" @click="setFun(items.id)">
                      {{items.Members >0 ?'配置':'未配置'}}
                </span>
                <span class="btnSpan btnSpanRight" v-show=" indexs > 0">删除</span>
              </div>
              <i
                :class="indexs == item.node.length - 2? 'iconfont iconchangjiantou iconfontColor':'iconfont iconchangjiantou'"
                v-show="indexs!= item.node.length - 1"></i>
              <label class="el-icon-circle-plus-outline" v-show="indexs == item.node.length - 1" @click="addNode(item.node,1,index+1)"></label>
            </li>
            <!--审核人组-->
          </ul>

          <!--结束线-->
          <p class="line" v-for="(i,j) in item.line" :key="j"
             :style="'width:'+ (i.start-i.end) * 195 + 'px;height:' + (j+1)*28 + 'px;margin-top:' + -j*28 + 'px;margin-left:' + ((i.end -1 ) * 195 + 70) + 'px'">
            <i class="triangle_Up"></i>
            <i class="triangle_Left"></i>
          </p>

        </div>
        <p class="team_btn">
          <i class="iconfont iconfuzhi" title="复制" @click="copyFun(item.id)"></i>
          <i class="iconfont iconlajitong" @click="deleteProcess(item.id)"></i>
        </p>
      </div>
      <!--流程 e-->
      <p class="submit_btn">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </p>
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
  import { GetProcessConfigId, SetProcessMenuState } from "@/api/operationFlow"

  export default {
    name: "Nodes",
    components:{copyDialog:copyDialog, configureDialog:configureDialog},
    data() {
      return {
        moveTarget:{},//移入节点
        moveObj:[],//正再移入NODE集合
        moveId:'',//移入流程ID
        ifExamine: true,
        data: [],
        prohibit:false,//是否禁用审核权限开关
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
        let data = [
          {
            id:100,
            start: [],//审核人
            node: [//节点集合
              {id: 10, name: '审核组1'},
              {id: 11, name: '审核组2'},
              {id: 12, name: '审核组3'},
              {id: 13, name: '审核组4'},
            ],
            line: [//回归线集合
              {start: 12, end: 10},
              {start: 13, end: 11}
            ],
            Members: [],//几点具体集合成员数据
          },
          {
            id:102,
            start: [],//审核人
            node: [//节点集合
              {id: 14, name: '审核组1'},
              {id: 15, name: '审核组2'},
              {id: 16, name: '审核组3'},
              {id: 17, name: '审核组4'},
              {id: 18, name: '审核组5'},
            ],
            line: [//回归线集合
              {start: 16, end: 15},
              {start: 17, end: 15},
              {start: 18, end: 17},
            ],
            Members: [],//几点具体集合成员数据
          },
        ]
        this.data = data
        data.forEach((item, index) => {
          let className = 'teams_node' + (index + 1)
          let curData = item.node//当前node节点数据
          this.getWidth(className, 195, curData)//动态计算流程模块实际宽度
          this.getSort(className)
          let curLine = item.line
          curLine.forEach((i, j) => {//回归线对象
            let curLineItem = i
            for (let k in curLineItem) {//节点对象遍历
              curData.forEach((s, m) => {
                if (s.id == curLineItem[k]) {//配备ID替换节点位置
                  curLineItem[k] = m + 2 //跳过操作员模块，所有在下标的基础上+1再+1
                }
              })
            }
          })
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
                _this.moveTarget = JSON.parse(localStorage.getItem('curObj'))//移入前原对象
                _this.moveObj = _this.data[evt.el.id.replace('teams_node','') - 1].node || []//获取正移入对象集合
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
        if (type === 1) {
          obj.push({id: '', name: '审核组' + parseInt(obj.length + 1),Members:[]})
          this.getWidth('teams_node' + num, 195, obj)//动态计算流程模块实际宽度
          this.$nextTick(() => {
            document.getElementById('teams_node' + num).parentNode.scrollLeft = (obj.length+1)*195 + 30
          })
        } else {
          if (this.moveObj.length <= 0)//大于0时 证明有拖动对象容器
            return false
          obj = this.moveObj
          obj.push(this.moveTarget)
          this.getWidth(this.moveId, 195, obj)//动态计算流程模块实际宽度
          this.$nextTick(() => {
            document.getElementById(this.moveId).parentNode.scrollLeft = (obj.length+1)*195 + 30
          })
        }
      },
      addProcess(){//新增流程
        let obj = {
            start: [],//审核人
            node: [ {id: '', name: '审核组1'},],
            line: [],
            Members: [],//几点具体集合成员数据
          }
        this.data.push(obj)
        this.data.forEach((item, index) => {//初始化流程拖动事件
          let className = 'teams_node' + (index + 1)
          this.getSort(className)
        })

      },
      setFun(id){//流程节点配置
        let obj = {id: id, type: 1}
        Bus.$emit('NodesSetFun',obj)
      },
      peopleFun(){//操作员配置
        let obj = {id: 1, type: 3}
        Bus.$emit('NodesSetFun',obj)
      },
      copyFun(id){//复制流程
        this.$refs.copyChild.copyVisible = true
      },
      deleteProcess(id){//删除流程，本地删除
        this.$confirm("是否确认删除该流程？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass: "el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {

        })
      }
    },
    mounted() {
      this.getInfo()//初始化节点数据
      Bus.$off('moveNode')
      Bus.$off('moveNodeEmpty')
      Bus.$on('moveNode', () => {//触发手动添加节点事件
        this.addNode('',2)
      })
      Bus.$on('moveNodeEmpty', () => {//手动清空拖动记录数据
        this.moveTarget = {}
        this.moveObj = []
        this.moveId = ''
      })
    }
  }
</script>
