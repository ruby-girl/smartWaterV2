<template>
  <div>
    <el-form
      :inline="true"
      :model="formRbp"
      class="head-search-form"
      size="small"
      label-width="70px"
      @submit.native.prevent>
      <el-form-item label="所属区域" prop="SA_WaterFactory_Id" style="margin-right: 70px" v-show="type=='2'">
        <el-select v-model="formRbp.ecqt" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="CustomerQueryValue">
        <el-select v-model="formRbp.ecqt" placeholder="请选择" class="short-select-item"
                   style="width: 100px;float: left;">
          <el-option label="用户编号" value="1"/>
          <el-option label="姓名" value="2"/>
          <el-option label="电话" value="4"/>
        </el-select>
        <el-input v-model="formRbp.Customer" maxlength="50" placeholder="(长度1-50)"
                  style="width: 180px;float: left"/>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="mini" @click="searchFun" round><i class="icon iconfont">&#xe694;</i>查询
        </el-button>
      </el-form-item>
    </el-form>
    <div class="cl-operation1 fr">
      <el-button size="mini" class="cl-operation-btn" round @click=""><i class="icon iconfont">&#xe650;</i> 删除
      </el-button>
      <el-button size="mini" class="cl-operation-btn" round @click="">分配至</el-button>
    </div>
    <el-table :data="tableData" border ref="multipleTable" height="450px" @selection-change="handleSelectionChange"
              @sort-change="sortChanges">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="MeterReaderOrderNum"
        width="55"
        label="#">
      </el-table-column>
      <el-table-column
        prop="CustomerNo"
        label="用户编号"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="CustomerName"
        label="姓名"
        min-width="80px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="SA_UserArea"
        label="所属区域"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="Tel"
        label="电话"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="Address"
        label="用户地址"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="WaterMeterType"
        label="水表类型"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="SA_WaterFactory"
        label="水厂"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="排序号"
        width="88">
        <template slot-scope="scope">
          <el-input v-model="nums" placeholder="" size="mini"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="rbp.page"
      :limit.sync="rbp.limit"
      @pagination="searchFun"/>
  </div>
</template>

<script>
  import { GetOrientationList } from "@/api/registerBook"
  import Pagination from '@/components/Pagination/index'//分页
  import { promptInfoFun } from "@/utils/index"
  export default {
    name: "AllocationTable",
    components: {Pagination},
    data() {
      return {
        nums:'',//手动排序号
        type:'1',//是否显示区域选择项
        tableData:[{'CustomerNo':'1111'}],
        waterFactory:[],
        dataTypes:[],
        total:0,
        formRbp: {
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: "",
          ecqt: '1',
          Customer: "",
          SA_RegisterBookDetail_Id: "",
          SA_RegisterBookInfo_Id: ""
        },
        rbp: {},
        multipleSelection:[]
      }
    },
    methods:{
      searchFun(){//列表查询
        this.rbp = Object.assign({},this.formRbp)
        GetOrientationList(this.rbp).then(res => {
          if (res.code ==0 ) {
              this.tableData = res.data
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      sortChanges({prop, order }){//排序
        this.rbp.filed = prop
        this.rbp.sort = order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.rbp.page = 1
          this.searchFun()
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>
