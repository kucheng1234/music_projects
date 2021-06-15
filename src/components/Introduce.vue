<template>
  <div class="introduce">
    <div class="message">
      <span class="span">歌手信息</span>
      <p :class="[unfold == true ? 'active' : '', 'p']">
        {{ songlist.artist.briefDesc }}
      </p>
      <p class="bottom" v-show="unfold">
        <span class="ps" @click="unfoldFun"
          >展开全部<span class="iconfont icon-arrow-down-bold"></span
        ></span>
      </p>
      <p class="bottom" v-show="!unfold">
        <span class="ps" @click="nodeFun"
          >收起全部<span class="iconfont icon-arrow-up-bold"></span
        ></span>
      </p>
    </div>
    <div class="songs">
      <span class="span">相似的歌手</span>
      <ul>
        <router-link :to="{path:`/songlist/${item.id}`}" tag="li" v-for="item in songlists" :key="item.id">
          <div class="img">
            <img :src="item.picUrl" alt="" />
          </div>
          <p>{{ item.name }}</p>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      unfold: true,
    };
  },
  props: ["songlist", "songlists"],
  methods: {
    unfoldFun() {
      this.unfold = false;
    },
    nodeFun() {
      this.unfold = true;
    },
    optionLeft() {
      return {
        direction: 2,
        limitMoveNum: 2,
      };
    },
  },
};
</script>

<style lang="less" scoped>
.introduce {
  background: #463c3d;
  padding: 0 20px;
  .message {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    .span {
      display: block;
      margin-bottom: 10px;
    }
    .p {
      margin-bottom: 5px;
      text-indent: 2em;
      font-size: 14px;
    }
    .bottom {
      text-align: center;
      margin: 15px;
      .ps {
        font-size: 10px;
        text-align: center;
        background: rgba(255, 255, 255, 0.2);
        padding: 10px 15px;
        border-radius: 20px;
        .iconfont {
          font-size: 8px;
        }
      }
    }
  }
  .songs {
    margin-top: 20px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    ul {
        display: flex;
      margin-top: 10px;
        overflow-y: hidden;
        overflow-x: auto;
      li {
        float: left;
        text-align: center;
        margin-right: 20px;
        .img {
          border-radius: 50%;
          width: 50px;
          height: 50px;
          overflow: hidden;
          img {
            height: 100%;
            width: 100%;
          }
        }
        p {
          font-size: 12px;
          margin-top: 10px;
        }
      }
    }
  }
}
.active {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>