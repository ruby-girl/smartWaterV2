<template>
  <div class="section-container" style="padding-top:0;">
      <el-tabs v-model="typeCheck" @tab-click="handleClick">
      <el-tab-pane label="按用户查询" name="1">
         <user-type :query="query" :factoryId="factoryId" :date="newDate"/>
      </el-tab-pane>
      <el-tab-pane label="按水厂查询" name="2">    
       <factory-type @factoryToUser="factoryToUser"/>
      </el-tab-pane>
    </el-tabs>  
  </div>
</template>
<script>
import FactoryType from "./components/FactoryType"
import UserType from "./components/UserType"
  export default {
    name: "waterNatureChange",
    components: {FactoryType,UserType },
    data() {
      return {
        typeCheck:'1',
        query:{},
        factoryId:'',
        newDate:''
      };
    },
    methods:{
      handleClick(){},
       factoryToUser(query,factoryId){
         this.newDate=new Date()
        this.query=query
        this.factoryId=factoryId
        this.typeCheck='1'
    },
    }
  };
</script>
<style lang="scss">
</style>
