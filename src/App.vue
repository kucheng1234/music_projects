<template>
  <div id="app">
    <nav-bar v-show="!$route.meta.hideNav"></nav-bar>
    <router-link to="/fullpage" tag="div">
      <play
        :playMusic="playMusic"
        :playList="playList"
        @changePlayMusic="changePlayMusic"
        v-show="!$route.meta.playNav"
        :stop="stop"
      ></play>
    </router-link>
    <transition>
      <router-view @play="play" @stopChanges="stopChanges" @res="res" />
    </transition>
    <div
      class="paddingBottom"
      v-if="playMusic"
      v-show="!$route.meta.playNav"
    ></div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import Play from "./components/Play.vue";
import Music from "./assets/music.jpg";
export default {
  data() {
    return {
      playMusic: null,
      playList: [],
      stop: null,
    };
  },
  components: {
    NavBar,
    Play,
  },
  methods: {
    play(event) {
      if (!event.picUrl && event.song && event.song.album) {
        event.picUrl = event.song.album.picUrl;
      }
      if (!event.picUrl) {
        event.picUrl = Music;
      }
      this.playMusic = event;
      let isPush = true;
      this.playList.map((d) => {
        if (d.id == event.id) {
          // 歌曲已存在
          isPush = false;
        }
      });
      if (isPush) this.playList.push(event);
    },
    changePlayMusic(event) {
      if (event) {
        this.playMusic = event;
      }
    },
    stopChanges(event) {
      this.stop = event;
    },
    res(event) {
      // this.playMusic = event;
      event.map((d) => {
        let isPush = true;
        this.playList.map((ent) => {
          if (d.id == ent.id) {
            // 歌曲已存在
            isPush = false;
          }
        });
        if (isPush) this.playList.push(d);
      });
      let plays = event[0]
      this.play(plays)
      //   console.log(this.playList);
    },
  },
};
</script>
<style lang="less" scoped>
.paddingBottom {
  height: 50px;
}
</style>
