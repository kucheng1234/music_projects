<template>
  <div class="mv">
    <div class="top">
      <span class="iconfont icon-arrow-left-bold" @click="stopFun"></span>
      <span class="top_span">{{ songList.artistName }}</span>
    </div>
    <video
      controls
      autoplay
      preload="Auto"
      :src="mvList.url"
      width="100%"
    ></video>
    <div class="tab">
      <span @click="tableone" :class="ta == true ? 'active' : ''">详情</span>
      <span @click="tabletwo" :class="ta == false ? 'active' : ''"
        >评论({{ commentCount.commentCount }})</span
      >
    </div>
    <component
      :is="table"
      :singList="singList"
      :songList="songList"
      :commentCount="commentCount"
      :personalized="personalized"
      :correlation="correlation"
      :dots="dots"
      @change="changes($event)"
      :hotComments="hotComments"
      :newComments="newComments"
    ></component>
  </div>
</template>

<script>
import particulars from "./Particulars.vue";
import comment from "./Comment.vue";
export default {
  props: ["id"],
  data() {
    return {
      mvList: [],
      songList: [],
      singList: [],
      commentCount: [],
      personalized: [],
      correlation: [],
      hotComments: [],
      newComments: [],
      dots: false,
      table: particulars,
      ta: true,
    };
  },
  created() {
    this.getmv();
  },
  watch: {
    id(newValue) {
      // 再次调用ajax方法更新数据
      this.getmv(newValue);
    },
  },
  methods: {
    tableone() {
      this.ta = true;
      this.table = particulars;
    },
    tabletwo() {
      this.ta = false;
      this.table = comment;
    },
    stopFun() {
      this.dots = false;
      this.$router.go(-1);
      this.table = particulars;
    },
    changes(event) {
      this.dots = event;
    },
    getmv() {
      this.$axios.get("/mv/url?id=" + this.id + "&r=1080").then((d) => {
        this.mvList = d.data.data;
      }),
        this.$axios
          .get("/mv/detail?mvid=" + this.id)
          .then((d) => {
            this.songList = d.data.data;
          })
          .then(() => {
            this.$axios
              .get("/artist/detail?id=" + this.songList.artistId)
              .then((arr) => {
                this.singList = arr.data.data.artist.cover;
              });
          });
      this.$axios.get("/mv/detail/info?mvid=" + this.id).then((d) => {
        this.commentCount = d.data;
      });
      this.$axios.get("/personalized/mv").then((d) => {
        this.personalized = d.data.result;
      });
      this.$axios.get("/simi/mv?mvid=" + this.id).then((d) => {
        this.correlation = d.data.mvs;
      });
      this.$axios
        .get("/comment/hot?id=" + this.id + "&type=1&limit=5")
        .then((d) => {
          this.hotComments = d.data.hotComments;
        });
      this.$axios.get("/comment/mv?id=" + this.id + "&&limit=30").then((d) => {
        this.newComments = d.data.comments;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.mv {
  background: linear-gradient(to bottom, #442e9a, #332175, #048181, #05d1d3);
  color: white;
  .top {
    height: 5vh;
    line-height: 5vh;
    display: flex;
    .iconfont {
      margin-left: 5px;
      position: absolute;
    }
    .top_span {
      flex: 1;
      text-align: center;
      font-size: 14px;
      font-weight: bold;
    }
  }
  .tab {
    display: flex;
    text-align: center;
    border-bottom: 0.5px solid #f2f2f2;
    span {
      flex: 1;
      display: block;
      padding: 8px;
      &.active {
        color: #22d59c;
        font-weight: bold;
      }
    }
  }
}
</style>