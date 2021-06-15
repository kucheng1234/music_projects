<template>
  <div :class="['fullPage', { pause: !pausestate }]" v-if="playMusic">
    <div class="top">
      <span
        class="iconfont icon-arrow-down-bold"
        @click="(showList = false), $emit('close'), $router.go(-1)"
      ></span>
      <span class="song"
        ><span>{{ playMusic.name }}</span>
        <p>
          <span v-for="item in playMusic.song.artists" :key="item.id"
            >{{ item.name }}
          </span>
        </p></span
      >
      <span
        class="iconfont icon-pinglun right"
        @click="(stopCom = true), (showList = false)"
      ></span>
    </div>
    <transition
      enter-active-class="animate__animated animate__fadeInRight"
      leave-active-class="animate__animated animate__fadeOutRight"
    >
      <div class="pic" @click="res = !res" v-show="!res">
        <img :src="playMusic.picUrl" alt="" />
      </div>
    </transition>
    <transition
      enter-active-class="animate__animated animate__fadeInRight"
      leave-active-class="animate__animated animate__fadeOutRight"
    >
      <div class="lyric" v-show="res" @click="res = !res">
        <ul :style="{ transform: `translateY(-${lyricIndex * 30}px)` }">
          <li
            v-for="(item, index) in lyricArray"
            :key="index"
            :class="{ active: index == lyricIndex }"
          >
            {{ item.lyric }}
          </li>
        </ul>
      </div>
    </transition>
    <div class="control">
      <div class="range">
        <span>{{ currentTime | formatTime }}</span>
        <input
          type="range"
          max="100"
          :value="(currentTime / duration) * 100"
          @change="changeTime"
        />
        <span>{{ duration | formatTime }}</span>
      </div>
      <div class="buttom">
        <span
          class="iconfont icon-liebiaoxunhuan"
          @click.stop="$emit('changeMode', 2)"
          v-show="playMode == 1"
        ></span>
        <span
          class="iconfont icon-tubiao_suijibofang3"
          @click.stop="$emit('changeMode', 3)"
          v-show="playMode == 2"
        ></span>
        <span
          class="iconfont icon-danquxunhuan1"
          @click.stop="$emit('changeMode', 1)"
          v-show="playMode == 3"
        ></span>
        <span class="iconfont icon-shangyishoushangyige" @click="prev"></span>
        <span
          class="iconfont icon-timeout"
          @click="$emit('togglePlay')"
          v-show="pausestate"
        ></span>
        <span
          class="iconfont icon-play-circle"
          @click="$emit('togglePlay')"
          v-show="!pausestate"
        ></span>
        <span class="iconfont icon-play-next" @click="next"></span>
        <span
          class="iconfont icon-RectangleCopy2"
          @click.stop="showList = !showList"
        ></span>
      </div>
      <transition
        enter-active-class="animate__animated animate__slideInUp"
        leave-active-class="animate__animated animate__slideOutDown"
      >
        <div class="playList" v-show="showList">
          <span @click="showList = !showList" class="span"></span>
          <ul>
            <li
              v-for="song in playList"
              :key="song.id"
              :class="{ active: playMusic.id == song.id }"
              @click="$emit('changePlayMusic', song)"
            >
              {{ song.name }} -
              <span v-for="item in song.song.artists" :key="item.id"
                >{{ item.name }}
              </span>
            </li>
          </ul>
        </div>
      </transition>
      <transition
        enter-active-class="animate__animated animate__fadeInRight"
        leave-active-class="animate__animated animate__fadeOutRight"
      >
        <div class="comment" v-show="stopCom">
          <h2
            class="iconfont icon-arrow-right-bold"
            @click="stopCom = false"
          ></h2>
          <div class="hotlists">
            <span class="active">热门评论</span>
            <p v-if="hotComments == []">暂无热门评论</p>
            <ul>
              <li v-for="item in hotComments" :key="item.commentId">
                <div class="top">
                  <div class="img">
                    <img :src="item.user.avatarUrl" alt="" />
                  </div>
                  <div class="span">
                    <p>{{ item.user.nickname }}</p>
                    <span class="spans">{{
                      item.time | formatData("m-d h:M")
                    }}</span>
                  </div>
                  <div class="like">
                    <span>{{ item.likedCount }}</span>
                    <span class="iconfont icon-dianzan11"></span>
                  </div>
                </div>
                <div class="conter">
                  <span>{{ item.content }}</span>
                </div>
              </li>
            </ul>
            <span class="active">最新评论</span>
            <ul>
              <li v-for="item in comments" :key="item.commentId">
                <div class="top">
                  <div class="img">
                    <img :src="item.user.avatarUrl" alt="" />
                  </div>
                  <div class="span">
                    <p>{{ item.user.nickname }}</p>
                    <span class="spans">{{
                      item.time | formatData("m-d h:M")
                    }}</span>
                  </div>
                  <div class="like">
                    <span>{{ item.likedCount }}</span>
                    <span class="iconfont icon-dianzan11"></span>
                  </div>
                </div>
                <div class="conter">
                  <span>{{ item.content }}</span>
                </div>
              </li>
              <span @click="plus" v-if="showF" class="spanarr">点击加载更多</span>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "FullPage",
  props: [
    "playMusic",
    "pausestate",
    "lyric",
    "duration",
    "currentTime",
    "playList",
    "playMode",
  ],
  data() {
    return {
      showList: false,
      res: false,
      arr: true,
      stopCom: false,
      hotComments: [],
      comments: [],
      page: 1,
      perpage: 10,
      showF:true
    };
  },
  computed: {
    lyricArray() {
      if (!this.lyric) return []; //如果没有歌词返回空
      let arr = this.lyric.split("\n");
      let reg = /\[(\d+):(\d+\.\d+)\](.*)/;
      arr.pop();
      // let regResult = arr.match(reg);
      let lyricArr = arr.map((d) => {
        if (reg.test(d)) {
          let lyricObj = {
            time: parseInt(RegExp.$1) * 60 + parseFloat(RegExp.$2),
            lyric: RegExp.$3,
          };
          return lyricObj;
        }
      });
      return lyricArr;
    },
    lyricIndex() {
      // 计算当前歌词的下标
      let ctime = this.currentTime;
      let lyric = this.lyricArray;
      let index = 0;
      for (let i = 0; i < lyric.length; i++) {
        if (i >= lyric.length - 1) {
          index = i;
          break;
        }
        if (lyric[i].time <= ctime && ctime < lyric[i + 1].time) {
          index = i;
          break;
        }
      }
      return index;
    },
  },
  filters: {
    formatTime(val) {
      let minutes = parseInt(val / 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let sec = parseInt(val - parseInt(minutes * 60));
      sec = sec < 10 ? "0" + sec : sec;
      return minutes + ":" + sec;
    },
    formatData(value, fstr) {
      let d = new Date(value);
      let format = {
        "Y+": d.getFullYear(),
        "m+": d.getMonth() + 1,
        "d+": d.getDate(),
        "h+": d.getHours(),
        "M+": d.getMinutes(),
        "S+": d.getSeconds(),
      };
      for (let k in format) {
        let reg = new RegExp(k);
        let val = format[k];
        val = val < 10 ? "0" + val : val;
        fstr = fstr.replace(reg, val);
      }
      return fstr;
    },
  },
  methods: {
    numFun() {
      this.playMode++;
    },
    changeTime(event) {
      this.$emit("changetime", event.target.value);
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
    plus() {
      this.page++;
      let start = this.page * this.perpage;
      let end = (this.page + 1) * this.perpage;
      this.comments = this.comments.concat(this.comment.slice(start, end));
      if (this.comment.length -10 == this.comments.length ) {
        console.log();
        this.showF = false
      }
    },
  },
  watch: {
    playMusic(newValue) {
      this.$axios
        .get("/comment/music?id=" + newValue.id + "&limit=100")
        .then((d) => {
          this.hotComments = d.data.hotComments.slice(0, 5);
          this.comment = d.data.comments;
          this.comments = this.comment.slice(0, 10);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.fullPage {
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #442e9a, #332175, #048181, #05d1d3);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  .top {
    display: flex;
    margin: 10px 0;
    color: white;
    .iconfont {
      flex: 0 0 50px;
      text-indent: 1em;
    }
    .song {
      flex: 1;
      text-align: center;
      font-weight: bold;
      overflow: hidden;
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        font-weight: normal;
        width: 100%;
        overflow: hidden;
      }
    }
    .right {
      flex: 0 0 50px;
    }
  }
  .pic {
    position: absolute;
    margin: 20px 0;
    width: 100%;
    img {
      width: 45vh;
      display: block;
      margin: 15vh auto;
      border-radius: 50%;
      animation: round 10s 0s linear infinite;
    }
  }
  h2 {
    text-align: center;
    color: red;
  }
  .lyric {
    margin: 10vh 0;
    text-align: center;
    overflow: hidden;
    height: 55vh;
    ul {
      margin-top: ceil(55vh/2);
      li {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 30px;
        color: #ccc;
        &.active {
          font-size: 18px;
          color: red;
          font-weight: bold;
        }
      }
    }
  }
  .control {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
    padding-bottom: 4.2vh;
    .buttom {
      margin-top: 4vh;
      display: flex;
      span {
        font-size: 1.625rem;
        flex: 1;
      }
    }
    .playList {
      width: 92%;
      margin-left: 4%;
      height: 300px;
      position: absolute;
      bottom: 0;
      z-index: 99999;
      left: 0;
      border-radius: 20px;
      background: white;
      &::before {
        content: "";
        display: block;
        clear: both;
        width: 100%;
        height: 25px;
        border: 1px solid #ccc;
        border-radius: 20px 20px 0 0;
        position: relative;
      }
      .span {
        background-color: #ccc;
        display: block;
        width: 80px;
        height: 5px;
        line-height: 20px;
        position: absolute;
        top: 10px;
        right: 50%;
        transform: translateX(50%);
      }
      ul {
        overflow: scroll;
        height: 275px;
        width: 100%;
        li {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 0 10px;
          line-height: 35px;
          border: 1px solid #ccc;
          color: #666;
          &.active {
            font-weight: bold;
            color: #25d59b;
          }
        }
      }
    }
    .comment {
      width: 100%;
      height: 100%;
      position: fixed;
      z-index: 6666666;
      background: rgba(0, 0, 0, 0.9);
      top: 0;
      left: 0;
      color: #fff;
      overflow: scroll;
      .active {
        display: block;
        margin-top: 10px;
        color: red;
        font-weight: bold;
      }
      h2 {
        position: fixed;
        font-size: 20px;
        color: #22d59c;
        right: 5px;
        top: 10px;
      }
      .hotlists {
        width: 90%;
        margin-left: 5%;
        ul {
          padding-bottom: 10px;
          li {
            margin-top: 10px;
            padding: 5px 0;
            .top {
              align-items: center;
              display: flex;
              .img {
                flex: 0 0 50px;
                img {
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                }
              }
              .span {
                flex: 1;
                text-align: left;
                p {
                  width: 100%;
                  font-size: 16px;
                }
                .spans {
                  display: block;
                  font-size: 12px;
                }
              }
              .like {
                font-size: 14px;
                span {
                  margin-left: 5px;
                }
              }
            }
            .conter {
              width: 100%;
              padding: 10px 0 0 50px;
              span {
                word-break: break-all;
                width: auto;
                display: block;
                white-space: pre-wrap;
                text-align: left;
                font-size: 13px;
                color: white;
              }
            }
          }
        }
      }
    }
    .range {
      display: flex;
      margin: 0 auto;
      input {
        width: 70vw;
        margin: 0 auto;
      }
      span {
        width: 10vw;
        margin: 0 5vw;
        font-size: 14px;
      }
    }
  }
}
.pause {
  .pic {
    img {
      animation-play-state: paused;
    }
  }
}
.spanarr{
  color: #22d59c;
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