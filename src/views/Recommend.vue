<template>
  <div class="recommend">
    <router-link to="/search" tag="div" class="input">
      <span>搜索你想听的歌曲</span>
    </router-link>
    <!-- <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in imgList" :key="index"><img :src="item.imageUrl" alt=""></van-swipe-item>
    </van-swipe> -->
    <border-title>推荐歌单</border-title>
    <div class="recommend_songs">
      <picture-item v-for="item in recommend_songs" :key="item.id"
      :item="item"
      ></picture-item>
    </div>
    <loading v-if="recommend_songs.length <= 0"></loading>
    <border-title>推荐音乐</border-title>
    <div>
      <ul>
        <li-item v-for="item in newSongs" :key="item.id"
        :item="item" @play="$emit('play',$event)"></li-item>
      </ul>
    </div>
    <loading v-if="newSongs.length <= 0"></loading>
    <border-title>MV排行</border-title>
    <div class="mv_sort">
      <mv-item v-for="item in mv_sort" :key="item.id"
      :item="item" @stopChage="stopChage"
      ></mv-item>
    </div>
    <loading v-if="mv_sort.length <= 0"></loading>
    <!-- <border-title>ituns飙升榜</border-title> -->
  </div>
</template>

<script>
import BorderTitle from "../components/BorderTitle.vue";
import PictureItem from "../components/PictureItem.vue";
import MvItem from "../components/MvItem.vue"
import LiItem from "../components/LiItem"
import Loading from "../components/Loading"
export default {
  name: "recommend",
  components: {
    BorderTitle,
    PictureItem,
    LiItem,
    Loading,
    MvItem
  },
  data() {
    return {
      recommend_songs: [],
      mv_sort:[],
      newSongs:[],
      imgList:[],
    };
  },
  created() {
    this.$axios.get("/personalized?limit=6").then((d) => {
      this.recommend_songs = d.data.result
    });
    this.$axios.get('/top/mv?limit=10').then(d=>{
      this.mv_sort = d.data.data.map(item=>{
        item.picUrl=item.cover;
        return item
      })
    });
    this.$axios.get('personalized/newsong').then(d=>{
      this.newSongs = d.data.result
    });
    this.$axios.get('/banner').then(d=>{
      this.imgList = d.data.banners
    })
  },
  methods:{
    stopChage(event){
      if(event){
        this.$emit('stopChanges',event)
      }
    }
  }
  // beforeRouteEnter (to, from, next) {
  //   next((vm)=>{
  //     vm.$axios.get('/personalized').then(data => {
  //       console.log(data);
  //     })
  //   })
  // }
};
</script>

<style lang="less">
.recommend{
  margin-top: 60.4px;
  .input{
    width: 90%;
    margin-left: 5%;
    background: #ece4e4;
    text-align: center;
    border-radius: 10px;
    height: 5vh;
    line-height: 5vh;
    color: #a1a4b3;
    font-size: 2.3vh;
    margin-top: 5px;
  }
  .recommend_songs{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    div{
      width: 32.5%;
    }
  }
  .mv_sort{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    div{
      width: 49%;
    }
  }
  //  .my-swipe .van-swipe-item {
  //    width: 100px;
  //   color: #fff;
  //   font-size: 20px;
  //   line-height: 150px;
  //   text-align: center;
  //   background-color: #39a9ed;
  // }
  .my-swipe{
    margin-top: 10px;
    width: 100%;
    overflow: hidden;
    height: 100%;
    border-radius: 20px;
    .van-swipe-item{
      float: left;
      img{
        width: 100%;
      }
    }
  }
}
</style>
