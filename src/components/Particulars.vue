<template>
  <div class="particulars">
    <div class="top">
      <div class="img">
        <img :src="singList" alt="" v-if="singList.length > 0" />
        <loading v-if="singList.length <= 0"></loading>
      </div>
      <div class="hidden">
        <p>{{ songList.name }}</p>
        <span>发布：{{ songList.publishTime }}</span>
        <span>播放：{{ songList.playCount | playCountNum }}</span>
      </div>
      <div class="btn">
        <span>+关注</span>
      </div>
    </div>
    <div class="conter">
      <span
        class="iconfont icon-dianzan11"
        @click.stop="stopFuns"
        :class="dots ? 'active' : ''"
        ><p>{{ commentCount.likedCount | playCountNum }}</p></span
      >
      <span class="iconfont icon-xiazai"><p>下载</p></span>
      <span
        class="iconfont icon-shoucang"
        @click.stop="dot = !dot"
        :class="dot ? 'active' : ''"
        ><p>收藏</p></span
      >
      <span class="iconfont icon-fenxiang"><p>分享</p></span>
    </div>
    <div class="nominate">
      <h2>推荐MV</h2>
      <div class="hotlists">
        <ul>
          <loading v-if="personalized.length <= 0"></loading>
          <router-link
            :to="{ path: `/mv/${item.id}` }"
            tag="li"
            v-for="item in personalized"
            :key="item.id"
          >
            <div class="img">
              <img :src="item.picUrl" />
            </div>
            <div class="span">
              <p>{{ item.name }}</p>
              <span class="spans">{{ item.artistName }}</span>
            </div>
          </router-link>
        </ul>
      </div>
    </div>
    <div class="nominate">
      <h2>相关MV</h2>
      <div class="hotlists">
        <ul>
            <router-link :to="{ path: `/mv/${item.id}` }" tag="li" v-for="item in correlation" :key="item.id">
            <div class="img">
              <img :src="item.cover" />
            </div>
            <div class="span">
              <p>{{ item.name }}</p>
              <span class="spans"
                >来自：<span v-for="data in item.artists" :key="data.id"
                  >{{ data.name }}
                </span></span
              >
            </div>

            </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading"
export default {
  props: [
    "singList",
    "songList",
    "commentCount",
    "personalized",
    "correlation",
    "dots",
  ],
  components:{
    Loading
  },
  data() {
    return {
      dot: false,
    };
  },
  filters: {
    playCountNum(value) {
      let k = value > 10000 ? parseInt(value / 10000) + "万" : value + "次";
      return k;
    },
  },
  watch: {
    singList(newValue) {
      this.singList = newValue;
    },
  },
  methods: {
    stopFuns() {
      if (this.dots) {
        this.$emit("change", false);
        this.commentCount.likedCount = this.commentCount.likedCount - 1;
      } else {
        this.commentCount.likedCount = this.commentCount.likedCount + 1;
        this.$emit("change", true);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.particulars {
  .top {
    padding: 10px 0;
    width: 100%;
    display: flex;
    align-items: center;
    .img {
      flex: 0 0 60px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        float: right;
      }
    }
    .hidden {
      flex: 1;
      text-indent: 10px;
      overflow: hidden;
      span {
        display: block;
        font-size: 12px;
        float: left;
        .hiddens();
      }
      p {
        .hiddens();
      }
    }
    .btn {
      flex: 0 0 70px;
      span {
        display: block;
        border-radius: 20px;
        width: 60px;
        height: 25px;
        line-height: 25px;
        background: #24d69d;
        font-size: 14px;
        text-align: center;
      }
    }
  }
  .conter {
    display: flex;
    text-align: center;
    padding-top: 10px;
    span {
      display: block;
      flex: 1;
      font-size: 20px;
    }
    .active {
      color: red;
    }
    p {
      padding: 5px 0;
      font-size: 12px;
    }
  }
  .nominate {
    margin-top: 10px;
    h2 {
      text-indent: 1em;
    }
    .hotlists {
      width: 90%;
      margin-left: 5%;
      ul {
        li {
          margin-top: 10px;
          display: flex;
          padding: 5px 0;
          align-items: center;
          .img {
            flex: 0 0 100px;
            img {
              width: 100%;
              height: 60px;
              border-radius: 5px;
            }
          }
          .span {
            padding-left: 10px;
            p {
              width: 100%;
              font-size: 14px;
            }
            .spans {
              display: block;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
.hiddens() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>