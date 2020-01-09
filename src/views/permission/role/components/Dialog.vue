<template>
  <!-- 编辑弹窗 -->
  <el-dialog
    custom-class="nopadding"
    :title="dialogStatus==='create'?'添加':'编辑'"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    top="10vh"
    width="1000px"
    center
    @open="opened"
  >
    <div class="role-top-box">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :inline="true"
        class="form-inline-small-input head-search-form"
        size="small"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item label="角色名称" prop="RoleName">
          <el-input v-model="temp.RoleName" maxlength="20" placeholder="长度20内" />
        </el-form-item>
      </el-form>
    </div>
    <div class="config-box">
      <div class="role-title">权限分配</div>
      <div class="config-container">
        <div v-for="(item,i) in arr" :key="i+1" class="show-border">
          <div class="config-title">
            <el-checkbox
              :indeterminate="item.isIndeterminate"
              v-model="item.checked"
              @change="handleCheckedOne(i)"
            >{{item.name}}</el-checkbox>
          </div>
          <!-- 子集 循环 二级 body-->
          <div class="config-item" v-for="(temp,child) in item.child" :key="temp.nId">
            <div
              v-if="temp.childrens.length<1"
              class="config-body-box display-flex align-items-center"
            >
              <div class="config-body-left">
                <el-checkbox
                  :indeterminate="temp.isIndeterminate"
                  :label="temp.nId"
                  v-model="temp.checked"
                  @change="handleCheckedTwo()"
                >{{temp.name}}</el-checkbox>
              </div>
              <div class="config-body-right display-flex flex-wrap">
                <el-checkbox
                  v-model="btn.checked"
                  :label="btn.nId"
                  v-for="(btn,n) in temp.button"
                  :key="btn.nId"
                  @change="handleCheckedNoThreeButton(i,child)"
                >{{btn.name}}</el-checkbox>
              </div>
            </div>
            <div v-else class="config-body-box">
              <!-- 有3级的第二个父级 -->
              <div class="display-flex align-items-center config-item">
                <div class="config-body-left">
                  <el-checkbox
                    :indeterminate="temp.isIndeterminate"
                    v-model="temp.checked"
                    @change="handleCheckedTwo(i,child)"
                  >{{temp.name}}</el-checkbox>
                </div>
                <div class="config-body-right display-flex flex-wrap">
                  <div>&nbsp;</div>
                </div>
              </div>
              <!-- 循环第3级 s-->
              <div class="config-item" v-for="(last,childrens) in temp.childrens" :key="last.nId">
                <div class="config-body-box display-flex align-items-center">
                  <div class="config-body-left three-title">
                    <el-checkbox
                      @change="handleCheckedThree(i,child,childrens)"
                      :indeterminate="last.isIndeterminate"
                      v-model="last.checked"
                      :label="last.nId"
                    >{{last.name}}</el-checkbox>
                  </div>
                  <div class="config-body-right display-flex flex-wrap">
                    <el-checkbox
                      @change="handleCheckedButton(i,child,childrens)"
                      v-model="btn.checked"
                      :label="btn.nId"
                      v-for="(btn,n) in last.button"
                      :key="btn.nId"
                    >{{btn.name}}</el-checkbox>
                  </div>
                </div>
              </div>
              <!-- 循环第3级 e-->
            </div>
          </div>
          <!-- 子集 -->
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        @click="dialogStatus==='create'?createData():updateData()"
      >确认</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {GetRoleModel} from "@/api/role";
