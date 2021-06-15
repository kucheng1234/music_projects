<template>
  <router-link :to="{path:`/list/${item.id}`,}" tag="div" class="picitem">
    <img :src="item.picUrl" alt="" />
    <p>{{ item.name }}</p>
    <i><span class="iconfont icon-V"></span>{{ item.playCount | formatNum }}</i>
  </router-link>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  filters: {
    formatNum(value) {
      return (parseInt(value) / 10000).toFixed(1) + "万";
    },
  },
};
</script>

<style lang="less" scoped>
.picitem {
  position: relative;
  margin-bottom: 8px;
  img{
      border-radius: 10px;
  }
  p {
      overflow: hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    padding: 6px 2px 0 6px;
    line-height: 1.2;
    font-size: 2.2vw;
  }
  i {
    font-size: 2vw;
    top: 2px;
    right: 5px;
    color: white;
    position: absolute;
    span{
        font-size: 2vw;
    }
  }
}
</style>