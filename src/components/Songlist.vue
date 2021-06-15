<template>
  <div class="songlist">
    <span @click="$router.go(-1)" class="iconfont icon-arrow-left-bold"></span>
    <loading v-if="songlist==null"></loading>
    <div class="conter">
      <div class="img" v-if="songlist">
        <img :src="songlist.artist.cover" alt="" />
        <div class="font">
          <p>{{ songlist.artist.name }}</p>
        </div>
      </div>
      <div class="zhe"></div>
    </div>
    <div class="table">
      <span :class="nums == 1 ? 'active' : ''" @click="Music">音乐</span>
      <span :class="nums == 2 ? 'active' : ''" @click="Album">专辑</span>
      <span :class="nums == 3 ? 'active' : ''" @click="Introduce">介绍</span>
    </div>
    <loading v-if="singlist.length < 1"></loading>
    <component
      :is="componentId"
      :singlist="singlist"
      :singlists="singlists"
      :albumlist="albumlist"
      @play="$emit('play', $event)"
      :songlist="songlist"
      :songlists="songlists"
    ></component>
  </div>
</template>

<script>
import Music from "./Music.vue";
import Album from "./Album.vue";
import Introduce from "./Introduce.vue";
import Loading from "./Loading.vue"
export default {
  props: ["id"],
  data() {
    return {
      songlist: null,
      componentId: Music,
      singlist: [],
      singlists: [],
      albumlist: [],
      page: 0, //记录页码
      perpage: 20, //每页显示20条
      songlists: [],
      nums: 1,
    };
  },
  components:{
    Loading
  },
  created() {
    this.goSong()
    window.addEventListener("scroll", this.onScroll);
  },
  watch:{
    id(newValue){
      this.goSong(newValue)
      this.nums = 1
      this.componentId = Music;
    }
  },
  methods: {
    Music() {
      this.componentId = Music;
      this.nums = 1;
    },
    Album() {
      this.componentId = Album;
      this.nums = 2;
    },
    Introduce() {
      this.componentId = Introduce;
      this.nums = 3;
    },
    onScroll() {
      let scrollHeight = document.documentElement.scrollHeight;
      let scrollTop = document.documentElement.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 1) {
        this.loadeMore();
      }
    },
    loadeMore() {
      this.page++;
      let start = this.page * this.perpage;
      let end = (this.page + 1) * this.perpage;
      this.singlist = this.singlist.concat(this.singlists.slice(start, end));
    },
    goSong() {
      this.$axios.get("/artist/detail?id=" + this.id).then((d) => {
        this.songlist = d.data.data;
      });
      this.$axios.get("/artist/album?id=" + this.id + "&limit=30").then((d) => {
        this.albumlist = d.data.hotAlbums;
      });
      this.$axios.get("/simi/artist?id=" + this.id).then((d) => {
        this.songlists = d.data.artists;
      });
      this.$axios.get("/artist/songs?id=" + this.id + "&limit=500").then((d) => {
        this.singlists = d.data.songs.map((data) => {
          data.song = {
            priilege: data.privilege.maxbr,
            artists: data.ar,
            album: data.al,
          };
          return data;
        });
        this.singlist = this.singlists.slice(0, 20);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.songlist {
  color: #fff;
  .iconfont {
    position: absolute;
    display: block;
    margin: 10px 0 0 10px;
    z-index: 1;
  }
  .conter {
    position: relative;
    .img {
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .font {
      position: absolute;
      z-index: 99;
      bottom: 10px;
      left: 10px;
      font-size: 25px;
      font-weight: bold;
    }
    .zhe {
      width: 100%;
      height: 30%;
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(70, 60, 61, 1));
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .table {
    padding: 15px 0 15px 15px;
    background: #463c3d;
    span {
      margin-right: 20px;
      font-size: 14px;
    }
  }
}
.active {
  color: #22d59c;
}
</style>