export default {
  props: {
    dialogStatus: {
      type: String,
      default: function() {
        return "";
      }
    },
    temp: {
      type: Object,
      default: function() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        RoleName: [
          { required: true, message: "不能为空", trigger: "blur" },
          { max: 20, message: "最大长度20个字符", trigger: "blur" }
        ]
      },
      arr: [
        {
          name: "权限管理",
          checked: false,
          isIndeterminate: false,
          child: [
            {
              name: "账号管理",
              childrens: [],
              nId: 1,
              checked: false,
              isIndeterminate: false,
              button: [
                { name: "添加", nId: 11, checked: false },
                { name: "编辑", nId: 22, checked: false }
              ]
            },
            {
              name: "角色管理",
              childrens: [],
              nId: 2,
              checked: false,
              isIndeterminate: false,
              button: [
                { name: "添加", nId: 33, checked: false },
                { name: "编辑", nId: 44, checked: false }
              ]
            }
          ]
        },
        {
          name: "业务管理",
          checked: false,
          isIndeterminate: false,
          child: [
            {
              name: "抄表查询",
              checked: false,
              isIndeterminate: false,
              childrens: [
                {
                  name: "按抄表计划查询",
                  checked: false,
                  isIndeterminateThree: false,
                  button: [{ name: "删除", checked: false }]
                },
                {
                  name: "按抄表日期查询",
                  checked: false,
                  isIndeterminateThree: false,
                  button: [{ name: "删除", checked: false }]
                }
              ],
              button: []
            },
            {
              name: "抄表设置",
              childrens: [],
              checked: false,
              isIndeterminate: false,
              button: [
                { name: "删除抄表记录", checked: false },
                { name: "抄表录入确定", checked: false }
              ]
            }
          ]
        }
      ],
      dialogFormVisible: false
    };
  },
  watch: {
    show() {
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.dialogFormVisible = this.show;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:show", val);
    }
  },
  methods: {
    opened() {
      // let obj = {
      //   checked: false,
      //   isIndeterminate: false
      // };
      // this.arr = this.arr.map(item => {
      //   return { ...item, ...obj };
      // });
      GetRoleModel(this.temp.Id).then(res=>{
        console.info(res)
        this.arr=res.data.Menus
      })
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;
        this.$emit("createData", this.temp);
      });
    },
    updateData() {
      // this.$refs["dataForm"].validate(valid => {
      //   if (!valid) return false;
      //   this.$emit("updateData", this.temp);
      // });
      console.info(this.arr)
    },
    handleCheckedNoThreeButton(first, index) { //没有标签页的按钮点击事件    
      // 处理二级
      let buttonArr = this.arr[first].child[index].button.filter(button => {
        return button.checked;
      });
      if (buttonArr.length == this.arr[first].child[index].button.length) {
        this.arr[first].child[index].checked = true;
        this.arr[first].child[index].isIndeterminate = false;
      } else if (buttonArr.length == 0) {
        this.arr[first].child[index].checked = false;
        this.arr[first].child[index].isIndeterminate = false;
      } else {
        this.arr[first].child[index].checked = true;
        this.arr[first].child[index].isIndeterminate = true;
      }   
      this.setCheckedOne(first); // 处理1级复选框
    },
    handleCheckedButton(first, index, children) {//有标签页的按钮事件    
      if (first) {
        this.arr[first].child[index].childrens.forEach(childrens => {
          let btnCheckedArr = childrens.button.filter(button => {
            return button.checked == true;
          });
          if (btnCheckedArr.length == childrens.button.length) {
            //该行按钮全选
            childrens.checked = true;
          } else if (btnCheckedArr.length == 0) {
            childrens.checked = false;
          } else {
            childrens.checked = true;
            childrens.isIndeterminate = true;
          }
        });
      }
      this.handleCheckedThree(first, index, children);
    },
    handleCheckedThree(first, index, children) {//标签页事件    
      if (this.arr[first].child[index].childrens[children].checked) {
        this.arr[first].child[index].childrens[children].button.forEach(
          button => {
            button.checked = true;
          }
        );
      } else {
        this.arr[first].child[index].childrens[children].button.forEach(
          button => {
            button.checked = false;
          }
        );
      }
      // 处理第二级复选样式
      let childrensArr = this.arr[first].child[index].childrens.filter(
        childrens => {
          return childrens.checked == true;
        }
      );
      if (
        childrensArr.length === this.arr[first].child[index].childrens.length
      ) {
        //全选
        this.arr[first].child[index].checked = true;
        this.arr[first].child[index].isIndeterminate = false;
      } else if (childrensArr.length == 0) {
        this.arr[first].child[index].checked = false;
        this.arr[first].child[index].isIndeterminate = false;
      } else {
        this.arr[first].child[index].checked = true;
        this.arr[first].child[index].isIndeterminate = true;
      }
      this.setCheckedOne(first); //处理1级复选框
    },
    handleCheckedTwo(first, index) { //二级页面事件 
      if (first) {//如果是从有第三级过来的事件,需要处理标签页
        this.arr[first].child[index].isIndeterminate = false;   
        if (this.arr[first].child[index].checked) {
          //第三级和按钮处理选中
          this.arr[first].child[index].childrens.forEach(childrens => {
            childrens.checked = true;
            childrens.isIndeterminate = false;
            childrens.button.forEach(button => {
              button.checked = true;
            });
          });
        } else {
          this.arr[first].child[index].childrens.forEach(childrens => {
            childrens.checked = false;
            childrens.isIndeterminate = false;
            childrens.button.forEach(button => {
              button.checked = false;
            });
          });
        }
      }
      this.arr.forEach((item, i) => {
        let checkedArr = item.child.filter(i => {
          //二级勾选
          return i.checked;
        });
        if (checkedArr.length == item.child.length) {
          //二级全选
          this.arr[i].checked = true; //一级全选
          this.arr[i].isIndeterminate = false; //
          this.arr[i].child.forEach(n => {
            if (n.childrens.length > 0) {
              n.childrens.forEach(childrens => {
                childrens.checked = true;
                childrens.button.forEach(button => {
                  button.checked = true;
                });
              });
            } else {
              n.button.forEach(m => {
                //按钮全选
                m.checked = true;
              });
            }
          });
        } else if (checkedArr.length == 0) {
          this.arr[i].checked = false; //一级全选 false
          this.arr[i].isIndeterminate = false; //
          this.arr[i].child.forEach(n => {
            if (n.childrens.length > 0) {
              n.childrens.forEach(childrens => {
                childrens.button.forEach(button => {
                  button.checked = false;
                });
              });
            } else {
              n.button.forEach(m => {        
                m.checked = false;//按钮全选
              });
            }
          });
        } else {
          this.arr[i].checked = true; //
          this.arr[i].isIndeterminate = true; //一级全选
          this.arr[i].child.forEach(n => {
            n.button.forEach(m => {
              //按钮
              if (n.checked) {
                m.checked = true;
              } else {
                m.checked = false;
              }
            });
          });
        }
      });
    },
    handleCheckedOne(first) {//1级事件   
      let isChecked = this.arr[first].checked;
      this.arr[first].isIndeterminate = false;
      this.arr[first].child.forEach(child => {
        child.checked = isChecked;
        child.isIndeterminate = false;
        if (child.childrens.length > 0) {
          //如果有第三级
          child.childrens.forEach(childrens => {
            childrens.checked = isChecked;
            childrens.isIndeterminate = false;
            childrens.button.forEach(button => {
              button.checked = isChecked;
            });
          });
        } else {
          child.button.forEach(button => {
            button.checked = isChecked;
          });
        }
      });
    },
    setCheckedOne(first) {// 共用->处理1级复选框   
      let isIndeterminateArr = this.arr[first].child.filter(item => { //筛选二级有“-”  
        return item.isIndeterminate;
      });
      let checkedArr = this.arr[first].child.filter(item => {//筛选二级有几个的全选   
        return item.checked && item.isIndeterminate == false;
      });
      if (
        isIndeterminateArr.length > 0 ||
        (checkedArr.length !== this.arr[first].child.length &&
          checkedArr.length > 0)
      ) {
        this.arr[first].checked = true;
        this.arr[first].isIndeterminate = true;
      } else if (checkedArr.length == this.arr[first].child.length) {
        this.arr[first].checked = true;
        this.arr[first].isIndeterminate = false;
      } else {
        this.arr[first].checked = false;
        this.arr[first].isIndeterminate = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.role-top-box {
  border-bottom: 10px solid #eff1f4;
  padding: 20px 0 10px 0;
}
.role-title {
  color: #5b5b5b;
  font-size: 16px;
  font-weight: bold;
  border-left: 4px solid #29beb0;
  padding-left: 10px;
}
.config-box {
  padding: 16px 19px;
}
.config-container {
  border: 1px solid #e2e9ed;
  border-bottom: none;
  .config-title {
    background: #c2d6c7;
    color: #535353;
    padding: 9px 10px;
  }
  .config-body-box {
    line-height: 39px;
  }
  .config-body-left {
    padding-left: 30px;
    width: 235px;
  }
  .config-body-right {
    padding: 0 10px;
    border-left: 1px solid #e2e9ed;
  }
  .three-title {
    padding-left: 50px;
  }
}
.show-border {
  .config-item {
    border-bottom: 1px solid #e2e9ed;
    .config-item:last-child {
      border-bottom: none;
    }
  }
}
</style>

