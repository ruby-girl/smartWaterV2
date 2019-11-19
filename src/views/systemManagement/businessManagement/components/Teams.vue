<template>
  <div class="auditTeam">
    <ul class="clearfix" id="teamWidth">
      <li v-for="(item,index) in teams" :key="index" :data-id="item.id">
        <h3>{{ item.name }}</h3>
        <p>
          <span class="btnSpan btnSpanLeft">配置</span>&nbsp;
          <span class="btnSpan btnSpanRight">删除</span>
        </p>
      </li>
      <li class="addTeam">
        <p><i class="iconfont icontianjia"></i>新增审核人组</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import Sortable from 'sortablejs'

  export default {
    name: "Teams",
    data() {
      return {
        teams: [
          {id: 0, name: '审核组1'},
          {id: 1, name: '审核组2'},
          {id: 2, name: '审核组3'},
        ]
      }
    },
    methods:{
      getWidth(id,width){
        document.getElementById(id).style.width = (this.teams.length + 1) * width + 30 + 'px'
      }
    },
    mounted() {
      this.getWidth('teamWidth',160)
      new Sortable(teamWidth, {
        group: {
          name: 'shared',
          pull: 'clone',
          put: false // 不允许拖拽进这个列表
        },
        animation: 150,
        sort: false,
        onEnd: function (evt) {
          var itemEl = evt.item;
          evt.to;
          evt.from;
          evt.oldIndex;
          evt.newIndex;
          evt.clone
          evt.pullMode;

        },
      });

    }
  }
</script>

<style scoped>

</style>
