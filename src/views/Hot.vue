<template>
  <div class="hot">
    <ul>
        <span class="top_span">官方榜</span>
        <loading v-if="hotList.length < 1"></loading>
        <router-link :to="{path:`/list/${item.id}`,}" tag="li" v-for="item in hotList" :key="item.id" class="tops">

        <div class="img">
          <img :src="item.coverImgUrl" alt="" />
        </div>
        <div class="right">
          <h2>{{ item.name }} &gt;</h2>
          <p v-for="song in item.songList" :key="song.id">
            <span>{{ song.name }}</span> - <span v-for="i in song.ar" :key="i.id">{{ i.name }}&nbsp;&nbsp;</span>
          </p>
        </div>
        </router-link>
    </ul>
    <span @click="plus" class="dian" v-show="hot">点击加载更多</span>
    <div class="singHot">
    <ul>
       <span class="top_span">歌手榜</span>
       <div class="kong"></div>
       <loading v-if="singList.length < 1" class="loading"></loading>
       <router-link :to="{path:`/songlist/${item.id}`,}" tag="li" v-for="item in singList" :key="item.id">
          <div class="sing">
            <div class="img">
              <img :src="item.img1v1Url" alt="">
            </div>
            <span>{{item.name}}</span>
          </div>
       </router-link>
    </ul>
    </div>
    <span @click="plussing" class="dian" v-show="hot">点击加载更多</span>
  </div>
</template>

<script>
import Loading from "../components/Loading"
export default {
  name: "Hot",
  data() {
    return {
      hotList: [],
      hotLists:[],
      ranks: "",
      page:1,
      perpage:3,
      hot:true,
      singList:[],
      singLists:[],
      sing:1,
      singpage:6,
    };
  },
  components: {
      Loading
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.axios.get("/toplist").then((d) => {
        vm.hotLists = d.data.list;
        vm.songListFun(d.data.list);
        vm.hotList = vm.hotLists.slice(0,3)
      });
      vm.$axios.get("/toplist/artist").then((d)=>{
        vm.singLists = d.data.list.artists;
        vm.singList = vm.singLists.slice(0,5)
      })
    });
  },
  methods: {
    songListFun(songArr) {
      this.ranks = songArr;
      for (let item in songArr) {
        this.$axios.get("/playlist/detail?id=" + songArr[item].id).then((d) => {
          //         this.songList = d.data.playlist.tracks.slice(0,3)
          //         this.songLists.push(this.songList[item*3])
          // console.log(this.songLists);
          // $set()直接修改view视图中数据赋值对象使用
          this.$set(
            this.ranks[item],
            "songList",
            d.data.playlist.tracks.slice(0, 3)
          );
        });
      }
    },
  plus(){
        this.page++;
        let start = this.page * this.perpage;
        let end = (this.page+1) * this.perpage;
        this.hotList = this.hotList.concat(this.hotLists.slice(start,end))
        if(this.hotList.length == this.hotLists.length-3){
          this.hot=false
        }
    },
  plussing(){
        this.sing++;
        let start = this.sing * this.singpage;
        let end = (this.sing+1) * this.singpage;
        this.singList = this.singList.concat(this.singLists.slice(start,end))
        if(this.singList.length == this.singLists.length-3){
          this.hot=false
        }
    }
  },
};
</script>

<style lang="less" scoped>
.hot {
  padding-top: 47.4px;
  .top_span{
    display: block;
    text-align: center;
    padding: 10px;
    font-weight: bold;
    font-size: 18px;
  }
  .dian{
    display: block;
    text-align: center;
    color: #22d59c;
    padding: 20px 0;
  }
  ul{
    width: 90%;
    margin-left: 5%;
    .tops {
      background-color: white;
      height: 27vw;
      border-radius: 10px;
      margin: 0 0 15px 0;
      display: flex;
      &:last-child {
        margin-bottom: 0;
      }
      .img {
        flex: 0 0 30%;
        img {
          border-radius: 10px;
          width: 100%;
        }
      }
      .right {
        height: 100%;
        flex: 1;
        margin-left: 5%;
        overflow: hidden;
        h2 {
          padding: 4vw 0 0 0;
          font-size: 4.5vw;
        }
        p {
          color: #a1a4b3;
          font-size: 3vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .singHot{
    width: 100%;
    ul{
      border-radius: 10px;
      display: flex;
      flex-wrap: wrap;
      width: 94%;
      margin-left: 3%;
      background: #ffffff;
      position: relative;
      .loading{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
      }
      .top_span{
        width: 100%;
      }
      .kong{
        width: 16.66666%;
        height: 50px;
      }
      li{
        flex: 0 0 33.333%;
        padding: 0 3%;
        margin-top: 15px;
        .sing{
          width: 100%;
          .img{
            width: 100%;
              border-radius: 50%;
              overflow: hidden;
              height: 25.5vw;
          }
          span{
            display: block;
            padding-top: 7px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>