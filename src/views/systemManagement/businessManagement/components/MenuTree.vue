<template>
  <el-menu class="el-menu-vertical-demo"
           @select="setTreeId"
           :default-active="activeNum"
           :default-openeds="openeds">
    <el-submenu v-for="(item,index) in data" v-if="item.Children" :key="index" :index="item.Id">
      <template slot="title">
        <span>{{ item.MenuCNName }}</span>
      </template>
      <el-menu-item v-for="(i,s) in item.Children" :index="i.Id" :key="s">{{ i.MenuCNName }}</el-menu-item>
    </el-submenu>
    <el-menu-item v-for="(item,index) in data" v-else :key="index" :index="item.Id">
      <span slot="title">{{ item.MenuCNName }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  import Bus from '@/utils/bus'
  import { GetProcessMenu } from "@/api/operationFlow"
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "MenuTree",
    data() {
      return {
        openeds: [],
        activeNum:"",//当前选中节点ID
        data:[]
      }
    },
    methods: {
      getData(){//获取树形结构数据
        GetProcessMenu().then(res => {//删除节点
          if (res.code ==0 ) {
            this.data = res.data
            res.data[0].Children ? (this.openeds.push(res.data[0].Id), this.activeNum = res.data[0].Children[0].Id) : this.activeNum = res.data[0].Id
            res.data[0].Children ? localStorage.setItem('menuId',res.data[0].Children[0].ProcessMenuCode) : localStorage.setItem('menuId',res.data[0].ProcessMenuCode)
            res.data[0].Children ? localStorage.setItem('menuCode',res.data[0].Children[0].Id) : localStorage.setItem('menuId',res.data[0].Id)
            Bus.$emit('getNewNodes')
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setTreeId(index,path){//点击选中切换当前节点，index 匹配栏目ID ，根据path 第一个数据判断当前点击的是哪个数组中的数据
        this.activeNum = index
        let data = this.data[path[0].slice(0,1)].Children
        data.forEach(item=>{
          if(item.Id == index){
            localStorage.setItem('menuId',item.ProcessMenuCode)//实际栏目code
            localStorage.setItem('menuCode',item.Id)//实际栏目ID
            Bus.$emit('getNewNodes')
          }
        })
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>
