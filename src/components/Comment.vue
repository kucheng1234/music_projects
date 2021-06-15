<template>
<div>
  <div class="nominate" v-if="hotComments.length != 0">
    <h2>热门评论</h2>
    <div class="hotlists">
      <ul>
        <li v-for="item in hotComments" :key="item.commentId">
          <div class="top">
            <div class="img">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="span">
              <p>{{ item.user.nickname }}</p>
              <span class="spans">{{ item.time | formatData("m-d h:M") }}</span>
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
    </div>
  </div>
  <div class="nominate">
    <h2>最新评论</h2>
    <div class="hotlists">
      <ul>
        <li v-for="item in newComments" :key="item.commentId">
          <div class="top">
            <div class="img">
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="span">
              <p>{{ item.user.nickname }}</p>
              <span class="spans">{{ item.time | formatData("m-d h:M") }}</span>
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
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      sing:1,
      singpage:10,
    }
  },
  props: ["hotComments","newComments"],
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
  },
};
</script>

<style lang="less" scoped>
.nominate {
  margin-top: 10px;
  h2 {
    text-indent: 1em;
      color: #22d59c;
      font-weight: bold;
  }
  .hotlists {
    width: 90%;
    margin-left: 5%;
    ul {
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
            span{
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
          }
        }
      }
    }
  }
}
</style>