<template>
  <el-menu class="el-menu-vertical-demo"
           @select="setTreeId"
           :default-active="activeNum"
           :default-openeds="openeds">
    <el-submenu v-for="(item,index) in data" v-if="item.Children" :key="index" :index="item.Id">
      <template slot="title">
        <span>{{ item.MenuCNName }}</span>
      </template>
      <el-menu-item v-for="(i,s) in item.Children" :index="i.Id">{{ i.MenuCNName }}</el-menu-item>
    </el-submenu>
    <el-menu-item v-for="(item,index) in data" v-else :key="index" :index="item.Id">
      <span slot="title">{{ item.MenuCNName }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
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
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setTreeId(index,path){//点击选中切换当前节点
        this.activeNum = index
        let data = this.data[path[0]].Children
        data.forEach(item=>{
          if(item.Id == index)
            localStorage.setItem('menuId',item.ProcessMenuCode)
        })
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>
