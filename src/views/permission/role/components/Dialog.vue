<template>
  <!-- 编辑弹窗 -->
  <el-dialog
    custom-class="nopadding"
    :title="dialogStatus==='create'?'添加':'编辑'"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    top="10vh"
    width="1010px"
    height
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
              :indeterminate="item.IsIndeterminate"
              v-model="item.Checked"
              @change="handleCheckedOne(i)"
            >{{item.Name}}</el-checkbox>
          </div>
          <!-- 子集 循环 二级 body-->
          <div class="config-item" v-for="(temp,child) in item.Childrens" :key="temp.Unique">
            <div
              v-if="temp.Childrens.length<1"
              class="config-body-box display-flex align-items-center"
            >
              <div class="config-body-left">
                <el-checkbox
                  :indeterminate="temp.IsIndeterminate"
                  :label="temp.Unique"
                  v-model="temp.Checked"
                  @change="handleCheckedTwo(i,child,false)"
                >{{temp.Name}}</el-checkbox>
              </div>
              <div class="config-body-right display-flex flex-wrap flex-1">
                <el-checkbox
                  v-model="btn.Checked"
                  :label="btn.Unique"
                  v-for="(btn,n) in temp.Buttons"
                  :key="btn.Unique"
                  @change="handleCheckedNoThreeButton(i,child)"
                >{{btn.Name}}</el-checkbox>
              </div>
              <i
                class="iconfont iconquestion main-color pr-15 pointer"
                @click="showImg(temp.Unique)"
                v-show="temp.Event=='true'"
              ></i>
            </div>
            <div v-else class="config-body-box">
              <!-- 有3级的第二个父级 -->
              <div class="display-flex align-items-center config-item">
                <div class="config-body-left">
                  <el-checkbox
                    :indeterminate="temp.IsIndeterminate"
                    v-model="temp.Checked"
                    @change="handleCheckedTwo(i,child,true)"
                  >{{temp.Name}}</el-checkbox>
                </div>
                <div class="config-body-right display-flex flex-wrap">
                  <div>&nbsp;</div>
                </div>
              </div>
              <!-- 循环第3级 s-->
              <div
                class="config-item"
                v-for="(last,childrens) in temp.Childrens"
                :key="last.Unique"
              >
                <div class="config-body-box display-flex align-items-center">
                  <div class="config-body-left three-title">
                    <el-checkbox
                      @change="handleCheckedThree(i,child,childrens)"
                      :indeterminate="last.IsIndeterminate"
                      v-model="last.Checked"
                      :label="last.Unique"
                    >{{last.Name}}</el-checkbox>
                  </div>
                  <div class="config-body-right display-flex flex-1 flex-wrap">
                    <el-checkbox
                      @change="handleCheckedButton(i,child,childrens)"
                      v-model="btn.Checked"
                      :label="btn.Unique"
                      v-for="(btn,n) in last.Buttons"
                      :key="btn.Unique"
                    >{{btn.Name}}</el-checkbox>
                  </div>
                  <i class="iconfont iconquestion main-color pr-15 pointer" @click="showImg(last.Unique)" v-if="last.Event=='true'"></i>
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
import { GetRoleModel } from "@/api/role";
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
      url: "",
      arr: [],
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
    // 查看新手指引
    showImg(num) {
      this.$emit("showImg", num);
    },
    opened() {
      GetRoleModel(this.temp.Id).then(res => {
        this.arr = res.data.Menus;
      });
    },
    createData() {
      let arr = this.getData(this.arr);
      this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;
        this.$emit("createData", this.temp, arr);
      });
    },
    updateData() {
      let arr = this.getData(this.arr);
      this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;
        this.$emit("updateData", this.temp, arr);
      });
    },
    getData(arr) {
      //处理已勾选的复选框ID，数组给后端
      let newArr = [];
      arr.forEach(first => {
        if (first.Checked) {
          newArr.push(first.Id);
        }
        first.Childrens.forEach(Child => {
          if (Child.Checked) {
            newArr.push(Child.Id);
          }
          if (Child.Childrens.length > 0) {
            //如果有3级
            Child.Childrens.forEach(Childrens => {
              if (Childrens.Checked) {
                newArr.push(Childrens.Id);
              }
              Childrens.Buttons.forEach(button => {
                if (button.Checked) {
                  newArr.push(button.Id);
                }
              });
            });
          } else {
            Child.Buttons.forEach(button => {
              if (button.Checked) {
                newArr.push(button.Id);
              }
            });
          }
        });
      });
      return newArr;
    },
    filterData(arr) {
      let postDataArr = arr.filter(item => {
        return item.Checked;
      });
      return postDataArr;
    },
    handleCheckedNoThreeButton(first, index) {
      //没有标签页的按钮点击事件
      // 处理二级
      let buttonArr = this.arr[first].Childrens[index].Buttons.filter(
        button => {
          return button.Checked;
        }
      );
      if (buttonArr.length == this.arr[first].Childrens[index].Buttons.length) {
        this.arr[first].Childrens[index].Checked = true;
        this.arr[first].Childrens[index].IsIndeterminate = false;
      } else if (buttonArr.length == 0) {
        this.arr[first].Childrens[index].Checked = false;
        this.arr[first].Childrens[index].IsIndeterminate = false;
      } else {
        this.arr[first].Childrens[index].Checked = true;
        this.arr[first].Childrens[index].IsIndeterminate = true;
      }
      this.setCheckedOne(first); // 处理1级复选框
    },
    handleCheckedButton(first, index, children) {
      //有标签页的按钮事件
      if (first) {
        this.arr[first].Childrens[index].Childrens.forEach(childrens => {
          let btnCheckedArr = childrens.Buttons.filter(button => {
            return button.Checked == true;
          });
          if (btnCheckedArr.length == childrens.Buttons.length) {
            //该行按钮全选
            childrens.Checked = true;
            childrens.IsIndeterminate = false;
          } else if (btnCheckedArr.length == 0) {
            childrens.Checked = false;
            childrens.IsIndeterminate = false;
          } else {
            childrens.Checked = true;
            childrens.IsIndeterminate = true;
          }
        });
      }
      this.handleCheckedThree(first, index, children, "btnEvent");
    },
    handleCheckedThree(first, index, children, btnEvent) {
      //第3级标签页事件
      if (!btnEvent) {
        //如果是按钮事件调用该方法，不再次处理按钮
        //标签页事件
        this.arr[first].Childrens[index].Childrens[
          children
        ].IsIndeterminate = false;
        if (this.arr[first].Childrens[index].Childrens[children].Checked) {
          this.arr[first].Childrens[index].Childrens[children].Buttons.forEach(
            button => {
              button.Checked = true;
            }
          );
        } else {
          this.arr[first].Childrens[index].Childrens[children].Buttons.forEach(
            button => {
              button.Checked = false;
            }
          );
        }
      }
      // 处理第二级复选样式
      let childrensArr = this.arr[first].Childrens[index].Childrens.filter(
        childrens => {
          return childrens.Checked == true;
        }
      );
      if (
        childrensArr.length ===
        this.arr[first].Childrens[index].Childrens.length
      ) {
        //全选
        this.arr[first].Childrens[index].Checked = true;
        this.arr[first].Childrens[index].IsIndeterminate = false;
      } else if (childrensArr.length == 0) {
        this.arr[first].Childrens[index].Checked = false;
        this.arr[first].Childrens[index].IsIndeterminate = false;
      } else {
        this.arr[first].Childrens[index].Checked = true;
        this.arr[first].Childrens[index].IsIndeterminate = true;
      }
      this.setCheckedOne(first); //处理1级复选框
    },
    handleCheckedTwo(first, index, isHaveThree) {
      //二级页面事件
      if (isHaveThree) {
        //如果是从有第三级过来的事件,需要处理标签页
        if (this.arr[first].Childrens[index].Checked) {
          //第三级和按钮处理选中
          this.arr[first].Childrens[index].Childrens.forEach(childrens => {
            childrens.Checked = true;
            childrens.IsIndeterminate = false;
            childrens.Buttons.forEach(button => {
              button.Checked = true;
            });
          });
        } else {
          this.arr[first].Childrens[index].Childrens.forEach(childrens => {
            childrens.Checked = false;
            childrens.IsIndeterminate = false;
            childrens.Buttons.forEach(button => {
              button.Checked = false;
            });
          });
        }
      }
      this.arr[first].Childrens[index].IsIndeterminate = false;
      this.arr.forEach((item, i) => {
        let CheckedArr = item.Childrens.filter(i => {
          //二级勾选
          return i.Checked;
        });
        if (CheckedArr.length == item.Childrens.length) {
          //二级全选
          this.arr[i].Checked = true; //一级全选
          this.arr[i].IsIndeterminate = false; //
          this.arr[i].Childrens.forEach(n => {
            if (n.Childrens.length > 0) {
              n.Childrens.forEach(childrens => {
                childrens.Checked = true;
                childrens.Buttons.forEach(button => {
                  button.Checked = true;
                });
              });
            } else {
              n.Buttons.forEach(m => {
                //按钮全选
                m.Checked = true;
              });
            }
          });
        } else if (CheckedArr.length == 0) {
          this.arr[i].Checked = false; //一级全选 false
          this.arr[i].IsIndeterminate = false; //
          this.arr[i].Childrens.forEach(n => {
            if (n.Childrens.length > 0) {
              n.Childrens.forEach(childrens => {
                childrens.Buttons.forEach(button => {
                  button.Checked = false;
                });
              });
            } else {
              n.Buttons.forEach(m => {
                m.Checked = false; //按钮全选
              });
            }
          });
        } else {
          this.arr[i].Checked = true; //
          this.arr[i].IsIndeterminate = true; //一级全选
          this.arr[i].Childrens.forEach(n => {
            n.Buttons.forEach(m => {
              //按钮
              if (n.Checked) {
                m.Checked = true;
              } else {
                m.Checked = false;
              }
            });
          });
        }
      });
    },
    handleCheckedOne(first) {
      //1级事件
      let isChecked = this.arr[first].Checked;
      this.arr[first].IsIndeterminate = false;
      this.arr[first].Childrens.forEach(child => {
        child.Checked = isChecked;
        child.IsIndeterminate = false;
        if (child.Childrens.length > 0) {
          //如果有第三级
          child.Childrens.forEach(childrens => {
            childrens.Checked = isChecked;
            childrens.IsIndeterminate = false;
            childrens.Buttons.forEach(button => {
              button.Checked = isChecked;
            });
          });
        } else {
          child.Buttons.forEach(button => {
            button.Checked = isChecked;
          });
        }
      });
    },
    setCheckedOne(first) {
      // 共用->处理1级复选框
      let IsIndeterminateArr = this.arr[first].Childrens.filter(item => {
        //筛选二级有“-”
        return item.IsIndeterminate;
      });
      let CheckedArr = this.arr[first].Childrens.filter(item => {
        //筛选二级有几个的全选
        return item.Checked && item.IsIndeterminate == false;
      });
      if (
        IsIndeterminateArr.length > 0 ||
        (CheckedArr.length !== this.arr[first].Childrens.length &&
          CheckedArr.length > 0)
      ) {
        this.arr[first].Checked = true;
        this.arr[first].IsIndeterminate = true;
      } else if (CheckedArr.length == this.arr[first].Childrens.length) {
        this.arr[first].Checked = true;
        this.arr[first].IsIndeterminate = false;
      } else {
        this.arr[first].Checked = false;
        this.arr[first].IsIndeterminate = false;
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
  margin: 15px;
}

.config-container {
  border: 1px solid #e2e9ed;
  border-bottom: none;
  height: 400px;
  margin: 15px;
  overflow-y: scroll;
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

