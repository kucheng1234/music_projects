<template>
  <div :class="['play', { pause: !pausestate }]">
    <audio
      autoplay
      :src="`https://music.163.com/song/media/outer/url?id=${playMusic.id}.mp3`"
      @timeupdate="timeupdate"
      ref="player"
      @play="play"
      @pause="pause"
      v-if="playMusic"
      @ended="end"
    ></audio>
    <transition
      enter-active-class="animate__animated animate__slideInLeft"
      leave-active-class="animate__animated animate__slideOutRight"
    >
      <div class="minibar" v-if="playMusic">
        <div class="img" @click="isFull = true">
          <img :src="playMusic.picUrl" alt="" />
        </div>
        <div class="song" @click="isFull = true">
          <p>{{ playMusic.name }}</p>
          <p>
            <span v-for="item in playMusic.song.artists" :key="item.id"
              >{{ item.name }}
            </span>
          </p>
        </div>
        <div class="stopData">
          <div class="left" @click.stop="prev">
            <span class="iconfont icon-shangyishoushangyige"></span>
          </div>
          <canvas width="50" height="50" ref="playround"></canvas>
          <span
            class="iconfont icon-pause-full top"
            v-show="pausestate"
            style="marginleft: -8px"
             @click.stop="togglePlay"
          ></span>
          <span class="iconfont icon-bofang1 top" v-show="!pausestate" @click.stop="togglePlay"></span>
          <div class="right" @click.stop="next">
            <span class="iconfont icon-play-next"></span>
          </div>
        </div>
      </div>
    </transition>
    <!-- 全屏组件 -->

    <transition leave-active-class="animate__animated animate__slideOutDown">
      <full-page
        v-show="isFull"
        @close="isFull = false"
        :playMusic="playMusic"
        :pausestate="pausestate"
        :lyric="lyric"
        :duration="duration"
        :currentTime="currentTime"
        @changetime="changeTime"
        @togglePlay="togglePlay"
        :playList="playList"
        @changePlayMusic="$emit('changePlayMusic', $event)"
        :playMode="playMode"
        @changeMode="playMode = $event"
        ref="fullplay"
      ></full-page>
    </transition>
  </div>
</template>

<script>
import FullPage from "../components/FullPage";
export default {
  props: ["playMusic", "playList", "stop"],
  data() {
    return {
      duration: 0,
      currentTime: 0,
      pausestate: true, //记录是否是播放
      isFull: false,
      lyric: null,
      playMode: 1, // 1 顺序 2 随机 3 单曲
    };
  },
  components: {
    FullPage,
  },
  watch: {
    playMusic(newMusic) {
      // 侦听当前播放的音乐，获取歌词
      this.$axios
        .get("/lyric", {
          params: {
            id: newMusic.id,
          },
        })
        .then((d) => {
          if (d.data && d.data.lrc && d.data.lrc.lyric) {
            this.lyric = d.data.lrc.lyric;
          }
        });
    },
    stop(newValue) {
      if (newValue) {
        if (this.pausestate == false) {
          this.$refs.player.pause();
          
        }
      }
    },
  },
  methods: {
    timeupdate(event) {
      this.duration = event.target.duration; // 音乐总时长
      this.currentTime = event.target.currentTime; // 当前播放时间
      this.drawCircle(this.duration, this.currentTime);
    },
    drawCircle(d, c) {
      let canvas = this.$refs.playround;
      let cxt = canvas.getContext("2d");
      cxt.clearRect(0, 0, 50, 50);
      cxt.beginPath();
      cxt.strokeStyle = "#666";
      cxt.lineWidth = 0.5;
      cxt.arc(25, 25, 16, 0, Math.PI * 2);
      cxt.stroke();
      cxt.closePath();

      cxt.beginPath();
      cxt.strokeStyle = "#463c3d";
      cxt.lineWidth = 1.5;
      // 当前播放时间 / 总时长 == 百分比
      // arc(x,y,半径，开始弧长，结束弧长)
      cxt.arc(25, 25, 16, 0, Math.PI * 2 * (c / d));
      cxt.stroke();
      cxt.closePath();
    },
    togglePlay() {
      // 如果是暂停就改为播放
      if (this.pausestate) {
        this.pausestate = false;
        this.$refs.player.pause();
      } else {
        // 如果是播放就改为暂停
        this.pausestate = true;
        this.$refs.player.play();
      }
    },
    play() {
      this.pausestate = true;
    },
    pause() {
      this.pausestate = false;
    },
    changeTime(val) {
      let t = (val / 100) * this.duration; //得到播放时间
      this.$refs.player.currentTime = t; //改变播放时间
    },
    end() {
      // 当音乐播放完成 自动播放下一首
      if (this.playMode == 3) {
        this.$refs.player.play();
      } else {
        this.$refs.fullplay.next();
      }
    },
    
    prev() {
      let i = 0;
      this.playList.map((d, index) => {
        if (d.id == this.playMusic.id) {
          i = index;
        }
      });
      if (this.playMode == 1) {
        i--;
        if (i < 0) {
          i = this.playList.length - 1;
        }
      } else if (this.playMode == 2) {
        i = Math.floor(Math.random() * this.playList.length);
      }
      let pmusic = this.playList[i];
      this.$emit("changePlayMusic", pmusic);
    },
    next() {
      let i = 0;
      this.playList.map((d, index) => {
        if (d.id == this.playMusic.id) {
          if (i < this.playList.length) {
            i = index;
          }
        }
      });
      if (this.playMode == 1) {
        i++;
        if (i > this.playList.length - 1) {
          i = 0;
        }
      } else if (this.playMode == 2) {
        let arr = Math.floor(Math.random() * this.playList.length);
        while (i == arr) {
          arr = Math.floor(Math.random() * this.playList.length);
        }
        i = arr;
      } 
      let pmusic = this.playList[i];
      this.$emit("changePlayMusic", pmusic);
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.stop) {
        vm.pause();
      }
    });
  },
};
</script>

<style lang="less" scoped>
.play {
  .minibar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 666;
    width: 100%;
    height: 50px;
    background: #ece4e4;
    display: flex;
    align-items: center;
    .img {
      flex: 0 0 50px;
      img {
        position: absolute;
        top: -10px;
        width: 50px;
        border-radius: 50%;
        margin-left: 10px;
        animation: round 10s 0s linear infinite;
      }
    }
    .song {
      flex: 1;
      overflow: hidden;
      text-indent: 1.5em;
      p {
        color: #000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        span {
          font-size: 12px;
          color: #666;
        }
      }
    }
    .stopData {
      flex: 0 0 150px;
      height: 100%;
      position: relative;
      display: flex;
        color: #05d0d2;
      .top {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -7px;
        margin-top: -8.4px;
      }
      .left{
        width: 50px;
        height: 100%;
        position: relative;
        .iconfont{
          font-size: 25px;
          position: absolute; 
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }
      .right{
        position: relative;
        width: 50px;
        height: 100%;
        .iconfont{
          font-size: 25px;
          position: absolute; 
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }
    }
  }
}
.pause {
  .minibar {
    .img {
      img {
        animation-play-state: paused;
      }
    }
  }
}
@keyframes round {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>