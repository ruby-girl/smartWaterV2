<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <p class="card-panel-text">
            {{ panelData.TodayPayment }}
          </p>
          今日缴费
        </div>
        <div class="card-panel-description">
          <span class="icon iconfont iconshouye-jinrijiaofei" style="color: #93E6D2" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <p class="card-panel-text">
            {{ panelData.TodayOpenAccount }}
          </p>
          今日开户
        </div>
        <div class="card-panel-description">
          <span class="icon iconfont iconshouye-jinrikaihu" style="color: #93E6D2" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <p class="card-panel-text">
            {{ panelData.TodayCancelAccount }}
          </p>
          今日销户
        </div>
        <div class="card-panel-description">
          <span class="icon iconfont iconshouye-jinrixiaohu" style="color: #93E6D2" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <p class="card-panel-text card-panel-text2" style="font-size: 14px;">
            {{ time }}
          </p>
          软件到期时间
        </div>
        <div class="card-panel-description">
          <span class="icon iconfont iconshouye-ruanjiandaoqi" style="color: #93E6D2" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { GetSoftExpirationDate } from "@/api/index"
export default {
  props:{
    panelData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      time:''
    }
  },
  mounted() {
    this.GetSoftExpirationDate()
  },
  methods: {
    /**
     *获取软件到期时间
     * */
    GetSoftExpirationDate() {
      GetSoftExpirationDate().then(res => {
        if(res.code==0) {
          this.time = res.data;
        }else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-panel {
    height: 70px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0px 0px 5px #00B3A1;
    border-color: rgba(0, 0, 0, .05);
    border-radius: 3px;
    margin-bottom: 16px;

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      font-size: 14px;
      color: #00B3A1;
      margin: 10px 0 0 20px;
      font-family: 'Microsoft YaHei';
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-text {
      color: #00B3A1;
      font: bold 22px/30px 'Microsoft YaHei';
      margin: 0;
    }
    .card-panel-text2 {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .card-panel-description {
      float: right;
      margin: 7px 10px 0 0px;
      span { font-size: 50px;font-family:Microsoft YaHei, Arial, sans-serif, Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB;}
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
