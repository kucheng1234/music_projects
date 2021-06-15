<template>
  <div class="result">
    <div class="top" v-if="album.length != 0">
      <h2>你可能感兴趣</h2>
      <router-link :to="{path:`/albumlist/${album[0].id}`}" tag="div" class="top_conten">
        <div class="img">
          <img :src="album[0].blurPicUrl" alt="" />
        </div>
        <div class="font">
          <p>专辑：{{ album[0].name }}</p>
          <span v-for="item in album[0].artists" :key="item.id"
            >{{ item.name }}
          </span>
        </div>
      </router-link>
    </div>
    <ul>
      <loading v-if="searchresult.length == 0"></loading>
      <li-item
        v-for="(item, index) in searchresult"
        :key="index"
        :item="item"
        :keywords="keywords"
        @play="$emit('play', $event)"
      ></li-item>
      <span
        @click="plus"
        v-if="searchresult.length != searchresults.length"
        class="span"
        >点击加载</span
      >
    </ul>
  </div>
</template>

<script>
import LiItem from "../components/LiItem";
import Loading from "./Loading";
export default {
  props: {
    keywords: String,
  },
  components: {
    LiItem,
    Loading
  },
  data() {
    return {
      searchresult: [],
      searchresults: [],
      album: [],
      page: 0,
      pagepro: 10,
    };
  },
  methods: {
    plus() {
      this.page++;
      let start = this.page * this.pagepro;
      let end = (this.page + 1) * this.pagepro;
      this.searchresult = this.searchresult.concat(
        this.searchresults.slice(start, end)
      );
    },
  },
  created() {
    this.$axios
      .get("/search?keywords=" + this.keywords + "&limit=60")
      .then((d) => {
        this.searchresults = d.data.result.songs.map((data) => {
          data.song = {
            artists: data.artists,
            album: data.album,
          };
          return data;
        });
        this.searchresult = this.searchresults.slice(0, 20);
      });
    this.$axios
      .get("/search/multimatch?keywords=" + this.keywords)
      .then((d) => {
        if (d.data && d.data.result && d.data.result.album) {
          this.album = d.data.result.album;
        }
      });
  },
};
</script>

<style lang="less" scoped>
.top {
  width: 96%;
  margin: 2%;
  background: #e6e6e6;
  padding: 15px;
  border-radius: 10px;
  h2 {
    font-size: 12px;
  }
  .top_conten {
    padding: 10px 0 0 0;
    display: flex;
    height: 55px;
    align-items: center;
    .img {
      height: 100%;
      flex: 0 0 50px;
      overflow: hidden;
      border-radius: 10px;
    }
    .font {
      margin-left: 10px;
      overflow: hidden;
      p{
        
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
      }
      span {
        font-size: 12px;
      }
    }
  }
}
.span{
    display: block;
    text-align: center;
    padding-bottom: 10px;
    color: red;
}
</style>