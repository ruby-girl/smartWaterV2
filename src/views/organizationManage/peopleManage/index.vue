<template>
  <div class="cl-container cl-container2">
    <div style="width: 100%;position: relative">
      <SelectHead ref="childSelect" @getText="getText"></SelectHead>
      <div class="table-setting">
        <el-button size="mini" type="primary" round @click="addNewFun"><i class="icon iconfont">&#xe689;</i>添加</el-button>
      </div>
      <!--列表数据 s-->
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(queryData.page - 1) * queryData.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <template v-for="(item ,index) in tableHead">
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="200px"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed= "item.Freeze">
            <template slot-scope="scope">
              <i v-if="item.ColProp == 'EnrollingTime'||item.ColProp == 'Birthday'">
                {{ scope.row[item.ColProp]!=''&&scope.row[item.ColProp]!=null? scope.row[item.ColProp].split(' ')[0]:''}}
              </i>
              <i v-else>
                {{ scope.row[item.ColProp] }}
              </i>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc">
            <template slot-scope="scope">
              <i v-if="item.ColProp == 'EnrollingTime'||item.ColProp == 'Birthday'">
                {{ scope.row[item.ColProp]!=''&&scope.row[item.ColProp]!=null? scope.row[item.ColProp].split(' ')[0]:''}}
              </i>
              <i v-else>
                {{ scope.row[item.ColProp] }}
              </i>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="120px"  align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="编辑" placement="bottom-start">
              <a class="operation1" @click="handleEdit(scope.row,1)"><i class="iconfont icon iconsuoyoubiaogelidebianji"></i></a>
            </el-tooltip>
            <el-tooltip effect="light" content="详情" placement="bottom-start">
              <a class="operation3" @click="handleEdit(scope.row,2)"><i class="iconfont icon iconbiaodan"></i></a>
            </el-tooltip>

            <el-tooltip effect="light" content="删除" placement="bottom-start"  v-if="scope.row.SYS_User_Id.length <= 0">
              <a class="operation2" @click="handleDelete(scope.row)"><i class="icon iconfont iconsuoyoubiaogelideshanchu"></i></a>
            </el-tooltip>
            <el-tooltip v-else effect="dark" content="人员已留有数据，不可删除" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;"><i class="icon iconfont iconsuoyoubiaogelideshanchu"></i></a>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryData.page"
        :limit.sync="queryData.limit"
        @pagination="searchFun"
      />
      <!--列表数据 e-->
    </div>
    <!--新增s-->
    <addmponent ref="child" v-on:Changed = "changeMsg($event)"></addmponent>
    <!--新增e-->
    <!--编辑s-->
    <editmponent ref="child2" v-on:Changed1 = "changeMsg1($event)"></editmponent>
    <!--编辑e-->
    <!--详情s-->
    <detailmponent ref="child3"></detailmponent>
    <!--详情e-->
  </div>
