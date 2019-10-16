<template>
  <!-- 新增弹窗 -->
  <div>
    <customTable ref="myChild" />
    <div class="main-padding-20-y">
      <el-table
        :key="tableKey"
        :data="tableData"
        border
        :height="tableHeight"
        style="width: 100%;"
        :header-cell-style="{'background-color': '#F0F2F5'}"
        :cell-style="{'padding':'7px 0'}"
        @sort-change="sortChanges"    
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="as" type="selection" width="55" :selectable="checkboxT">
          
        </el-table-column>

        <el-table-column type="index" label="序号" width="80" align="center" />
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            :key="index"
            min-width="100px"
            :prop="item.ColProp"
            align="center"
            sortable="custom"
            :label="item.ColDesc"
          />
        </template>
        <el-table-column label="操作" align="center" class-name="small-padding">
          <template slot-scope="{row}">
            <div class="display-flex justify-content-flex-center">
              <div class="main-color" @click="handleUpdate(row)">
                <a>编辑</a>
              </div>
              <div class="main-color-red pl-15" @click="delRow(row)">
                <a>删除</a>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import customTable from "@/components/CustomTable/index";
export default {
  props: {
    listQuery: {
      type: Object,
      default: function() {
        return {};
      }
    },
    total: {
      type: Number,
      default: 0
    },
    tableHeight: {
      type: Number,
      default: 100
    },
    formHeight: {
      type: Number,
      default: 100
    },
    tableData: {
      type: Array,
      default: []
    }
  },
  components: { Pagination, customTable },
  mounted() {
    this.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
    this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
  },
  computed: {
    tableHead: function() {
      let arrayHead = this.checksData.filter(item => {
        return item.IsCheck;
      });
      return arrayHead;
    }
  },
  data() {
    return {
      tableKey: 1,
      checksData: []
    };
  },
  methods: {
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      if (this.tableData.length > 0) {
        this.listQuery.page = 1;
        this.getList();
      }
    },
    getList() {},
   checkboxT(row,index){
      if(row.Id=='ad0a3b59-f6c3-4a83-bca1-88a38b824e84'){        
          return false
      }  
       return true
   },
   handleSelectionChange(val){
       console.info(val)
   }
  }
};
</script>
<style lang="scss" scoped>
.disable-checkbox {
  width: 14px;
  height: 14px;
  border: 1px solid #aaa;
  .disable-checkbox-small {
    width: 10px;
    height: 10px;
    margin:1px;
    background: #aaa;
  }
}
</style>

