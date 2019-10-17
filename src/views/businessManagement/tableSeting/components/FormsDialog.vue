<template>
  <div class="formsDialog">
    <el-dialog
      :close-on-click-modal="false"
      top="25vh"
      title="用户表册定位"
      :visible.sync="formsVisible"
      class="my_header"
      width="1000px">
      <el-table :data="gridData" border @sort-change="sortChanges" @row-click="getCurInfo" height="300">
        <el-table-column type="index" label="序号" width="80" align="center" fixed="left"/>
        <el-table-column property="CustomerNo" align="center" label="用户编号" sortable='custom' prop="CustomerNo"></el-table-column>
        <el-table-column property="CustomerName" align="center" label="用户名称" sortable='custom' prop="CustomerName"></el-table-column>
        <el-table-column property="Tel" align="center" label="电话"></el-table-column>
        <el-table-column property="SA_UserArea" align="center" label="所属区域" sortable='custom' prop="SA_UserArea"></el-table-column>
        <el-table-column property="WaterMeterType" align="center" label="水表类型" sortable='custom' prop="WaterMeterType"></el-table-column>
        <el-table-column property="Address" align="center" label="地址" prop="Address" sortable='custom'></el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="rbp.page"
        :limit.sync="rbp.limit"
        @pagination="searchFun"/>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      top="30vh"
      title="用户表册定位"
      :visible.sync="formsDetailVisible"
      class="my_header"
      width="400px"
      @close = getFormDetail>
      <p class="accurate"><i class="el-icon-location"></i>
        用户<span> {{ name }} </span>位于表册<span> "{{ formName }}" </span>中</p>
    </el-dialog>
  </div>
</template>

<script>
  import { GetOrientationList } from "@/api/registerBook"
  import Pagination from '@/components/Pagination/index'//分页

  export default {
    name: "FormsDialog",
    components: { Pagination },
    data(){
      return{
        name:'',
        formName:'',
        rbp:{},
        formsVisible:false,
        formsDetailVisible:false,
        gridData:[],//定位列表数据
        total:0,
        curDetial:{},//筛选之后的用户数据
      }
    },
    methods:{
      sortChanges({prop, order }){//排序
        this.rbp.filed = prop
        this.rbp.sort = order =='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.gridData.length>0){
          this.rbp.page = 1
          this.searchFun()
        }
      },
      getCurInfo(row){
        /*定位父级表册当前用户位置*/
        let self = this
        this.curDetial = row
        this.formsVisible = false
        setTimeout(function () {
          self.formsDetailVisible = true
          self.name = row.CustomerName
          self.formName = row.BookName
        },200)
      },
      searchFun(){//列表查询，主要用于排序
        GetOrientationList(this.rbp).then(res => {
          if (res.code == 0) {
            this.gridData = res.data
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      getFormDetail(){//调用父页面表册用户方法
        this.$parent.handleUser(this.curDetial,2)
      }
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