</template>
<script>
  import SearchTips from "@/components/SearchTips/index";
  import '@/styles/organization.scss'
  import SelectHead from './components/SelectHead'
  import customTable from '@/components/CustomTable/index'
  import Pagination from '@/components/Pagination/index'
  import addmponent from './components/Add'
  import editmponent from './components/Edit'
  import detailmponent from './components/Detail'
  import { peopleDelete, peopleUpDate, peopleGetList, ComboBoxList, linkComboBoxList , GetRoleNameList, Employee_Execl, WaterFactoryComboBoxList} from "@/api/organize"
  import { getTime } from "@/utils/index";
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑

  export default {
    name: 'peopleManage',
    components: {customTable, Pagination, addmponent, editmponent, detailmponent, SelectHead, SearchTips},
    data() {
      return {
        tableHeight: null,//表格高度
        queryData: {//查询条件对象
          tableId: '0000003'
        },
        total: 0,
        tableData: [],
        checkAllData: [],
        checksData: [],
        customHeight: '',
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
      }
    },
    computed: {
      tableHead: function () {//获取表头字段
        const arrayHead = []
        const data = this.checksData
        for (let i = 0; i < data.length; i++) { // 过滤选中列
          if (data[i].IsCheck) {
            arrayHead.push(data[i])
          }
        }
        return arrayHead
      }
    },
    methods: {
      changeMsg(msg){//接受新增子组件触发事件
        if(msg==1){
          this.$refs.child.addVisible = false
          this.searchFun()
        }else{
          this.$refs.child.addVisible = msg
        }
      },
      changeMsg1(msg){//接受编辑子组件触发事件
        if(msg==1){
          this.$refs.child2.editVisible = false
          this.searchFun()
        }else{
          this.$refs.child2.editVisible = msg
        }
      },
      setCustomData() {//表格自定义
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
        this.customHeight = this.$refs.myChild.isCustom
      },
      exportExcel() {//导出事件
        if(this.tableData.length<=0){
          this.$message({
            message: '当前列表无数据，不可导出',
            type: 'warning',
            duration: 4000
          });
          return false
        }
        let jp;
        if (!this.$refs.childSelect.ifMore) {//此时查询条件不包含隐藏字段
          jp = {
            page: this.queryData.page,
            limit: this.queryData.limit,
            filed: this.queryData.filed,
            sort: this.queryData.sort,
            SYS_Department_Id: this.queryData.SYS_Department_Id,
            OA_Job_Id: this.queryData.OA_Job_Id,
            EmpNo: this.queryData.EmpNo,
            JobStatus: this.queryData.JobStatus,
            EnrollingTime: this.queryData.EnrollingTime,
            EnrollingTimeEnd: this.queryData.EnrollingTimeEnd,
            Gender: this.queryData.Gender,
            IDNumber: '',
            MobileNumber: '',
            Birthday: '',
            BirthdayEnd: '',
            editUserId: '-1',//操作者
            editStartTime: '',//操作开始结束时间
            editEndTime: '',
            EmailAddress: '',
            AccountStatus: '-1',
            tableId: '0000003'
          }
        } else {
          jp = this.queryData
        }
        Employee_Execl(jp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      handleEdit(row, type) {//编辑及新增方法
        let self = this
        if (type == 1) {//显示编辑弹窗信息
          self.$refs.child2.editVisible = true
          self.$nextTick(() => {
            self.$refs.child2.getInfo(row.Id)
          })
        } else {//显示详情弹窗信息
          self.$refs.child3.detailVisible = true
          self.$nextTick(() => {
            self.$refs.child3.getInfo(row.Id)
          })
        }
      },
      addNewFun() {//新增方法
        this.$refs.child.addVisible = true
      },
      handleDelete(row) {//删除
        this.$confirm("是否删除当前信息", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          peopleDelete({id: row.Id}).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4000
              });
              this.searchFun()
            } else {
              this.$message({
                message: res.message,
                type: 'warning',
                duration: 4000
              });
            }
          })
        });
      },
      searchFun() {//查询方法
        let jp;
        if (!this.$refs.childSelect.ifMore) {//此时查询条件不包含隐藏字段
          jp = {
            page: this.queryData.page,
            limit: this.queryData.limit,
            filed: this.queryData.filed,
            sort: this.queryData.sort,
            SYS_Department_Id: this.queryData.SYS_Department_Id,
            OA_Job_Id: this.queryData.OA_Job_Id,
            EmpNo: this.queryData.EmpNo,
            JobStatus: this.queryData.JobStatus,
            Gender: this.queryData.Gender,
            EnrollingTime: '',
            EnrollingTimeEnd: '',
            IDNumber: '',
            MobileNumber: '',
            Birthday: '',
            BirthdayEnd: '',
            editUserId: '-1',//操作者
            editStartTime: '',//操作开始结束时间
            editEndTime: '',
            EmailAddress: '',
            AccountStatus: '-1',
            tableId: '0000003'
          }
        } else {
          jp = this.queryData
        }
        peopleGetList(jp).then(res => {
          this.total = res.count;
          this.tableData = res.data;
          this.tipsData = pushItem(this.tipsDataCopy)
        })
      },
      sortChanges({prop, order }){//排序
        this.queryData.filed = prop
        this.queryData.sort = order =='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.queryData.page = 1
          this.searchFun()
        }
      },
      /**
       *val 对应绑定的参数
       *this this对象
       * this.tipsDataCopy   存储面包屑数据的数组
       * param  对应搜索条件的对象名
       */
      delTips(val) {
        switch (val) {
          case 'EntryTime':
            this.$refs.childSelect.queryData.EnrollingTime = ''
            this.$refs.childSelect.queryData.EnrollingTimeEnd = ''
            break
          case 'birthdayTime':
            this.$refs.childSelect.queryData.Birthday = ''
            this.$refs.childSelect.queryData.BirthdayEnd = ''
            break
          case 'operationTime':
            this.$refs.childSelect.queryData.editStartTime = ''
            this.$refs.childSelect.queryData.editEndTime = ''
            break
        }
        this.tipsDataCopy = delTips(val, this.$refs.childSelect, this.tipsDataCopy, "queryData"); //返回删除后的数据传给组件
        this.$refs.childSelect.searchFun()
      },
      /**
       *val 搜索数据值
       *model 对应绑定的属性
       * arr   下拉框循环的数组（输入框传“”）
       * name  对应的搜索lable
       */
      //处理搜索条件,面包屑
      getText(val, model, arr, name) {
        let obj = getText(val, model, arr, this.tipsDataCopy, this, name); //返回的组件需要的对象
        this.tipsDataCopy.push(obj);
      },
      getWaterFactory(){
        WaterFactoryComboBoxList().then(res => {
          if (res.code == 0) {
            this.$refs.child.WaterFactory = res.data
            this.$refs.child2.WaterFactory = res.data
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      }
    },
    mounted() {
      this.getWaterFactory();
      this.$refs.searchTips.$refs.myChild.GetTable(this.queryData.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 70
    }
  }
</script>
<style lang="scss">
  .people_info_box {
    .el-dialog__body{
      background: #F5F5F5;
      padding: 26px 24px 26px 24px;
      .edit_box{
        padding: 0;
      }
      .edit_box_moudler{
        background: #fff;padding: 1px 20px 5px 20px;margin-bottom: 10px;
        h3{color: #5B5B5B;font: bold 16px 'Microsoft YaHei';
          i{display: inline-block;width: 4px;height: 18px;background: #29BEB0;
            vertical-align: middle;
            margin: -3px 5px 0 0;}
        }
      }
      .el-form-item{margin-bottom: 16px;margin-right: 50px;}
    }
  }
</style>
