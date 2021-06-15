<template>
  <div>
    <li @click.stop="$emit('play',item)">
      <slot name="sortnum"></slot>
      <div class="left">
        <div v-html="$options.filters.filtkeyword(item.name,keywords)"></div>
        <div>
          <p>
            <i v-show="item.song.privilege&&item.song.privilege.playMaxbr>320000" class="iconfont icon-SQ"></i><span v-for="(sing,index) in item.song.artists" :key="index" v-html="$options.filters.filtkeyword(sing.name,keywords)"
              >
            </span> - <span v-html="$options.filters.filtkeyword(item.song.album.name,keywords)"></span>
          </p>
        </div>
      </div>
      <div class="right">
        <span class="iconfont icon-play-circle"></span>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    keywords:{
      type:String,
      default:''
    }
  },
  created(){
    
  },
  filters:{
    filtkeyword(value,k){
      return value.replace(k,'<span style="color:#507db6;">'+k+'</span>&nbsp;')
    }
  }
};
</script>

<style lang="less" scoped>
.hidden() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
div {
  padding: 0 0 0 3px;
  .hidden();
  li {
    display: flex;
    margin: 5px 0;
    .left {
        flex: 1;
      p {
        color: #ccc;
          margin-left: 2px;
        .hidden();
        span {
          font-size: 12px;
        }
        i{
          color: red;
          margin-left: 2px;
        }
      }
    }
    .right {
      flex: 0 0 10%;
      display: block;
      text-align: center;
      line-height: 41.6px;
      span{
        
        font-size: 18px;
      }
    }
    &>b{
      display: inline-block;
      margin:0 7px 0 10px;
      line-height: 41.6px;
      font-weight: normal;
      font-size: 16px;
    }
  }
}
</style>