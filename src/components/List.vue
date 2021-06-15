<template>
  <div>
    <div class="top">
      <p @click="$router.go(-1)">&lt; 返回</p>
      <div class="top_top">
        <span>歌单</span>
      </div>
      <loading v-if="lists==null"></loading>
      <div class="top_content" v-if="lists">
        <div class="img">
          <img :src="lists.coverImgUrl" alt="" />
        </div>
        <div class="top_right">
          <span class="tops">{{lists.name}}</span>
          <div class="right">
            <div class="img_one">
              <img :src="lists.creator.avatarUrl" alt="">
            </div>
            <span>{{lists.creator.nickname}}</span>
            <span class="img_span">+ 关注</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <span class="iconfont icon-xinaixin"><p>{{songListarr.playCount|news}}</p></span>
        <span class="iconfont icon-pinglun" @click="stopComs = true"><p>{{songListarr.commentCount}}</p></span>
        <span class="iconfont icon-xiazai"><p>全部下载</p></span>
        <span class="iconfont icon-fenxiang"><p>分享({{songListarr.shareCount}})</p></span>
      </div>
      <div class="all" @click="pushs" >
        <span class="all_span iconfont icon-play-circle"><span>播放全部 ({{list.length}})</span></span>
      </div>
    </div>
    <loading v-if="list.length < 1"></loading>
    <li-item
      v-for="(item, index) in list"
      :item="item"
      :key="item.id"
      @play="$emit('play', $event)"
    >
      <template v-slot:sortnum>
        <b
          :class="index + 1 <= 3 ? 'active' : ''"
          >{{ (index + 1) &lt; 10 ? '0'+(index+1) : (index+1) }}</b
        >
      </template>
    </li-item>
    <loading v-if="list.length < allList.length"></loading>
    <transition
        enter-active-class="animate__animated animate__fadeInRight"
        leave-active-class="animate__animated animate__fadeOutRight"
      >
        <div class="comment" v-show="stopComs">
          <h2
            class="iconfont icon-arrow-right-bold"
            @click="stopComs = false"
          ></h2>
          <div class="hotlists">
            <span class="actives">热门评论</span>
            <span class="actived" v-if="hotCommentsarr.length == 0">暂无热门评论</span>
            <ul>
              <li v-for="item in hotCommentsarr" :key="item.commentId">
                <div class="tops">
                  <div class="img">
                    <img :src="item.user.avatarUrl" alt="" />
                  </div>
                  <div class="span">
                    <p>{{item.user.nickname}}</p>
                    <span class="spans">{{ item.time | formatData("m-d h:M") }}</span>
                  </div>
                  <div class="like">
                    <span>{{item.likedCount}}</span>
                    <span class="iconfont icon-dianzan11"></span>
                  </div>
                </div>
                <div class="conter">
                  <span>{{item.content}}</span>
                </div>
              </li>
            </ul>
          <span class="actives">最新评论</span>
            <ul>
              <li v-for="item in commentsarr" :key="item.commentId">
                <div class="tops">
                  <div class="img">
                    <img :src="item.user.avatarUrl" alt="" />
                  </div>
                  <div class="span">
                    <p>{{item.user.nickname}}</p>
                    <span class="spans">{{ item.time | formatData("m-d h:M") }}</span>
                  </div>
                  <div class="like">
                    <span>{{item.likedCount}}</span>
                    <span class="iconfont icon-dianzan11"></span>
                  </div>
                </div>
                <div class="conter">
                  <span>{{item.content}}</span>
                </div>
              </li>
              <span @click="plus" class="spanarr">点击加载更多</span>
            </ul>
          </div>
        </div>
      </transition>
  </div>
</template>

