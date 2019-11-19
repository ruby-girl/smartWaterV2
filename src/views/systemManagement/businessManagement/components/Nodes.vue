<template>
  <div class="node_box">
    <div class="ifExamine">
      <el-button icon="el-icon-plus" type="primary" size="small">新增流程</el-button>
      <p>是否开启审核 &nbsp;<el-switch v-model="ifExamine"></el-switch>
      </p>
    </div>
    <div class="team_item">
      <!--流程 s-->
      <div v-for="(item,index) in data" :key="index">
        <div>
          <ul :id="'teams_node'+ (index+1)" class="teams_node clearfix">
            <li class="item_cont">
              <div>
                <p><i class="iconfont iconliuchengkaishi"></i>操作员</p>
                <span class="btnSpan btnSpanLeft">配置</span>
              </div>
              <i class="iconfont iconchangjiantou"></i>
            </li>
            <!--审核人-->
            <li class="item_cont" v-for="(items,indexs) in item.node" :key="indexs">
              <div class="item_cont_box">
                <p>{{ items.name }}</p>
                <span class="btnSpan btnSpanLeft">配置</span>
                <span class="btnSpan btnSpanRight" v-show=" indexs > 0">删除</span>
              </div>
              <i
                :class="indexs == item.node.length - 2? 'iconfont iconchangjiantou iconfontColor':'iconfont iconchangjiantou'"
                v-show="indexs!= item.node.length - 1"></i>
              <label class="el-icon-circle-plus-outline" v-show="indexs == item.node.length - 1"></label>
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
          <i class="iconfont iconfuzhi" title="复制"></i>
          <i class="iconfont iconlajitong"></i>
        </p>
      </div>
      <!--流程 e-->
    </div>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'

  export default {
    name: "Nodes",
    data() {
      return {
        ifExamine: true,
        data: []
      }
    },
    methods: {
      getInfo() {//获取数据，动态计算每个流程宽度
        let data = [
          {
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
            member: [],//几点具体集合成员数据
          },
          {
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
            member: [],//几点具体集合成员数据
          },
        ]
        this.data = data

        data.forEach((item, index) => {
          let className = 'teams_node' + (index + 1)
          let curData = item.node//当前node节点数据
          this.getWidth(className, 195, curData)//动态计算流程模块实际宽度
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
          let obj = document.getElementById(id)
          new Sortable(obj, {
            group: {
              name: 'shared',
              pull: 'clone',
            },
            animation: 150,
            sort: false,
            // 元素从一个列表拖拽到另一个列表
            onAdd: function (evt) {
              evt.stopPropagation()
              var itemEl = evt.item;
              evt.to;
              evt.from;
              evt.oldIndex;
              evt.newIndex;
              evt.clone
              evt.pullMode;
              console.log(evt.to)
              console.log(evt)
            },
            forceFallback: function () {
              alert(1)
            }
          });
        })
      }
    },
    mounted() {
      this.getInfo()
    }
  }
</script>

<style scoped>

</style>
