<template>
  <div class="formsDialog">
    <el-dialog
      :close-on-click-modal="false"
      top="25vh"
      title="用户表册定位"
      :visible.sync="formsVisible"
      class="my_header"
      width="1200px">
      <el-table :data="gridData" border @sort-change="sortChanges" @row-click="getCurInfo" height="300">
        <el-table-column property="date" align="center" label="序号" width="150" prop=""></el-table-column>
        <el-table-column property="name" align="center" label="用户编号" width="200"></el-table-column>
        <el-table-column property="address" align="center" label="用户名称"></el-table-column>
        <el-table-column property="address" align="center" label="电话"></el-table-column>
        <el-table-column property="address" align="center" label="所属区域"></el-table-column>
        <el-table-column property="address" align="center" label="水表类型"></el-table-column>
        <el-table-column property="address" align="center" label="地址"></el-table-column>
        <el-table-column property="address" align="center" label="备注"></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="limit"
        @pagination="searchFun"/>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      top="30vh"
      title="用户表册定位"
      :visible.sync="formsDetailVisible"
      class="my_header"
      width="400px">
      <p class="accurate"><i class="el-icon-location"></i>
        用户<span> 张三 </span>位于表册<span> "xx" </span>中</p>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination/index'//分页
  export default {
    name: "FormsDialog",
    components: { Pagination },
    data(){
      return{
        formsVisible:false,
        formsDetailVisible:false,
        gridData:[
          {date:'1',name:'2',address:'2'},
          {date:'2',name:'2',address:'2'},
          {date:'2',name:'2',address:'2'}
        ],
        total:11,
        page:1,
        limit:5
      }
    },
    methods:{
      sortChanges({prop, order }){//排序

      },
      getCurInfo(row){
        /*定位父级表册当前用户位置*/
        let self = this
        this.formsVisible = false
        setTimeout(function () {
          self.formsDetailVisible = true
        },200)
      },
      searchFun(){}
    }
  }
</script>
<style lang="scss">
  .formsDialog{
    .accurate{
      padding: 25px 0 40px 0;
      font-size: 16px;color: #777C82;text-align: center;
      span{color: #46494C}
      i{color: #5E920E;font-size: 18px;}
    }
    .my_header .el-dialog__header{background: #5E920E}
  }
</style>