<script>
import Loading from "../components/Loading";
import LiItem from "../components/LiItem";
export default {
  data() {
    return {
      lists: null,
      allList: [],
      list: [],
      page: 0, //记录页码
      perpage: 20, //每页显示20条
      songListarr:[],
      stopComs:false,
      hotCommentsarr:[],
      commentsarrs:[],
      commentsarr:[],
      pages:1,
      perpages:10
    };
  },
  props: ["id"],
  components: {
    LiItem,
    Loading,
  },
  filters: {
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
    news(value){
      let arr = value > 10000 ? parseInt(value/10000) + "万" : value
      return arr
    }
  },
  methods: {
    loadeMore() {
      this.page++;
      let start = this.page * this.perpage;
      let end = (this.page + 1) * this.perpage;
      this.list = this.list.concat(this.allList.slice(start, end));
    },
    onScroll() {
      let scrollHeight = document.documentElement.scrollHeight;
      let scrollTop = document.documentElement.scrollTop;
      let clientHeight = document.documentElement.clientHeight;
      if (scrollHeight - scrollTop - clientHeight < 1) {
        this.loadeMore();
      }
    },
    plus(){
        this.pages++;
        let start = this.pages * this.perpages;
        let end = (this.pages+1) * this.perpages;
        this.commentsarr = this.commentsarr.concat(this.commentsarrs.slice(start,end))
    },
    pushs(){
        this.$emit('res',this.list)
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$nextTick(() => {
        vm.$axios.get("/playlist/detail?id=" + vm.id).then((d) => {
          vm.lists = d.data.playlist;
          vm.allList = d.data.playlist.tracks.map((data, index) => {
            data.song = {
              privilege: d.data.privileges[index],
              artists: data.ar,
              album: data.al,
            };
            return data;
          });
          vm.list = vm.allList.slice(0, 20);
        });
        vm.$axios.get("/playlist/detail/dynamic?id=" + vm.id).then(d=>{
          vm.songListarr = d.data
        })
        vm.$axios.get("/comment/playlist?id=" + vm.id + "&limit=100").then(d=>{
          vm.hotCommentsarr = d.data.hotComments.slice(0,5)
          vm.commentsarrs = d.data.comments
          vm.commentsarr = vm.commentsarrs.slice(0,10)
        })
      });
      window.addEventListener("scroll", vm.onScroll);
    });
  },
};
</script>

<style lang="less" scoped>
.top {
  width: 100%;
  position: relative;
  background: #c06d67;
    color: #ffffff;
    
    .all{
      position: absolute;
      bottom: 10px;
      left: 10px;
      color: #000;
      z-index: 666;
      .icon-play-circle::before{
        font-size: 20px;
        position: absolute;
      }
      .iconfont{
        span{
          margin-left: 25px;
        }
      }
    }
    &::after{
      content: '';
      display: block;
      clear: both;
      width: 100%;
      position: absolute;
      bottom: 0;
      height: 40px;
      background: #fafafa;
      border-radius: 20px 20px 0 0;
      border-bottom: 1px solid #ccc;
    }
  .top_top {
    text-align: center;
    padding: 5px 0;
  }
  p {
    color: #ffffff;
    font-size: 14px;
    padding: 5px 10px;
    position: absolute;
  }
  .top_content{
    display: flex;
    padding: 10px 20px;
    height: 120px;
    .tops{
      font-size: 18px;
    }
    .img{
      flex: 0 0 100px;
      img{
        
        border-radius: 10px;
      }
    }
    .top_right{
      flex: 1;
      padding-left: 20px;
      .right{
        display: flex;
        height: 30px;
        align-items: center;
        // line-height: 30px;
        margin-top: 10px;
        .img_one{
          height: 100%;
          flex: 0 0 30px;
            img{
              border-radius: 50%;
            }
        }
        span{
          margin-left: 10px;
          font-size: 14px;
        }
        .img_span{
          border: 1px solid #e3b7ae;
          border-radius: 10px;
          padding: 1px 8px;
          font-size: 12px;
        }
      }
    }
  }
}
.bottom{
  display: flex;
  width: 100%;
  span{
    flex: 0 0 25%;
    display: block;
    text-align: center;
    padding:5px 0 75px 0;
    font-size: 20px;
    p{
      font-size: 13px;
      width: 25%;
      text-align: center;
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
      .actives{
        display: block;
        margin-top: 10px;
        color: red;
        font-weight: bold;
        text-align: center;
      }
      h2{
        position: fixed;
        font-size: 20px;
        color: #22d59c;
        right: 5px;
        top: 5px;
      }
      .hotlists {
        width: 90%;
        margin-left: 5%;
        ul {
          padding-bottom: 10px;
          li {
            margin-top: 10px;
            padding: 5px 0;
            .tops {
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
              }
            }
          }
        }
      }
    }
.active {
  color: red;
}
.spanarr{
      display: block;
      text-align: center;
      color: #22d59c;
    }
.actived {
  display: block;
        margin-top: 10px;
        color: white;
        font-weight: bold;
        text-align: center;
}
</style>